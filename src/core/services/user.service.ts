import { BaseError } from "@/base-error";
import { AppCoordinator } from "@/core/app-coordinator";
import { BaseSwashService } from "@/core/base/swash.service";
import {
  AcceptedAuth,
  DeviceType,
  VerificationActionType,
  VerificationType,
} from "@/enums/api.enum";
import { AppStages } from "@/enums/app.enum";
import { SystemMessage } from "@/enums/message.enum";
import { Any } from "@/types/any.type";
import {
  AccountInfoRes,
  GetAccountDetailsQuery,
  GetEncryptedDataRes,
  GetMergeHistoryRes,
  GetMigrationRes,
  LoginAccountRes,
  MergeAccountReq,
  MigrateAccountReq,
  RegisterAccountReq,
  ResetAccountReq,
} from "@/types/api/account.type";
import { GetAppConfigQuery, GetAppConfigRes } from "@/types/api/app.type";
import { GetCharityInfoRes } from "@/types/api/charity.type";
import { RegisterDeviceReq } from "@/types/api/device.type";
import {
  AddOngoingDonationReq,
  DeleteOngoingDonationReq,
  OngoingDonationRes,
} from "@/types/api/donation.type";
import {
  GetAdditionalInfoRes,
  GetAvailableInfo,
  ModifyAdditionalInfoReq,
} from "@/types/api/info.type";
import {
  AddReferralLinkReq,
  DefaultReferralLinkReq,
  ReferralLinkRes,
  ReferralSummaryRes,
} from "@/types/api/referral.type";
import {
  InitVerificationReq,
  InitVerificationRes,
  ResetVerificationReq,
  VerifyCodeReq,
} from "@/types/api/verification.type";
import { Managers } from "@/types/app.type";
import {
  ApiPathConfiguration,
  UserServicesConfiguration,
} from "@/types/storage/configuration.type";
import { WalletOptions } from "@/types/wallet.type";
import { getAppName, getAppVersion, getSystemInfo } from "@/utils/browser.util";
import { formatDate } from "@/utils/date.util";
import { normalizeEmail } from "@/utils/email.util";
import { decrypt, encrypt, pbkdf2 } from "@/utils/security.util";
import { purgeString } from "@/utils/string.util";
import {
  createOrLoadWallet,
  signV2WithdrawCheck,
  signWithES256K,
} from "@/utils/wallet.util";

export class UserService extends BaseSwashService<UserServicesConfiguration> {
  private readonly coordinator: AppCoordinator;

  constructor({ coordinator, cache, configs, wallet }: Managers) {
    super(configs.get("apis").user, wallet, cache);

    this.coordinator = coordinator;
    this.getAppConfig = this.getAppConfig.bind(this);

    coordinator.subscribe("isOutOfDate", (value, oldValue) => {
      if (value !== oldValue && !value)
        this.updateConfig(configs.get("apis").user);
    });
  }

  private generateEncryptionKey(email: string, masterPassword: string) {
    if (!masterPassword)
      throw new BaseError(SystemMessage.NOT_ALLOWED_EMPTY_PASSWORD);

    const _email = normalizeEmail(email);
    const key = pbkdf2(masterPassword, _email, 6000);
    const password = pbkdf2(masterPassword, _email, 6001);

    return { password, key };
  }

  public async verify(
    action: VerificationActionType,
    challenge: string,
    type?: VerificationType,
    value?: string,
  ): Promise<InitVerificationRes> {
    let data: Any = { "g-recaptcha-response": challenge };
    if (type && value) data = { type, [type]: value, ...data };

    return await this.fetch<InitVerificationReq, InitVerificationRes>({
      ...this.conf.init_verify,
      path: `${this.conf.init_verify.path}/${action}`,
      headers: { Authorization: await this.generateToken(AcceptedAuth.EWT) },
      data: data as InitVerificationReq,
    });
  }

  public async resetVerify(
    type: VerificationType,
    requestId: string,
  ): Promise<InitVerificationRes> {
    return await this.fetch<ResetVerificationReq, InitVerificationRes>({
      ...this.conf.reset_verify,
      headers: { Authorization: await this.generateToken(AcceptedAuth.EWT) },
      data: {
        type,
        request_id: requestId,
      },
    });
  }

  public async register(
    email: string,
    masterPassword: string,
    referral: string,
    requestId: string,
    code: string,
  ): Promise<void> {
    const { password, key } = this.generateEncryptionKey(email, masterPassword);
    const data = encrypt(this.wallet.get(), key);

    await this.fetch<RegisterAccountReq, AccountInfoRes>({
      ...this.conf.register,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        type: VerificationType.EMAIL,
        request_id: requestId,
        referral_code: referral || undefined,
        code,
        data,
        password,
      },
    });
  }

  public async getEncryptedData(
    email: string,
    masterPassword: string,
  ): Promise<void> {
    const { password, key } = this.generateEncryptionKey(email, masterPassword);

    const { data } = await this.fetch<void, GetEncryptedDataRes>({
      ...this.conf.get_encrypted_data,
      headers: {
        Authorization: await this.generateToken(
          AcceptedAuth.BASIC,
          email,
          password,
        ),
      },
    });
    const privateKey = decrypt(data, key);
    await this.wallet.assign({ privateKey });

    await this.cache.clearSession(AcceptedAuth.EWT);
  }

  public async login(): Promise<void> {
    const { arch, osName, osVersion, userAgent } = await getSystemInfo();
    const { location, ...account } = await this.fetch<
      RegisterDeviceReq,
      LoginAccountRes
    >({
      ...this.conf.login,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        device_key: this.cache.get("device_key"),
        device_type: DeviceType.EXTENSION,
        app_name: getAppName(),
        app_version: getAppVersion(),
        arch,
        os_name: osName,
        os_version: osVersion,
        user_agent: userAgent,
      },
    });

    await this.cache.clearSession(AcceptedAuth.EWT);
    await this.coordinator.set("stage", AppStages.READY);

    await this.cache.setData("account", { ...account }, { ttl: 3600000 });
    await this.cache.setData("location", location, {
      ttl: Number.MAX_SAFE_INTEGER,
    });
  }

  private async resetAccount(
    request: ApiPathConfiguration,
    email: string,
    masterPassword: string,
    requestId: string,
    code: string,
  ): Promise<void> {
    const { password, key } = this.generateEncryptionKey(email, masterPassword);
    const data = encrypt(this.wallet.get(), key);

    await this.fetch<ResetAccountReq, void>({
      ...request,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        type: VerificationType.EMAIL,
        request_id: requestId,
        code,
        data,
        password,
      },
    });
  }

  public async resetPassword(
    email: string,
    masterPassword: string,
    requestId: string,
    code: string,
  ): Promise<void> {
    await this.resetAccount(
      this.conf.reset_password,
      email,
      masterPassword,
      requestId,
      code,
    );
  }

  public async resetWallet(
    email: string,
    masterPassword: string,
    requestId: string,
    code: string,
  ): Promise<void> {
    await this.resetAccount(
      this.conf.reset_wallet,
      email,
      masterPassword,
      requestId,
      code,
    );
  }

  public async getMigrationStatus(
    walletOptions?: WalletOptions,
  ): Promise<GetMigrationRes> {
    const tempWallet = walletOptions
      ? createOrLoadWallet(walletOptions)
      : this.wallet.getSigner();

    return this.fetch<void, GetMigrationRes>({
      ...this.conf.get_migration,
      headers: {
        Authorization: this.tokenToString(
          AcceptedAuth.EWT,
          signWithES256K(tempWallet, {
            public_key: tempWallet.signingKey.compressedPublicKey,
            timestamp: await this.getServerTimestamp(),
          }),
        ),
      },
    });
  }

  public async migrate(email: string, masterPassword: string): Promise<void> {
    const { password, key } = this.generateEncryptionKey(email, masterPassword);
    const data = encrypt(this.wallet.get(), key);

    await this.fetch<MigrateAccountReq, AccountInfoRes>({
      ...this.conf.migrate,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        data,
        password,
      },
    });
  }

  public async merge(
    amount: string,
    withdrawn: string,
    walletOptions?: WalletOptions,
  ): Promise<void> {
    const tempWallet = walletOptions
      ? createOrLoadWallet(walletOptions)
      : this.wallet.getSigner();

    await this.fetch<MergeAccountReq, AccountInfoRes>({
      ...this.conf.merge,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        wallet: tempWallet.address,
        amount,
        signature: signV2WithdrawCheck(
          tempWallet,
          this.conf.v3_vault_address,
          this.conf.v2_contract_address,
          BigInt(amount),
          BigInt(withdrawn),
        ),
      },
    });
  }

  public async getMergeHistory(): Promise<GetMergeHistoryRes[]> {
    const history = await this.fetch<void, GetMergeHistoryRes[]>({
      ...this.conf.get_merge_history,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
    });
    return history.map(({ timestamp, wallet }) => ({
      timestamp: formatDate(timestamp),
      wallet: purgeString(wallet),
    }));
  }

  public async getAccountDetails(): Promise<AccountInfoRes> {
    return this.fetch<GetAccountDetailsQuery, AccountInfoRes>({
      ...this.conf.get_account_details,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
    });
  }

  public async updateVerifiedInfo(
    requestId: string,
    code: string,
  ): Promise<void> {
    await this.fetch<VerifyCodeReq, void>({
      ...this.conf.update_verified_info,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        type: VerificationType.PHONE,
        request_id: requestId,
        code,
      },
    });
  }

  public async getAvailableAdditionalInfo(): Promise<GetAvailableInfo> {
    return this.fetch<void, GetAvailableInfo>({
      ...this.conf.get_available_additional_info,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
    });
  }

  public async updateAdditionalInfo(
    birth: number,
    gender: string,
    marital: string,
    household: string,
    employment: string,
    income: string,
    industry: string,
  ): Promise<void> {
    await this.fetch<ModifyAdditionalInfoReq, void>({
      ...this.conf.update_additional_info,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        birth,
        gender,
        marital,
        household,
        employment,
        income,
        industry,
      },
    });
  }

  public async getAdditionalInfo(): Promise<GetAdditionalInfoRes> {
    return this.fetch<void, GetAdditionalInfoRes>({
      ...this.conf.get_additional_info,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
    });
  }

  public async getReferralSummary(): Promise<ReferralSummaryRes> {
    return this.fetch<void, ReferralSummaryRes>({
      ...this.conf.get_referral_summary,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
    });
  }

  public async getReferralLinks(): Promise<ReferralLinkRes[]> {
    return this.fetch<void, ReferralLinkRes[]>({
      ...this.conf.get_referral_links,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
    });
  }

  public async addReferralLink(
    title: string,
    referralShare: number,
    isDefault: boolean,
  ): Promise<ReferralLinkRes> {
    return this.fetch<AddReferralLinkReq, ReferralLinkRes>({
      ...this.conf.add_referral_link,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        title,
        referral_share: referralShare,
        is_default: isDefault,
      },
    });
  }

  public async setDefaultReferralLink(id: string): Promise<ReferralLinkRes> {
    return this.fetch<DefaultReferralLinkReq, ReferralLinkRes>({
      ...this.conf.set_default_referral_link,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: { referral_id: id },
    });
  }

  public async getAvailableDonations(): Promise<GetCharityInfoRes[]> {
    return this.fetch<void, GetCharityInfoRes[]>({
      ...this.conf.get_available_donations,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
    });
  }

  public async getOngoingDonations(): Promise<OngoingDonationRes[]> {
    return this.fetch<void, OngoingDonationRes[]>({
      ...this.conf.get_ongoing_donations,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
    });
  }

  public async addOngoingDonation(
    charityId: string,
    portion: number,
  ): Promise<OngoingDonationRes> {
    return this.fetch<AddOngoingDonationReq, OngoingDonationRes>({
      ...this.conf.add_ongoing_donation,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        charity_id: charityId,
        portion,
      },
    });
  }

  public async removeOngoingDonation(id: string): Promise<OngoingDonationRes> {
    return this.fetch<DeleteOngoingDonationReq, OngoingDonationRes>({
      ...this.conf.remove_ongoing_donation,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
        "Content-Type": "text/plain",
      },
      data: { donation_id: id },
    });
  }

  public async getAppConfig(last_version: string) {
    return this.fetch<GetAppConfigQuery, GetAppConfigRes>({
      ...this.conf.get_app_config,
      data: {
        device_type: DeviceType.EXTENSION,
        app_name: getAppName(),
        app_version: getAppVersion(),
        last_version,
      },
    });
  }
}
