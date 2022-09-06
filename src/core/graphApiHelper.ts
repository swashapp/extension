import { GraphApiConfigs } from '../types/storage/configs/graph-api.type';

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
        amount
      }
    }`);
    return response.transferEntities;
  }

  async function getWithdrawals() {
    const condition = `where: {
      from: "${userHelper.getWalletAddress().toLowerCase()}",
      type: "FromMember"
    }`;
    return getTransferEntities(condition);
  }

  async function getClaims() {
    const condition = `where: {
      to: "${userHelper.getWalletAddress().toLowerCase()}",
      type: "ToMember"
    }`;
    return getTransferEntities(condition);
  }

  async function getUserHistory(type: 'Withdrawal' | 'Claim') {
    if (type === 'Withdrawal') {
      return getWithdrawals();
    } else if (type === 'Claim') {
      return getClaims();
    }
  }

  return {
    init,
    getUserHistory,
  };
})();

export { graphApiHelper };
