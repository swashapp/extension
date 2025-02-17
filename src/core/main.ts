import { satisfies } from "compare-versions";
import { Runtime, runtime, storage } from "webextension-polyfill";

import { CloudService } from "@/core/services/cloud.service";
import { AppStages } from "@/enums/app.enum";
import { OnInstalledReason } from "@/enums/event.enum";
import { HelperMessage, Helpers, Managers } from "@/types/app.type";
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

const logger = new Logger("Main");

let hasRun = false;
let helpers: Helpers;

async function bootstrap() {
  if (hasRun) return;
  hasRun = true;

  logger.info("Setting up application requirements");
  const coordinator = await AppCoordinator.getInstance();
  const configs = await ConfigurationManager.getInstance(coordinator);

  const [message, image, cache, wallet, privacy, preferences] =
    await Promise.all([
      MessageManager.getInstance(),
      ImageManager.getInstance(configs),
      CacheManager.getInstance(coordinator),
      WalletManager.getInstance(coordinator),
      PrivacyManager.getInstance(coordinator),
      PreferenceManager.getInstance(coordinator),
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

  const ads = new AdsService(managers);
  const earn = new EarnService(managers);
  const payment = new PaymentService(managers);
  const user = new UserService(managers);

  const backup = new BackupService(managers);
  const cloud = new CloudService(managers);
  const restore = new RestoreService(managers);
  const data = new DataService(managers, user);
  const page = new PageService(managers, data);

  helpers = {
    ...managers,
    ...{
      ads,
      backup,
      cloud,
      data,
      earn,
      page,
      payment,
      restore,
      user,
    },
  } as unknown as Helpers;

  configs.setUpdater(user.getAppConfig);
  logger.info("Application requirements set up");
}

async function onInstall(info: Runtime.OnInstalledDetailsType) {
  if (info.reason === OnInstalledReason.INSTALL) {
    logger.info("Processing installation flow");
    await bootstrap();
    await helpers.coordinator.set("stage", AppStages.ONBOARDING);
  } else if (info.reason === OnInstalledReason.UPDATE) {
    logger.info("Processing extension update flow");
    const previousVersion = info.previousVersion || "0.0.0";

    if (satisfies(previousVersion, "<3.0.0")) {
      logger.info("Processing migration flow");
      const data = await storage.local.get();
      delete data._backup;
      await storage.local.clear();
      await storage.local.set({ _backup: data });
      logger.info("Legacy data backed up");

      await bootstrap();
      try {
        await helpers.restore.fromBackup(JSON.stringify(data));
        const status = await helpers.user.getMigrationStatus();
        logger.info("User migration status checked", status);

        if (status.migratable) {
          await helpers.coordinator.set("stage", AppStages.MIGRATING);
        } else {
          await helpers.cache.setTempEmail(status.email);
          await helpers.coordinator.set("stage", AppStages.ONBOARDING);
        }
      } catch (error) {
        logger.error("User migration status check failed", error);
        await helpers.coordinator.set("stage", AppStages.MIGRATING);
      }
    } else {
      await bootstrap();
    }
  } else {
    logger.info("Processing browser update flow");
    await bootstrap();
  }
}

async function onStartup() {
  logger.info("Processing startup flow");
  await bootstrap();
  await helpers.cache.clearVolatileData();
}

runtime.onInstalled.addListener(onInstall);
runtime.onStartup.addListener(onStartup);

runtime.onMessage.addListener(async (message: HelperMessage) => {
  await bootstrap();
  if (!Object.keys(helpers).includes(message.obj)) {
    logger.debug("Message object not found in helpers", message);
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return helpers[message.obj][message.func](...message.params);
});
