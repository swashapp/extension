import { Bytes, DataUnion, DataUnionClient } from '@dataunions/client';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { BaseProvider, getDefaultProvider } from '@ethersproject/providers';
import { computePublicKey } from '@ethersproject/signing-key';
import { formatEther, formatUnits, parseEther } from '@ethersproject/units';
import { Wallet } from '@ethersproject/wallet';
import { TokenSigner } from 'jsontokens';
import { StreamrClient } from 'streamr-client';

import { REWARD_ABI } from '../data/reward-contract-abi';

import { SIDECHAIN_DU_ABI } from '../data/sidechain-dataunion-abi';
import { WITHDRAW_MODULE_ABI } from '../data/withdraw-module-abi';
import { ConfigEntity } from '../entities/config.entity';
import { ProfileEntity } from '../entities/profile.entity';
import { Any } from '../types/any.type';
import { CommunityConfigs } from '../types/storage/configs/community.type';

import { Profile } from '../types/storage/profile.type';

import { configManager } from './configManager';
import { storageHelper } from './storageHelper';
import { swashApiHelper } from './swashApiHelper';

type Password = string | Bytes;

const userHelper = (function () {
  let config: CommunityConfigs;
  let wallet: Wallet;
  let client: StreamrClient;
  let dataunion: DataUnion;
  let withdrawContract: Contract;
  let rewardContract: Contract;
  let provider: BaseProvider;
  let gnosisProvider: BaseProvider;

  const timestamp = { value: 0, updated: 0 };
  let lastPopup = 0;

  async function init() {
    config = await configManager.getConfig('community');
    provider = getDefaultProvider();
    gnosisProvider = getDefaultProvider(config.rpcUrl);
  }

  function createWallet() {
    wallet = Wallet.createRandom();
    return wallet;
  }

  function importWallet(privateKey: string) {
    wallet = new Wallet(privateKey);
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

    wallet = await Wallet.fromEncryptedJson(
      profile.encryptedWallet,
      configs.salt,
    );
    wallet = wallet.connect(provider);
  }

  function getStreamrClient() {
    if (!wallet) return;
    if (!client) {
      client = new StreamrClient({
        auth: { privateKey: wallet.privateKey },
        metrics: false,
      });
    }
    return client;
  }

  async function getDataunion() {
    if (!wallet) return;
    if (!dataunion) {
      const duClient = new DataUnionClient({
        auth: { privateKey: wallet.privateKey },
        chain: 'gnosis',
      });
      dataunion = await duClient.getDataUnion(config.dataunionGnosisAddress);
    }
    return dataunion;
  }

  async function initWithdrawModule() {
    const sidechainContract = new Contract(
      config.dataunionGnosisAddress,
      SIDECHAIN_DU_ABI,
      gnosisProvider,
    );
    withdrawContract = new Contract(
      await sidechainContract.withdrawModule(),
      WITHDRAW_MODULE_ABI,
      gnosisProvider,
    );
  }

  async function initRewardModule() {
    rewardContract = new Contract(
      config.rewardContractAddress,
      REWARD_ABI,
      gnosisProvider,
    );
  }

  async function getBonus() {
    if (!wallet) throw Error('Wallet is not provided');
    if (!rewardContract) await initRewardModule();
    let ret = '0';
    try {
      const reward = await rewardContract.userRewards(wallet.address);
      ret = formatEther(reward);
    } catch (err) {
      console.error(err);
      console.log('Failed to fetch rewards from contract');
    }
    return ret;
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

    if (Date.now() < validDate) {
      throw Error(
        `You can not withdraw until ${new Date(validDate).toLocaleDateString(
          'en-uk',
          {
            year: 'numeric',
            month: 'numeric',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
            hourCycle: 'h24',
          },
        )}`,
      );
    }

    const amountBN = parseEther(amount);
    const minWithdraw = await withdrawContract.minimumWithdrawTokenWei();
    if (amountBN.lt(minWithdraw))
      throw Error(`Minimum withdrawal is ${formatEther(minWithdraw)}`);
  }

  async function getEthBalance(address: string) {
    if (!provider) return { error: 'provider is not provided' };
    const balance = await provider.getBalance(address);
    return formatEther(balance);
  }

  async function getAvailableBalance() {
    if (!wallet) throw Error('Wallet is not provided');
    if (!dataunion) await getDataunion();
    const earnings = await dataunion.getWithdrawableEarnings(wallet.address);
    return formatEther(earnings);
  }

  async function signWithdrawAmountTo(targetAddress: string, amount: string) {
    if (!wallet || !provider) throw Error('Wallet is not provided');
    if (!dataunion) await getDataunion();

    const amountBN = parseEther(amount);

    const withdrawableEarnings = await dataunion.getWithdrawableEarnings(
      wallet.address,
    );
    if (amountBN.gt(withdrawableEarnings)) {
      return { error: 'Nothing to withdraw' };
    }

    return await dataunion.signWithdrawAmountTo(
      targetAddress,
      amountBN.toString(),
    );
  }

  async function getWithdrawBody(recipient: string, amount: string) {
    const signature = await signWithdrawAmountTo(recipient, amount);
    const amountInWei = parseEther(amount);
    return {
      recipient: recipient,
      signature: signature,
      amount: amountInWei.toString(),
      useSponsor: false,
      sendToMainnet: false,
    };
  }

  async function withdrawToTarget(recipient: string, amount: string) {
    const data = await swashApiHelper.userWithdraw(
      await generateJWT(),
      await getWithdrawBody(recipient, amount),
    );
    return data;
  }

  async function donateToTarget(recipient: string, amount: string) {
    const data = await swashApiHelper.userDonate(
      await generateJWT(),
      await getWithdrawBody(recipient, amount),
    );
    return data;
  }

  async function generateJWT() {
    if (!wallet) throw Error('Wallet is not provided');

    if (
      timestamp.updated === 0 ||
      timestamp.updated + config.tokenExpiration < Date.now()
    ) {
      timestamp.value = await swashApiHelper.getTimestamp();
      timestamp.updated = Date.now();
    }

    const payload = {
      address: wallet.address,
      publicKey: computePublicKey(wallet.publicKey, true),
      timestamp: timestamp.value,
    };
    return new TokenSigner('ES256K', wallet.privateKey.slice(2)).sign(payload);
  }

  async function isJoinedSwash() {
    const data = await swashApiHelper.getJoinedSwash(await generateJWT());
    if (data.id) {
      await updateUserId(data.id);

      if (data.email) await updateUserEmail(data.email);
      if (data.phone) await updateUserPhone(data.phone);
      return true;
    }
    return false;
  }

  async function updateVerification() {
    const data = await swashApiHelper.getVerifiedInfo(await generateJWT());
    if (data.email) await updateUserEmail(data.email);
    if (data.phone) await updateUserPhone(data.phone);
  }

  async function isVerified() {
    const { phone } = await storageHelper.getProfile();
    return phone !== undefined;
  }

  async function isVerificationNeeded() {
    console.log(`Last verification popup ${new Date(lastPopup)}`);
    if (lastPopup < Date.now() - config.validationPopupInterval) {
      lastPopup = Date.now();
      return !(await isVerified());
    } else {
      return false;
    }
  }

  async function isAccountInitialized() {
    const profile = await storageHelper.getProfile();
    return profile.user_id !== undefined;
  }

  async function getJoinedSwash() {
    return await swashApiHelper.getJoinedSwash(await generateJWT());
  }

  async function getLatestPrograms() {
    return await swashApiHelper.getLatestPrograms(await generateJWT());
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

  async function join(requestId: string, code: string) {
    return await swashApiHelper.join(await generateJWT(), {
      type: 'email',
      requestId,
      code,
    });
  }

  async function updateEmail(requestId: string, code: string) {
    return await swashApiHelper.updateVerifiedInfo(await generateJWT(), {
      type: 'email',
      requestId,
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
  async function updateUserEmail(email: string) {
    const profile = await storageHelper.getProfile();
    if (profile.email == null || profile.email !== email) {
      profile.email = email;
      await storageHelper.saveProfile(profile);
    }
  }
  async function updateUserPhone(phone: string) {
    const profile = await storageHelper.getProfile();
    if (profile.phone == null || profile.phone !== phone) {
      profile.phone = phone;
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
    } catch (err: Any) {
      console.error(err?.message);
    }
    return 'Unknown';
  }

  async function getRewards() {
    try {
      const { reward } = await swashApiHelper.getReferralRewards(
        await generateJWT(),
      );
      return formatEther(reward);
    } catch (err: Any) {
      console.error(err?.message);
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
    } catch (err: Any) {
      console.error(err?.message);
    }

    return {
      totalReward: formatEther(totalReward.toString()),
      totalReferral,
    };
  }

  async function getUserProfile() {
    const profile = await storageHelper.getProfile();

    if (
      !profile.birth ||
      !profile.marital ||
      !profile.household ||
      !profile.employment ||
      !profile.industry
    ) {
      const data = await swashApiHelper.getAdditionalInfo(await generateJWT());
      if (data.birth) profile.birth = data.birth;
      if (data.marital) profile.marital = data.marital;
      if (data.household) profile.household = data.household;
      if (data.employment) profile.employment = data.employment;
      if (data.industry) profile.industry = data.industry;

      await storageHelper.saveProfile(profile);
    }

    return {
      user_id: profile.user_id,
      email: profile.email,
      phone: profile.phone,
      country: profile.country,
      city: profile.city,
      age: profile.age,
      income: profile.income,
      birth: profile.birth,
      marital: profile.marital,
      household: profile.household,
      employment: profile.employment,
      industry: profile.industry,
    };
  }

  async function updateUserProfile(newProfile: Profile) {
    const data = {
      birth: newProfile.birth,
      marital: newProfile.marital,
      household: newProfile.household,
      employment: newProfile.employment,
      industry: newProfile.industry,
    };

    await swashApiHelper.updateAdditionalInfo(await generateJWT(), data);
    const profile = await storageHelper.getProfile();
    await storageHelper.saveProfile({ ...profile, ...data });
  }

  return {
    init,
    createWallet,
    importWallet,
    getWalletAddress,
    getWalletPrivateKey,
    getEncryptedWallet,
    loadSavedWallet,
    checkWithdrawAllowance,
    getAvailableBalance,
    getStreamrClient,
    getEthBalance,
    generateJWT,
    withdrawToTarget,
    donateToTarget,
    isJoinedSwash,
    updateVerification,
    isVerified,
    isVerificationNeeded,
    isAccountInitialized,
    getJoinedSwash,
    getLatestPrograms,
    getUserCountry,
    getRewards,
    getReferrals,
    getWithdrawBalance,
    claimRewards,
    resendCodeToEmail,
    join,
    updateEmail,
    getBonus,
    getUserProfile,
    updateUserProfile,
  };
})();

export { userHelper };
