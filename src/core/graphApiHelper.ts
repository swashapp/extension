import { Any } from '../types/any.type';
import { GraphApiConfigs } from '../types/storage/configs/graph-api.type';

import { charityHelper } from './charityHelper';
import { configManager } from './configManager';
import { userHelper } from './userHelper';

const graphApiHelper = (function () {
  let config: GraphApiConfigs;

  async function init() {
    config = await configManager.getConfig('graphAPI');
  }

  async function executeQuery(query: string) {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    return (await response.json()).data;
  }

  async function getMemberStatusEntities(condition: string) {
    const response = await executeQuery(`
    {
      memberStatusEntities(
        first: 1000, 
        skip: 0, 
        ${condition}
        orderBy: time,
        orderDirection: desc
      ) {
        id
        time
        status
      }
    }`);
    return response.memberStatusEntities;
  }

  async function getTransferEntities(condition: string) {
    const response = await executeQuery(`
    {
      transferEntities(
        first: 1000, 
        skip: 0, 
        ${condition}
        orderBy: time,
        orderDirection: desc
      ) {
        id
        time
        to
        amount
      }
    }`);
    return response.transferEntities;
  }

  async function getClaims() {
    const condition = `where: {
      to: "${userHelper.getWalletAddress().toLowerCase()}",
      type: "ToMember"
    }`;
    return getTransferEntities(condition);
  }

  async function getDonations() {
    const charities: Any[] = await charityHelper.getCharities();
    const condition = `where: {
      from: "${userHelper.getWalletAddress().toLowerCase()}",
      to_in: ["${charities
        .map((charity) => charity.address.toLowerCase())
        .join('","')}"]
      type: "FromMember"
    }`;
    return getTransferEntities(condition);
  }

  async function getManagement() {
    const condition = `where: {
      member: "${userHelper.getWalletAddress().toLowerCase()}",
    }`;
    return getMemberStatusEntities(condition);
  }

  async function getWithdrawals() {
    const charities: Any[] = await charityHelper.getCharities();
    const condition = `where: {
      from: "${userHelper.getWalletAddress().toLowerCase()}",
      to_not_in: ["${charities
        .map((charity) => charity.address.toLowerCase())
        .join('","')}"]
      type: "FromMember"
    }`;
    return getTransferEntities(condition);
  }

  async function getUserHistory(
    type: 'Claim' | 'Donation' | 'Management' | 'Withdrawal',
  ) {
    if (type === 'Claim') {
      return getClaims();
    } else if (type === 'Donation') {
      return getDonations();
    } else if (type === 'Management') {
      return getManagement();
    } else if (type === 'Withdrawal') {
      return getWithdrawals();
    }
    return [];
  }

  return {
    init,
    getUserHistory,
  };
})();

export { graphApiHelper };
