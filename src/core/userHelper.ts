import { BigNumber, ethers, Wallet } from 'ethers';
import { TokenSigner } from 'jsontokens';
import StreamrClient, { Bytes, DataUnion } from 'streamr-client';

import browser from 'webextension-polyfill';

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
  const provider = ethers.getDefaultProvider();

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
    if (!wallet) return { error: 'Wallet is not provided' };
    const options = {
      scrypt: {
        N: 1 << 10,
      },
    };
    return await wallet.encrypt(password, options);
  }

  async function loadEncryptedWallet(
    encryptedWallet: string,
    password: Password,
  ) {
    wallet = await ethers.Wallet.fromEncryptedJson(encryptedWallet, password);
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
    });
    duHandler = client.getDataUnion(config.communityAddress);
  }

  async function getEthBalance(address: string) {
    if (!provider) return { error: 'provider is not provided' };
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  async function getAvailableBalance() {
    if (!wallet) return { error: 'Wallet is not provided' };
    if (!client) clientConnect();
    const earnings = await duHandler.getWithdrawableEarnings(wallet.address);
    return ethers.utils.formatEther(earnings);
  }

  async function signWithdrawAllTo(targetAddress: string) {
    if (!wallet || !provider) return { error: 'Wallet is not provided' };
    if (!client) clientConnect();

    return await duHandler.signWithdrawAllTo(targetAddress);
  }

  async function signWithdrawAmountTo(targetAddress: string, amount: string) {
    if (!wallet || !provider) return { error: 'Wallet is not provided' };
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
    if (typeof signature === 'string') {
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
    return signature;
  }

  async function transportMessage(message: string) {
    const tx = await duHandler.transportMessage(message);
    return { tx: tx?.transactionHash };
  }

  async function generateJWT() {
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
      resend: true,
    });
  }

  async function join(email: string) {
    return await swashApiHelper.join(await generateJWT(), {
      email,
    });
  }

  async function updateEmail(email: string) {
    return await swashApiHelper.updateEmail(await generateJWT(), {
      email,
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
    let totalReward = BigNumber.from(0);
    let totalReferral = 0;
    try {
      const res = await swashApiHelper.getReferrals(await generateJWT());
      res.forEach((obj) => {
        totalReward = totalReward.add(obj.reward || '0');
        totalReferral += obj.referral;
      });
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
    loadEncryptedWallet,
    signWithdrawAllTo,
    signWithdrawAmountTo,
    getAvailableBalance,
    getStreamrClient,
    getEthBalance,
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
