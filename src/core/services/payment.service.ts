import { parseUnits } from "ethers";

import { AcceptedAuth, RequestMethod } from "@/enums/api.enum";
import { PaymentHistory } from "@/enums/history.enum";
import { WithdrawType } from "@/enums/withdraw.enum";
import { BalanceRes, RewardRes } from "@/types/api/balance.type";
import {
  DonationHistoryRes,
  DonationHistoryTableRes,
  HistoryReq,
  PaymentHistoryRes,
  PaymentHistoryTableRes,
  ReferralHistoryRes,
  ReferralHistoryTableRes,
  WithdrawHistoryRes,
  WithdrawHistoryTableRes,
} from "@/types/api/history.type";
import {
  ConvertSwashAmountReq,
  GetGiftCardProductReq,
  GetGiftCardProductRes,
  GetVoucherRes,
  WithdrawNetworkInfoRes,
  WithdrawReq,
  WithdrawReqParams,
} from "@/types/api/withdraw.type";
import { formatDate } from "@/utils/date.util";
import { purgeNumber } from "@/utils/string.util";

import { BaseSwashService } from "../base/swash.service";
import { CacheManager } from "../managers/cache.manager";
import { WalletManager } from "../managers/wallet.manager";

export class PaymentService extends BaseSwashService {
  constructor(wallet: WalletManager, cache: CacheManager) {
    super("https://gateway-dev.swashapp.io/", wallet, cache);
  }

  public async getBalance(): Promise<BalanceRes> {
    const balance = await this.fetch<
      void,
      { swashAmount: string; usdtAmount: string }
    >(`/payment/v1/auth/balance/balance`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      cache: { ttl: 1 },
    });

    return {
      balance: +purgeNumber(balance.swashAmount),
      balanceInUSD: +purgeNumber(balance.usdtAmount),
    };
  }

  public async getPaymentHistory(
    page: number,
    size: number,
  ): Promise<[PaymentHistoryTableRes[], number]> {
    const [history, total] = await this.fetch<
      HistoryReq,
      [PaymentHistoryRes[], number]
    >(`/payment/v1/auth/payment/history`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: { page, pageSize: size },
      cache: { ttl: 1 },
    });

    const data = history.map(({ date, amount, module }) => ({
      date: formatDate(date),
      amount: purgeNumber(amount),
      module,
    }));

    return [data, total];
  }

  private async withdraw<K extends keyof WithdrawReqParams>(
    url: string,
    type: K,
    receiver: string,
    amount: number,
    decimal: number,
    data: WithdrawReqParams[K],
  ): Promise<WithdrawNetworkInfoRes[]> {
    const timestamp = Math.floor((await this.getServerTimestamp()) / 1000);
    const validity = 36000;

    return this.fetch<WithdrawReq<K>, WithdrawNetworkInfoRes[]>(url, {
      method: RequestMethod.POST,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        userSignature: this.wallet.signCheck(
          type,
          receiver,
          parseUnits(`${amount}`, decimal),
          timestamp,
          validity,
          ...Object.values(data),
        ),
        withdrawType: type,
        userWallet: this.wallet.getAddress(),
        receiver: receiver,
        withdrawAmount: amount,
        withdrawTime: timestamp,
        validityTime: validity,
        ...data,
      },
      timeout: 75000,
    });
  }

  public async withdrawByCrypto(
    receiver: string,
    amount: number,
    decimal: number,
    networkId: number,
    token: string,
  ): Promise<WithdrawNetworkInfoRes[]> {
    return this.withdraw(
      `/payment/v1/auth/withdraw`,
      WithdrawType.Normal,
      receiver,
      amount,
      decimal,
      {
        targetNetworkId: networkId,
        targetToken: token,
      },
    );
  }

  public async getWithdrawInfo(): Promise<WithdrawNetworkInfoRes[]> {
    return this.fetch<void, WithdrawNetworkInfoRes[]>(
      `/payment/v1/auth/withdraw/info`,
      {
        method: RequestMethod.GET,
        headers: {
          Authorization: await this.generateToken(AcceptedAuth.EWT),
        },
        cache: { ttl: 1 },
      },
    );
  }

  public async convertAmountFromSwash(
    networkId: string,
    token: string,
    amount: number,
  ): Promise<number> {
    return +(await this.fetch<ConvertSwashAmountReq, string>(
      `/payment/v1/auth/withdraw/convert-amount-from-swash`,
      {
        method: RequestMethod.GET,
        headers: {
          Authorization: await this.generateToken(AcceptedAuth.EWT),
        },
        data: { networkId, outputTokenAddress: token, amount },
        cache: { ttl: 1 },
      },
    ));
  }

  public async getWithdrawHistory(
    page: number,
    size: number,
  ): Promise<[WithdrawHistoryTableRes[], number]> {
    const [history, total] = await this.fetch<
      HistoryReq,
      [WithdrawHistoryRes[], number]
    >(`/payment/v1/auth/withdraw/history`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: { page, pageSize: size },
      cache: { ttl: 1 },
    });

    const data = history.map(
      ({ date, amount, targetWallet, network, token }) => ({
        date: formatDate(date),
        amount: purgeNumber(amount),
        network,
        token,
        receiver: targetWallet,
      }),
    );

    return [data, total];
  }

  public async getTopGiftCardProducts(): Promise<GetGiftCardProductRes[]> {
    return this.fetch<GetGiftCardProductReq, GetGiftCardProductRes[]>(
      `/payment/v1/auth/gift-card/top-products`,
      {
        method: RequestMethod.GET,
        headers: {
          Authorization: await this.generateToken(AcceptedAuth.EWT),
        },
        data: { country: this.cache.getData("location").country_code },
        cache: { ttl: 1 },
      },
    );
  }

  public async getGiftCardProducts(): Promise<GetGiftCardProductRes[]> {
    return this.fetch<GetGiftCardProductReq, GetGiftCardProductRes[]>(
      `/payment/v1/auth/gift-card/products`,
      {
        method: RequestMethod.GET,
        headers: {
          Authorization: await this.generateToken(AcceptedAuth.EWT),
        },
        data: { country: this.cache.getData("location").country_code },
        cache: { ttl: 1 },
      },
    );
  }

  public async getVouchers(): Promise<GetVoucherRes[]> {
    return this.fetch<void, GetVoucherRes[]>(`/payment/v1/auth/voucher`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      cache: { ttl: 1 },
    });
  }

  public async getReferralReward(): Promise<RewardRes> {
    const [reward, rewardInUSD] = await this.fetch<void, [string, string]>(
      `/payment/v1/auth/referral/sum`,
      {
        method: RequestMethod.GET,
        headers: {
          Authorization: await this.generateToken(AcceptedAuth.EWT),
        },
        cache: { ttl: 1 },
      },
    );

    return {
      reward: purgeNumber(reward, 4),
      rewardInUSD: purgeNumber(rewardInUSD, 4),
    };
  }

  public async getReferralHistory(
    page: number,
    size: number,
  ): Promise<[ReferralHistoryTableRes[], number]> {
    const [history, total] = await this.fetch<
      HistoryReq,
      [ReferralHistoryRes[], number]
    >(`/payment/v1/auth/referral/history`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: { page, pageSize: size },
      cache: { ttl: 1 },
    });
    const data = history.map(({ date, amount, refereeWallet }) => ({
      date: formatDate(date),
      amount: purgeNumber(amount),
      referee: refereeWallet,
    }));

    return [data, total];
  }

  public async donate(
    receiver: string,
    amount: number,
  ): Promise<WithdrawNetworkInfoRes[]> {
    return this.withdraw(
      `/payment/v1/auth/donate`,
      WithdrawType.Donation,
      receiver,
      amount,
      18,
      {},
    );
  }

  public async getDonationHistory(
    page: number,
    size: number,
  ): Promise<[DonationHistoryTableRes[], number]> {
    const [history, total] = await this.fetch<
      HistoryReq,
      [DonationHistoryRes[], number]
    >(`/payment/v1/auth/donate/history`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: { page, pageSize: size },
      cache: { ttl: 1 },
    });
    const data = history.map(({ date, amount, charityName }) => ({
      date: formatDate(date),
      amount: purgeNumber(amount),
      charity: charityName,
    }));

    return [data, total];
  }

  public async getHistory(
    type: PaymentHistory.PAYMENT,
    page: number,
    size: number,
  ): Promise<[PaymentHistoryTableRes[], number]>;
  public async getHistory(
    type: PaymentHistory.WITHDRAW,
    page: number,
    size: number,
  ): Promise<[WithdrawHistoryTableRes[], number]>;
  public async getHistory(
    type: PaymentHistory.REFERRAL,
    page: number,
    size: number,
  ): Promise<[ReferralHistoryTableRes[], number]>;
  public async getHistory(
    type: PaymentHistory.DONATE,
    page: number,
    size: number,
  ): Promise<[DonationHistoryTableRes[], number]>;
  public async getHistory<K extends PaymentHistory>(
    type: K,
    page: number,
    size: number,
  ) {
    switch (type) {
      case PaymentHistory.PAYMENT:
        return this.getPaymentHistory(page, size);
      case PaymentHistory.WITHDRAW:
        return this.getWithdrawHistory(page, size);
      case PaymentHistory.REFERRAL:
        return this.getReferralHistory(page, size);
      case PaymentHistory.DONATE:
        return this.getDonationHistory(page, size);
    }
  }
}
