import { AppCoordinator } from "@/core/app-coordinator";
import { CacheManager } from "@/core/managers/cache.manager";
import { ConfigurationManager } from "@/core/managers/configuration.manager";
import { ImageManager } from "@/core/managers/image.manager";
import { MessageManager } from "@/core/managers/message.manager";
import { PreferenceManager } from "@/core/managers/preference.manager";
import { PrivacyManager } from "@/core/managers/privacy.manager";
import { WalletManager } from "@/core/managers/wallet.manager";
import { AdsService } from "@/core/services/ads.service";
import { BackupService } from "@/core/services/backup.service";
import { CloudService } from "@/core/services/cloud.service";
import { DataService } from "@/core/services/data.service";
import { EarnService } from "@/core/services/earn.service";
import { PageService } from "@/core/services/page.service";
import { PaymentService } from "@/core/services/payment.service";
import { RestoreService } from "@/core/services/restore.service";
import { UserService } from "@/core/services/user.service";

import { Any } from "./any.type";
import { ClassAsyncType } from "./class.type";

export type Managers = {
  coordinator: AppCoordinator;

  cache: CacheManager;
  configs: ConfigurationManager;
  image: ImageManager;
  message: MessageManager;
  preferences: PreferenceManager;
  privacy: PrivacyManager;
  wallet: WalletManager;
};

export type Helpers = {
  coordinator: ClassAsyncType<AppCoordinator>;

  cache: ClassAsyncType<CacheManager>;
  image: ClassAsyncType<ImageManager>;
  message: ClassAsyncType<MessageManager>;
  preferences: ClassAsyncType<PreferenceManager>;
  privacy: ClassAsyncType<PrivacyManager>;
  wallet: ClassAsyncType<WalletManager>;

  ads: ClassAsyncType<AdsService>;
  backup: ClassAsyncType<BackupService>;
  cloud: ClassAsyncType<CloudService>;
  earn: ClassAsyncType<EarnService>;
  data: ClassAsyncType<DataService>;
  page: ClassAsyncType<PageService>;
  payment: ClassAsyncType<PaymentService>;
  restore: ClassAsyncType<RestoreService>;
  user: ClassAsyncType<UserService>;
};

export type HelperMessage = {
  obj: keyof Helpers;
  func: string;
  params: Any[];
};
