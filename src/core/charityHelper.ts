import { formatEther, parseEther } from '@ethersproject/units';

import { DonationConfigs } from '../types/storage/configs/donation.type';

import { configManager } from './configManager';
import { storageHelper } from './storageHelper';
import { swashApiHelper } from './swashApiHelper';
import { userHelper } from './userHelper';

const charityHelper = (function () {
  let config: DonationConfigs;
  let paymentInterval: NodeJS.Timer | undefined;

  async function init() {
    config = await configManager.getConfig('donation');
  }

  async function getCharities() {
    return swashApiHelper.getCharities(await userHelper.generateJWT());
  }

  async function getCharityMetadata() {
    return storageHelper.getCharities();
  }

  async function toggleCharityLike(id: number) {
    const charities = await storageHelper.getCharities();
    const index = charities.findIndex((charity) => charity.id === id);

    if (index >= 0) {
      if (charities[index].auto_pay) {
        charities[index].fav = !charities[index].fav;
      } else {
        charities.splice(index, 1);
      }
    } else {
      charities.push({
        id: id,
        wallet: '',
        fav: true,
        auto_pay: false,
        percentage: '0',
      });
    }

    await storageHelper.saveCharities(charities);
  }

  async function addCharityAutoPayment(
    id: number,
    wallet: string,
    percent: string,
  ) {
    const charities = await storageHelper.getCharities();
    const index = charities.findIndex((charity) => charity.id === id);

    if (index >= 0) {
      charities[index].auto_pay = true;
      charities[index].wallet = wallet;
      charities[index].percentage = percent;
    } else {
      charities.push({
        id: id,
        wallet: wallet,
        fav: false,
        auto_pay: true,
        percentage: percent,
      });
    }

    let sum = 0;

    for (const charity of charities) {
      sum += +charity.percentage;
    }

    console.log(`Sum of donation is ${sum}%`);
    if (sum < 100) await storageHelper.saveCharities(charities);
  }

  async function delCharityAutoPayment(id: number) {
    const charities = await storageHelper.getCharities();
    const index = charities.findIndex((charity) => charity.id === id);

    if (index >= 0) {
      if (charities[index].fav) {
        charities[index].auto_pay = false;
        charities[index].wallet = '';
        charities[index].percentage = '0';
      } else {
        charities.splice(index, 1);
      }
    }

    await storageHelper.saveCharities(charities);
  }

  async function paymentToCharities() {
    const profile = await storageHelper.getProfile();
    const balance = await userHelper.getAvailableBalance();

    if (profile.lastBalance && +balance > +profile.lastBalance) {
      console.log(
        `User balance is ${balance} SWASH and last balance check is ${profile.lastBalance}`,
      );

      const charities = await storageHelper.getCharities();
      const earnings = parseEther(balance).sub(parseEther(profile.lastBalance));

      console.log(
        `User had ${earnings.toString()} wei SWASH earnings since last run`,
      );

      for (const charity of charities) {
        const amount = earnings
          .mul(parseEther(charity.percentage))
          .div(parseEther('100'));
        console.log(
          `User share for charity ${
            charity.wallet
          } is ${amount.toString()} wei SWASH`,
        );

        await userHelper.withdrawToTarget(
          charity.wallet,
          formatEther(amount),
          false,
          false,
        );
        console.log(`Successfully donated to charity`);
      }

      profile.lastBalance = await userHelper.getAvailableBalance();
      console.log(`Last balance is ${profile.lastBalance} SWASH`);
      await storageHelper.saveCharities(charities);
    } else {
      profile.lastBalance = balance;
      console.log(
        `Last balance is not up to date, new value is ${balance} SWASH`,
      );
    }

    await storageHelper.saveProfile(profile);
  }

  async function startAutoPayment() {
    paymentInterval && clearInterval(paymentInterval);
    paymentInterval = setInterval(paymentToCharities, config.paymentInterval);
  }

  return {
    init,
    getCharities,
    getCharityMetadata,
    toggleCharityLike,
    addCharityAutoPayment,
    startAutoPayment,
    delCharityAutoPayment,
  };
})();

export { charityHelper };
