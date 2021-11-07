import { BigNumber, Contract, ethers, Wallet } from 'ethers';
import { formatEther, formatUnits } from 'ethers/lib/utils';
import { TokenSigner } from 'jsontokens';
import StreamrClient, { Bytes, DataUnion } from 'streamr-client';

import browser from 'webextension-polyfill';

import { SIDECHAIN_DU_ABI } from '../data/sidechain-dataunion-abi';
import { WITHDRAW_MODULE_ABI } from '../data/withdraw-module-abi';
import { ConfigEntity } from '../entities/config.entity';
import { ProfileEntity } from '../entities/profile.entity';
import { CommunityConfigs } from '../types/storage/configs/community.type';

import { configManager } from './configManager';
import { storageHelper } from './storageHelper';
import { swashApiHelper } from './swashApiHelper';

type Password = string | Bytes;

const userHelper = (function () {
  let config: CommunityConfigs;
  let wallet: Wallet;
  let client: StreamrClient;
  let duHandler: DataUnion;
  let withdrawContract: Contract;
  const provider = ethers.getDefaultProvider();
  const xdaiProvider = ethers.getDefaultProvider('https://rpc.xdaichain.com/');

  async function init() {
    config = await configManager.getConfig('community');
  }

  function createWallet() {
    wallet = ethers.Wallet.createRandom();
    return wallet;
  }

  function getWalletAddress() {
    return wallet.address;
  }

  function getWalletPrivateKey() {
    return wallet.privateKey;
  }

  async function getEncryptedWallet(password: Password) {
    if (!wallet) throw Error('Wallet is not provided');
    const options = {
      scrypt: {
        N: 1 << 10,
      },
    };
    return await wallet.encrypt(password, options);
  }

  async function loadSavedWallet() {
    const configs = await (await ConfigEntity.getInstance()).get();
    const profile = await (await ProfileEntity.getInstance()).get();

    if (!profile.encryptedWallet) throw Error('Wallet is not in the database');

    wallet = await ethers.Wallet.fromEncryptedJson(
      profile.encryptedWallet,
      configs.salt,
    );
    wallet = wallet.connect(provider);
  }

  function getStreamrClient() {
    if (!client) clientConnect();
    return client;
  }

  function clientConnect() {
    if (!wallet) return;
    client = new StreamrClient({
      auth: {
        privateKey: wallet.privateKey,
      },
      publishWithSignature: 'never',
      dataUnion: {
        factoryMainnetAddress: '0xe41439bf434f9cfbf0153f5231c205d4ae0c22e3',
        factorySidechainAddress: '0xFCE1FBFAaE61861B011B379442c8eE1DC868ABd0',
        templateMainnetAddress: '0x67352e3f7dba907af877020ae7e9450c0029c70c',
        templateSidechainAddress: '0xacf9e8134047edc671162d9404bf63a587435baa',
      },
    });
    duHandler = client.getDataUnion(config.dataunionAddress);
  }

  async function initWithdrawModule() {
    const sidechainContract = new Contract(
      duHandler.getSidechainAddress(),
      SIDECHAIN_DU_ABI,
      xdaiProvider,
    );
    withdrawContract = new Contract(
      await sidechainContract.withdrawModule(),
      WITHDRAW_MODULE_ABI,
      xdaiProvider,
    );
  }

  async function checkWithdrawAllowance(amount: string) {
    if (!wallet) throw Error('Wallet is not provided');
    if (!withdrawContract) await initWithdrawModule();

    if (await withdrawContract.blackListed(wallet.address))
      throw Error('You are blacklisted');

    const join = +formatUnits(
      await withdrawContract.memberJoinTimestamp(wallet.address),
      0,
    );
    const requiredAge = +formatUnits(
      await withdrawContract.requiredMemberAgeSeconds(),
      0,
    );

    const validDate = (join + requiredAge) * 1000;

    if (Date.now() < validDate)
      throw Error(
        `You can not withdraw until ${new Date(validDate).toISOString()}`,
      );

    const amountBN = ethers.utils.parseEther(amount);
    const minWithdraw = await withdrawContract.minimumWithdrawTokenWei();
    if (amountBN.lt(minWithdraw))
      throw Error(`Minimum withdraw is ${formatEther(minWithdraw)}`);
  }

  async function getEthBalance(address: string) {
    if (!provider) return { error: 'provider is not provided' };
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  async function getTokenBalance(address: string) {
    const mainnetTokens = await client.getTokenBalance(address);
    const sidechainTokens = await client.getSidechainTokenBalance(address);
    const balance = mainnetTokens.add(sidechainTokens);
    return ethers.utils.formatEther(balance);
  }

  async function getAvailableBalance() {
    if (!wallet) throw Error('Wallet is not provided');
    if (!client) clientConnect();
    const earnings = await duHandler.getWithdrawableEarnings(wallet.address);
    return ethers.utils.formatEther(earnings);
  }

  async function signWithdrawAllTo(targetAddress: string) {
    if (!wallet || !provider) throw Error('Wallet is not provided');
    if (!client) clientConnect();

    return await duHandler.signWithdrawAllTo(targetAddress);
  }

  async function signWithdrawAmountTo(targetAddress: string, amount: string) {
    if (!wallet || !provider) throw Error('Wallet is not provided');
    if (!client) clientConnect();

    const amountBN = ethers.utils.parseEther(amount);

    const withdrawableEarnings = await duHandler.getWithdrawableEarnings(
      wallet.address,
    );
    if (amountBN.gt(withdrawableEarnings)) {
      return { error: 'Nothing to withdraw' };
    }

    return await duHandler.signWithdrawAmountTo(
      targetAddress,
      amountBN.toString(),
    );
  }

  async function withdrawToTarget(
    recipient: string,
    amount: string,
    useSponsor: boolean,
    sendToMainnet: boolean,
  ) {
    const signature = await signWithdrawAllTo(recipient);
    const amountInWei = ethers.utils.parseEther(amount);
    const body = {
      recipient: recipient,
      signature: signature,
      amount: amountInWei.toString(),
      useSponsor: useSponsor,
      sendToMainnet: sendToMainnet,
    };
    const data = await swashApiHelper.userWithdraw(await generateJWT(), body);
    if (data.tx) return data;
    else if (data.message) {
      return transportMessage(data.message);
    }
    return data;
  }

  async function transportMessage(message: string) {
    const tx = await duHandler.transportMessage(message);
    return { tx: tx?.transactionHash };
  }

  async function generateJWT() {
    if (!wallet) throw Error('Wallet is not provided');
    if (!client) clientConnect();
    const payload = {
      address: wallet.address,
      publicKey: ethers.utils.computePublicKey(wallet.publicKey, true),
      timestamp: await swashApiHelper.getTimestamp(),
    };
    return new TokenSigner('ES256K', wallet.privateKey.slice(2)).sign(payload);
  }

  async function joinSwash() {
    browser.tabs
      .create({
        url: 'https://swashapp.io/user/join?token='.concat(await generateJWT()),
      })
      .then();
  }

  async function isJoinedSwash() {
    const data = await swashApiHelper.getJoinedSwash(await generateJWT());
    if (data.id) {
      await updateUserId(data.id);
      return true;
    }
    return false;
  }

  async function getJoinedSwash() {
    return await swashApiHelper.getJoinedSwash(await generateJWT());
  }

  async function getActiveReferral() {
    return await swashApiHelper.getActiveReferral(await generateJWT());
  }

  async function getWithdrawBalance() {
    return await swashApiHelper.getWithdrawBalance(await generateJWT());
  }

  async function claimRewards() {
    return await swashApiHelper.claimRewards(await generateJWT());
  }

  async function resendCodeToEmail(email: string) {
    return await swashApiHelper.resendCodeToEmail(await generateJWT(), {
      email,
    });
  }

  async function join(email: string, code: string) {
    return await swashApiHelper.join(await generateJWT(), {
      email,
      code,
    });
  }

  async function updateEmail(email: string, code: string) {
    return await swashApiHelper.updateEmail(await generateJWT(), {
      email,
      code,
    });
  }

  async function getUserId() {
    const profile = await storageHelper.getProfile();
    if (profile.user_id) return profile.user_id;
    return -1;
  }

  async function updateUserId(user_id: number) {
    const profile = await storageHelper.getProfile();
    if (profile.user_id == null || profile.user_id !== user_id) {
      profile.user_id = user_id;
      await storageHelper.saveProfile(profile);
    }
  }

  async function getUserCountry() {
    const profile = await storageHelper.getProfile();
    if (profile.country) {
      return { country: profile.country, city: profile.city };
    }

    try {
      const { country, city } = await swashApiHelper.getIpLocation(
        await generateJWT(),
      );
      if (country !== '') {
        profile.country = country;
        profile.city = city;
        await storageHelper.saveProfile(profile);
        return country;
      }
    } catch (err) {
      console.error(err.message);
    }
    return 'Unknown';
  }

  async function getRewards() {
    try {
      const { reward } = await swashApiHelper.getReferralRewards(
        await generateJWT(),
      );
      return ethers.utils.formatEther(reward);
    } catch (err) {
      console.error(err.message);
    }
    return '0';
  }

  async function getReferrals() {
    let totalReward = BigNumber.from('0');
    let totalReferral = '0';
    try {
      const res = await swashApiHelper.getReferrals(await generateJWT());
      totalReward = BigNumber.from(res.reward);
      totalReferral = res.count;
    } catch (err) {
      console.error(err.message);
    }

    return {
      totalReward: ethers.utils.formatEther(totalReward.toString()),
      totalReferral,
    };
  }

  return {
    init,
    createWallet,
    getWalletAddress,
    getWalletPrivateKey,
    getEncryptedWallet,
    loadSavedWallet,
    checkWithdrawAllowance,
    signWithdrawAllTo,
    signWithdrawAmountTo,
    getAvailableBalance,
    getStreamrClient,
    getEthBalance,
    getTokenBalance,
    transportMessage,
    generateJWT,
    withdrawToTarget,
    isJoinedSwash,
    getJoinedSwash,
    getActiveReferral,
    getUserCountry,
    getRewards,
    getReferrals,
    getWithdrawBalance,
    claimRewards,
    resendCodeToEmail,
    join,
    updateEmail,
  };
})();

export { userHelper };
