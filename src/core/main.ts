import { Runtime, runtime } from "webextension-polyfill";

import { OnInstalledReason } from "@/enums/event.enum";
import { HelperMessage, Managers, Helpers } from "@/types/app.type";
import { Logger } from "@/utils/log.util";

import { AppCoordinator } from "./app-coordinator";
import { CacheManager } from "./managers/cache.manager";
import { ConfigurationManager } from "./managers/configuration.manager";
import { ImageManager } from "./managers/image.manager";
import { MessageManager } from "./managers/message.manager";
import { PreferenceManager } from "./managers/preference.manager";
import { PrivacyManager } from "./managers/privacy.manager";
import { WalletManager } from "./managers/wallet.manager";
import { AdsService } from "./services/ads.service";
import { BackupService } from "./services/backup.service";
import { DataService } from "./services/data.service";
import { EarnService } from "./services/earn.service";
import { PageService } from "./services/page.service";
import { PaymentService } from "./services/payment.service";
import { RestoreService } from "./services/restore.service";
import { UserService } from "./services/user.service";

let hasRun = false;
let helpers: Helpers;

async function bootstrap(openInNew: boolean) {
  if (hasRun) return;
  hasRun = true;

  Logger.info("Start setting up system requirements");
  const coordinator = await AppCoordinator.getInstance();

  const [message, image, cache, wallet, privacy, preferences, configs] =
    await Promise.all([
      MessageManager.getInstance(),
      ImageManager.getInstance(),
      CacheManager.getInstance(coordinator),
      WalletManager.getInstance(coordinator),
      PrivacyManager.getInstance(coordinator),
      PreferenceManager.getInstance(coordinator),
      ConfigurationManager.getInstance(coordinator),
    ]);

  const managers: Managers = {
    coordinator,
    cache,
    configs,
    image,
    message,
    preferences,
    privacy,
    wallet,
  };

  const data = new DataService(managers);

  const services = {
    backup: new BackupService(managers),
    data,
    restore: new RestoreService(managers),

    ads: new AdsService(wallet, cache),
    earn: new EarnService(wallet, cache),
    page: new PageService(coordinator, configs, preferences, data),
    payment: new PaymentService(wallet, cache),
    user: new UserService(coordinator, wallet, cache),
  };

  helpers = {
    ...managers,
    ...services,
  } as unknown as Helpers;

  coordinator.isInOnboarding(openInNew);
}

async function onInstall(info: Runtime.OnInstalledDetailsType) {
  Logger.info("Start installation flow", info);
  const openInNewTab = info.reason === OnInstalledReason.INSTALL;
  await bootstrap(openInNewTab);
}

async function onStartup() {
  Logger.info("Start up flow begins");
  await bootstrap(false);
}

runtime.onInstalled.addListener(onInstall);
runtime.onStartup.addListener(onStartup);

runtime.onMessage.addListener(async (message: HelperMessage) => {
  await bootstrap(false);
  if (!Object.keys(helpers).includes(message.obj)) return true;

  // Logger.info("helpers", helpers);
  // Logger.info("message", message);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const response = await helpers[message.obj][message.func](...message.params);
  // Logger.info("response", response);

  return response;
});
