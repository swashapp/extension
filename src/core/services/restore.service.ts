import { CloudServices } from '../../enums/cloud.enum';
import { SystemMessage } from '../../enums/message.enum';
import { Managers } from '../../types/app.type';
import { OnlineFile } from '../../types/file.type';
import {
  After108Backup,
  BackupFormat,
  Before108Backup,
  OldBackupFormat,
} from '../../types/storage/backup.type';
import { Logger } from '../../utils/log.util';
import { isValidPrivateKey } from '../../utils/validator.util';
import { isGreaterThan } from '../../utils/version.util';
import { BaseCloudService } from '../base/cloud.service';
import { BaseError } from '../base-error';

import { DropboxService } from './dropbox.service';
import { GoogleDriveService } from './google-drive.service';

export class RestoreService {
  constructor(protected managers: Managers) {}

  private async restoreLegacy(backup: OldBackupFormat): Promise<void> {
    let data: string;

    const password = backup?.configs?.salt;
    if (isGreaterThan(backup?.configs?.version, '1.0.8'))
      data = (backup as After108Backup)?.profile?.encryptedWallet;
    else data = (backup as Before108Backup)?.configs?.encryptedWallet;

    if (!password || !data)
      throw new BaseError(SystemMessage.INVALID_BACKUP_FILE);

    try {
      await this.managers.wallet.assign({ encrypted: { data, password } });
    } catch (error) {
      Logger.error(error);
      throw new BaseError(SystemMessage.FAILED_DECRYPT_OLD_BACKUP);
    }
  }

  private async restore(backup: BackupFormat): Promise<void> {
    if (!isValidPrivateKey(backup.wallet))
      throw new BaseError(SystemMessage.INVALID_PRIVATE_KEY);

    await this.managers.wallet.assign({ privateKey: backup.wallet });
    await this.managers.privacy.setAll(backup?.privacy);
    await this.managers.preferences.setAll(backup?.preferences?.extension);
  }

  public async withPrivateKey(privateKey: string) {
    await this.restore({ version: 1, wallet: privateKey });
  }

  public async fromBackup(backup: string): Promise<void> {
    let conf;
    try {
      conf = JSON.parse(backup);
      Logger.info(conf);
    } catch (error) {
      Logger.error(error);
      throw new BaseError(SystemMessage.INVALID_BACKUP_FILE);
    }

    if (conf.version) await this.restore(conf);
    else await this.restoreLegacy(conf);
  }

  public async listCloudBackup(service: CloudServices): Promise<OnlineFile[]> {
    let helper: BaseCloudService | undefined;

    if (service === CloudServices.GOOGLE_DRIVE)
      helper = new GoogleDriveService(this.managers.cache);
    else if (service === CloudServices.DROPBOX)
      helper = new DropboxService(this.managers.cache);

    return helper?.list() || [];
  }

  public async downloadCloudBackup(
    service: CloudServices,
    file: string,
  ): Promise<string> {
    let helper: BaseCloudService | undefined;

    if (service === CloudServices.GOOGLE_DRIVE)
      helper = new GoogleDriveService(this.managers.cache);
    else if (service === CloudServices.DROPBOX)
      helper = new DropboxService(this.managers.cache);

    if (!helper) throw new BaseError(SystemMessage.INVALID_CLOUD_TYPE);
    return (await helper.download(file)).text();
  }
}
