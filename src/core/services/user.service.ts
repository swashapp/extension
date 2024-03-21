import { BaseError } from "@/core//base-error";
import { AppCoordinator } from "@/core/app-coordinator";
import { BaseSwashService } from "@/core/base/swash.service";
import { CacheManager } from "@/core/managers/cache.manager";
import { WalletManager } from "@/core/managers/wallet.manager";
import { AccountStages } from "@/enums/account.enum";
import {
  AcceptedAuth,
  DeviceType,
  RequestMethod,
  VerificationActionType,
  VerificationType,
} from "@/enums/api.enum";
import { SystemMessage } from "@/enums/message.enum";
import { Any } from "@/types/any.type";
import {
  AccountInfoRes,
  GetAccountDetailsQuery,
  GetEncryptedDataRes,
  LoginAccountRes,
  RegisterAccountReq,
  ResetAccountReq,
} from "@/types/api/account.type";
import { GetCharityInfoRes } from "@/types/api/charity.type";
import { RegisterDeviceReq } from "@/types/api/device.type";
import {
  AddOngoingDonationReq,
  DeleteOngoingDonationReq,
  OngoingRes,
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
import { getSystemInfo } from "@/utils/browser.util";
import { normalizeEmail } from "@/utils/email.util";
import { decrypt, encrypt, pbkdf2 } from "@/utils/security.util";

export class UserService extends BaseSwashService {
  constructor(
    protected coordinator: AppCoordinator,
    wallet: WalletManager,
    cache: CacheManager,
  ) {
    super("https://gateway-dev.swashapp.io/", wallet, cache);
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

    return await this.fetch<InitVerificationReq, InitVerificationRes>(
      `/user/v3/auth/verification/desktop/${action}`,
      {
        method: RequestMethod.POST,
        headers: { Authorization: await this.generateToken(AcceptedAuth.EWT) },
        data: data as InitVerificationReq,
      },
    );
  }

  public async resetVerify(
    type: VerificationType,
    requestId: string,
  ): Promise<InitVerificationRes> {
    return await this.fetch<ResetVerificationReq, InitVerificationRes>(
      `/user/v3/auth/verification/request`,
      {
        method: RequestMethod.PUT,
        headers: { Authorization: await this.generateToken(AcceptedAuth.EWT) },
        data: {
          type,
          request_id: requestId,
        },
      },
    );
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

    await this.fetch<RegisterAccountReq, AccountInfoRes>(
      `/user/v3/auth/account/register`,
      {
        method: RequestMethod.POST,
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
        cache: {
          key: "account",
          ttl: 1,
        },
      },
    );

    await this.coordinator.set("stage", AccountStages.REGISTERED);
  }

  public async getEncryptedData(
    email: string,
    masterPassword: string,
  ): Promise<void> {
    const { password, key } = this.generateEncryptionKey(email, masterPassword);

    const { data } = await this.fetch<void, GetEncryptedDataRes>(
      `/user/v3/auth/account/encrypted-data`,
      {
        method: RequestMethod.GET,
        headers: {
          Authorization: await this.generateToken(
            AcceptedAuth.BASIC,
            email,
            password,
          ),
        },
      },
    );
    const privateKey = decrypt(data, key);
    await this.wallet.assign({ privateKey });
    await this.coordinator.set("stage", AccountStages.REGISTERED);
  }

  public async login(): Promise<void> {
    const { arch, osName, osVersion, userAgent } = await getSystemInfo();
    const { location, ...account } = await this.fetch<
      RegisterDeviceReq,
      LoginAccountRes
    >(`/user/v3/auth/account/login`, {
      method: RequestMethod.POST,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        device_key: this.cache.get("device_key"),
        device_type: DeviceType.SMARTPHONE,
        app_name: "AndroidApp",
        app_version: "1.0.0",
        // app_name: getAppName(),
        // app_version: getAppVersion(),
        arch,
        os_name: osName,
        os_version: osVersion,
        user_agent: userAgent,
      },
    });

    await this.cache.clearSession(AcceptedAuth.EWT);
    await this.coordinator.set("stage", AccountStages.READY);

    await this.cache.setData("account", { ...account }, 1);
    await this.cache.setData("location", location, 1);
  }

  private async resetAccount(
    url: string,
    email: string,
    masterPassword: string,
    requestId: string,
    code: string,
  ): Promise<void> {
    const { password, key } = this.generateEncryptionKey(email, masterPassword);
    const data = encrypt(this.wallet.get(), key);

    await this.fetch<ResetAccountReq, void>(url, {
      method: RequestMethod.POST,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        type: VerificationType.EMAIL,
        request_id: requestId,
        code,
        password,
        data,
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
      `/user/v3/auth/account/reset-password`,
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
      `/user/v3/auth/account/reset-wallet`,
      email,
      masterPassword,
      requestId,
      code,
    );
  }

  public async getAccountDetails(refresh = false): Promise<AccountInfoRes> {
    return this.fetch<GetAccountDetailsQuery, AccountInfoRes>(
      `/user/v3/auth/account/details`,
      {
        method: RequestMethod.GET,
        headers: {
          Authorization: await this.generateToken(AcceptedAuth.EWT),
        },
        cache: {
          key: "account",
          ttl: 1,
          refresh,
        },
      },
    );
  }

  public async updateVerifiedInfo(
    requestId: string,
    code: string,
  ): Promise<void> {
    await this.fetch<VerifyCodeReq, void>(`/user/v3/auth/info/verified`, {
      method: RequestMethod.POST,
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
    return this.fetch<void, GetAvailableInfo>(`/user/v3/auth/info/available`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      cache: { ttl: 1 },
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
    await this.fetch<ModifyAdditionalInfoReq, void>(
      `/user/v3/auth/info/additional`,
      {
        method: RequestMethod.POST,
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
      },
    );
  }

  public async getAdditionalInfo(
    refresh = false,
  ): Promise<GetAdditionalInfoRes> {
    return this.fetch<void, GetAdditionalInfoRes>(
      `/user/v3/auth/info/additional`,
      {
        method: RequestMethod.GET,
        headers: {
          Authorization: await this.generateToken(AcceptedAuth.EWT),
        },
        cache: {
          key: "info",
          ttl: 1,
          refresh,
        },
      },
    );
  }

  public async getReferralSummary(): Promise<ReferralSummaryRes> {
    return this.fetch<void, ReferralSummaryRes>(`/user/v3/auth/referral`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      cache: { ttl: 1 },
    });
  }

  public async getReferralLinks(): Promise<ReferralLinkRes[]> {
    return this.fetch<void, ReferralLinkRes[]>(`/user/v3/auth/referral/links`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      cache: { ttl: 1 },
    });
  }

  public async addReferralLink(
    title: string,
    referralShare: number,
    isDefault: boolean,
  ): Promise<ReferralLinkRes> {
    return this.fetch<AddReferralLinkReq, ReferralLinkRes>(
      `/user/v3/auth/referral/link`,
      {
        method: RequestMethod.POST,
        headers: {
          Authorization: await this.generateToken(AcceptedAuth.EWT),
        },
        data: {
          title,
          referral_share: referralShare,
          is_default: isDefault,
        },
      },
    );
  }

  public async setDefaultReferralLink(id: string): Promise<ReferralLinkRes> {
    return this.fetch<DefaultReferralLinkReq, ReferralLinkRes>(
      `/user/v3/auth/referral/link/default`,
      {
        method: RequestMethod.POST,
        headers: {
          Authorization: await this.generateToken(AcceptedAuth.EWT),
        },
        data: { referral_id: id },
      },
    );
  }

  public async getAvailableDonation(): Promise<GetCharityInfoRes[]> {
    return this.fetch<void, GetCharityInfoRes[]>(
      `/user/v3/auth/donation/available`,
      {
        method: RequestMethod.GET,
        headers: {
          Authorization: await this.generateToken(AcceptedAuth.EWT),
        },
        cache: { ttl: 1 },
      },
    );
  }

  public async getOngoingDonations(): Promise<OngoingRes[]> {
    return this.fetch<void, OngoingRes[]>(`/user/v3/auth/donation/ongoings`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      cache: { ttl: 1 },
    });
  }

  public async addOngoingDonation(
    charityId: string,
    portion: number,
  ): Promise<OngoingRes> {
    return this.fetch<AddOngoingDonationReq, OngoingRes>(
      `/user/v3/auth/donation/ongoing`,
      {
        method: RequestMethod.POST,
        headers: {
          Authorization: await this.generateToken(AcceptedAuth.EWT),
        },
        data: {
          charity_id: charityId,
          portion,
        },
      },
    );
  }

  public async stopOngoingDonation(id: string): Promise<OngoingRes> {
    return this.fetch<DeleteOngoingDonationReq, OngoingRes>(
      `/user/v3/auth/donation/ongoing`,
      {
        method: RequestMethod.DELETE,
        headers: {
          Authorization: await this.generateToken(AcceptedAuth.EWT),
        },
        data: { donation_id: id },
      },
    );
  }
}
