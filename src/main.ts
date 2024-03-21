import { Runtime, runtime } from 'webextension-polyfill';

import { AppCoordinator } from './core/app-coordinator';
import { CacheManager } from './core/managers/cache.manager';
import { ConfigurationManager } from './core/managers/configuration.manager';
import { ImageManager } from './core/managers/image.manager';
import { MessageManager } from './core/managers/message.manager';
import { PreferenceManager } from './core/managers/preference.manager';
import { PrivacyManager } from './core/managers/privacy.manager';
import { WalletManager } from './core/managers/wallet.manager';
import { AdsService } from './core/services/ads.service';
import { BackupService } from './core/services/backup.service';
import { DataService } from './core/services/data.service';
import { EarnService } from './core/services/earn.service';
import { PageService } from './core/services/page.service';
import { PaymentService } from './core/services/payment.service';
import { RestoreService } from './core/services/restore.service';
import { UserService } from './core/services/user.service';
import { OnInstalledReason } from './enums/event.enum';
import { HelperMessage, Managers, Helpers } from './types/app.type';
import { Logger } from './utils/log.util';

let helpers: Helpers;

async function bootstrap(openInNew: boolean) {
  if (helpers) return;

  Logger.info('Start setting up system requirements');
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
  Logger.info('Start installation flow', info);
  const openInNewTab = info.reason === OnInstalledReason.INSTALL;
  await bootstrap(openInNewTab);
}

async function onStartup() {
  Logger.info('Start up flow begins');
  await bootstrap(false);
}

runtime.onInstalled.addListener(onInstall);
runtime.onStartup.addListener(onStartup);

runtime.onMessage.addListener(async (message: HelperMessage) => {
  await bootstrap(false);
  if (!Object.keys(helpers).includes(message.obj)) return true;

  Logger.info('helpers', helpers);
  Logger.info('message', message);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const response = await helpers[message.obj][message.func](...message.params);
  Logger.info('response', response);

  return response;
});
