import { parseUnits } from "ethers";

import { BaseSwashService } from "@/core/base/swash.service";
import { AcceptedAuth } from "@/enums/api.enum";
import { PaymentHistory } from "@/enums/history.enum";
import { WithdrawType } from "@/enums/withdraw.enum";
import { BalanceRes, RewardRes } from "@/types/api/balance.type";
import { DonateToCharityReq } from "@/types/api/charity.type";
import {
  DonationHistoryRes,
  DonationHistoryTableRes,
  HistoryReq,
  HistoryRes,
  HistoryTableRes,
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
  GiftCardInfoRes,
  OngoingWithdrawRes,
  VerifyThresholdRes,
  VoucherRes,
  WithdrawGiftCardReq,
  WithdrawInfoRes,
  WithdrawTokenReq,
  WithdrawVoucherReq,
} from "@/types/api/withdraw.type";
import { Managers } from "@/types/app.type";
import { PaymentServicesConfiguration } from "@/types/storage/configuration.type";
import { formatDate } from "@/utils/date.util";
import { purgeNumber } from "@/utils/string.util";

export class PaymentService extends BaseSwashService<PaymentServicesConfiguration> {
  constructor({ coordinator, cache, configs, wallet }: Managers) {
    super(configs.get("apis").payment, wallet, cache);

    coordinator.subscribe("isOutOfDate", (value, oldValue) => {
      if (value !== oldValue && !value) this.conf = configs.get("apis").payment;
    });
  }

  private async getWithdrawTime() {
    const timestamp = Math.floor((await this.getServerTimestamp()) / 1000);
    return { timestamp, validity: 36000 };
  }

  public async getBalance(): Promise<BalanceRes> {
    const balance = await this.fetch<
      void,
      { swashAmount: string; usdtAmount: string }
    >({
      ...this.conf.get_balance,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
    });

    return {
      balance: +purgeNumber(balance.swashAmount),
      balanceInUSD: +purgeNumber(balance.usdtAmount),
    };
  }

  public async getPaymentHistory(
    page: number,
    size: number,
  ): Promise<HistoryTableRes<PaymentHistoryTableRes>> {
    const { list, total } = await this.fetch<
      HistoryReq,
      HistoryRes<PaymentHistoryRes>
    >({
      ...this.conf.get_payment_history,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: { page, pageSize: size },
    });

    return {
      data: list.map(({ date, amount, module }) => ({
        date: formatDate(date),
        module,
        amount: purgeNumber(amount),
      })),
      total,
    };
  }

  public async getWithdrawInfo(): Promise<WithdrawInfoRes> {
    return this.fetch<void, WithdrawInfoRes>({
      ...this.conf.get_withdraw_info,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
    });
  }

  public async withdrawByCrypto(
    receiver: string,
    amount: number,
    decimal: number,
    networkId: number,
    token: string,
  ): Promise<boolean> {
    const type = WithdrawType.Normal;
    const { timestamp, validity } = await this.getWithdrawTime();

    return this.fetch<WithdrawTokenReq, boolean>({
      ...this.conf.withdraw_by_crypto,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        withdrawType: type,
        userWallet: this.wallet.getAddress(),
        receiver: receiver,
        withdrawAmount: amount,
        withdrawTime: timestamp,
        validityTime: validity,
        targetNetworkId: networkId,
        targetToken: token,
        userSignature: this.wallet.signCheck(
          type,
          receiver,
          parseUnits(`${amount}`, decimal),
          networkId,
          token,
          timestamp,
          validity,
        ),
      },
    });
  }

  public async withdrawByGiftCard(
    amount: number,
    company: string,
  ): Promise<string> {
    const type = WithdrawType.GiftCard;
    const { timestamp, validity } = await this.getWithdrawTime();

    return this.fetch<WithdrawGiftCardReq, string>({
      ...this.conf.withdraw_by_gift_card,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        userWallet: this.wallet.getAddress(),
        amount,
        company,
        withdrawTime: timestamp,
        validityTime: validity,
        userSignature: this.wallet.signCheck(
          type,
          parseUnits(`${amount}`, 18),
          company,
          timestamp,
          validity,
        ),
      },
    });
  }

  public async withdrawByVoucher(
    { id: voucherId, amount }: VoucherRes,
    company: string,
  ): Promise<string> {
    const type = WithdrawType.GiftCardVoucher;
    const { timestamp, validity } = await this.getWithdrawTime();

    return this.fetch<WithdrawVoucherReq, string>({
      ...this.conf.withdraw_by_voucher,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        userWallet: this.wallet.getAddress(),
        amount: +amount,
        company,
        voucherId,
        withdrawTime: timestamp,
        validityTime: validity,
        userSignature: this.wallet.signCheck(
          type,
          parseUnits(`${amount}`, 18),
          company,
          +voucherId,
          timestamp,
          validity,
        ),
      },
    });
  }

  public async getVerifyThreshold(): Promise<VerifyThresholdRes> {
    return this.fetch<void, VerifyThresholdRes>({
      ...this.conf.get_verify_threshold,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
    });
  }

  public async getOngoingPayment(): Promise<OngoingWithdrawRes> {
    return this.fetch<void, OngoingWithdrawRes>({
      ...this.conf.get_ongoing_withdraw,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
    });
  }

  public async getWithdrawHistory(
    page: number,
    size: number,
  ): Promise<HistoryTableRes<WithdrawHistoryTableRes>> {
    const { list, total } = await this.fetch<
      HistoryReq,
      HistoryRes<WithdrawHistoryRes>
    >({
      ...this.conf.get_withdraw_history,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: { page, pageSize: size },
    });

    return {
      data: list.map(({ date, amount, targetWallet, network, token }) => ({
        date: formatDate(date),
        receiver: targetWallet,
        network,
        token,
        amount: purgeNumber(amount),
      })),
      total,
    };
  }

  public async convertSwashAmount(
    networkId: string,
    token: string,
    amount: number,
  ): Promise<number> {
    return +(await this.fetch<ConvertSwashAmountReq, string>({
      ...this.conf.convert_swash_amount,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: { networkId, outputTokenAddress: token, amount },
    }));
  }

  public async getGiftCardInfo(): Promise<GiftCardInfoRes> {
    return this.fetch<void, GiftCardInfoRes>({
      ...this.conf.get_gift_card_info,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
    });
  }

  public async getGiftCardProducts(
    country: string,
    amount: string,
  ): Promise<GetGiftCardProductRes[]> {
    return this.fetch<GetGiftCardProductReq, GetGiftCardProductRes[]>({
      ...this.conf.get_gift_card_products,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: { country, amount },
    });
  }

  public async getVouchers(): Promise<GetVoucherRes> {
    return this.fetch<void, GetVoucherRes>({
      ...this.conf.get_vouchers,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
    });
  }

  public async getReferralReward(): Promise<RewardRes> {
    const [reward, rewardInUSD] = await this.fetch<void, [string, string]>({
      ...this.conf.get_referral_rewards,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
    });

    return {
      reward: purgeNumber(reward, 4),
      rewardInUSD: purgeNumber(rewardInUSD, 4),
    };
  }

  public async getReferralHistory(
    page: number,
    size: number,
  ): Promise<HistoryTableRes<ReferralHistoryTableRes>> {
    const { list, total } = await this.fetch<
      HistoryReq,
      HistoryRes<ReferralHistoryRes>
    >({
      ...this.conf.get_referral_history,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: { page, pageSize: size },
    });
    return {
      data: list.map(({ date, amount, refereeWallet }) => ({
        date: formatDate(date),
        amount: purgeNumber(amount),
        referral: refereeWallet,
      })),
      total,
    };
  }

  public async donate(receiver: string, amount: number): Promise<boolean> {
    const type = WithdrawType.Donation;
    const { timestamp, validity } = await this.getWithdrawTime();

    return this.fetch<DonateToCharityReq, boolean>({
      ...this.conf.donate,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        withdrawType: type,
        userWallet: this.wallet.getAddress(),
        receiver: receiver,
        withdrawAmount: amount,
        withdrawTime: timestamp,
        validityTime: validity,
        userSignature: this.wallet.signCheck(
          type,
          receiver,
          parseUnits(`${amount}`, 18),
          timestamp,
          validity,
        ),
      },
    });
  }

  public async getDonationHistory(
    page: number,
    size: number,
  ): Promise<HistoryTableRes<DonationHistoryTableRes>> {
    const { list, total } = await this.fetch<
      HistoryReq,
      HistoryRes<DonationHistoryRes>
    >({
      ...this.conf.get_donation_history,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: { page, pageSize: size },
    });

    const charities = this.cache.getData("charity");
    return {
      data: list.map(({ date, amount, charityWallet }) => ({
        date: formatDate(date),
        charity:
          charities.find((charity) => charity.wallet === charityWallet)?.name ||
          charityWallet,
        amount: purgeNumber(amount),
      })),
      total,
    };
  }

  public async getHistory(
    type: PaymentHistory.PAYMENT,
    page: number,
    size: number,
  ): Promise<HistoryTableRes<PaymentHistoryTableRes>>;
  public async getHistory(
    type: PaymentHistory.WITHDRAW,
    page: number,
    size: number,
  ): Promise<HistoryTableRes<WithdrawHistoryTableRes>>;
  public async getHistory(
    type: PaymentHistory.REFERRAL,
    page: number,
    size: number,
  ): Promise<HistoryTableRes<ReferralHistoryTableRes>>;
  public async getHistory(
    type: PaymentHistory.DONATE,
    page: number,
    size: number,
  ): Promise<HistoryTableRes<DonationHistoryTableRes>>;
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
