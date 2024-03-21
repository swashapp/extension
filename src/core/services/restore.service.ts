import { BaseError } from "@/base-error";
import { SystemMessage } from "@/enums/message.enum";
import { Managers } from "@/types/app.type";
import { BackupFormat, LegacyBackupFormat } from "@/types/storage/backup.type";
import { getLegacyWallet } from "@/utils/backup.util";
import { Logger } from "@/utils/log.util";
import { isValidPrivateKey } from "@/utils/validator.util";

export class RestoreService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(protected managers: Managers) {}

  private async restoreLegacy(backup: LegacyBackupFormat): Promise<void> {
    try {
      this.logger.debug("Restoring legacy backup");
      await this.managers.wallet.assign({ encrypted: getLegacyWallet(backup) });
      this.logger.info("Legacy backup restored");
    } catch (error) {
      this.logger.error("Legacy restoration failed", error);
      throw new BaseError(SystemMessage.FAILED_DECRYPT_OLD_BACKUP);
    }
  }

  private async restore(backup: BackupFormat): Promise<void> {
    this.logger.debug("Validating backup private key");
    if (!isValidPrivateKey(backup.wallet)) {
      this.logger.error("Invalid private key in backup");
      throw new BaseError(SystemMessage.INVALID_PRIVATE_KEY);
    }

    this.logger.debug("Restoring wallet from backup");
    await this.managers.wallet.assign({ privateKey: backup.wallet });
    this.logger.debug("Restoring privacy settings from backup");
    await this.managers.privacy.setAll(backup?.privacy);
    this.logger.debug("Restoring preferences from backup");
    await this.managers.preferences.setAll(backup?.preferences?.extension);
    this.logger.info("Backup restored successfully");
  }

  public async withPrivateKey(privateKey: string): Promise<void> {
    this.logger.debug("Restoring using provided private key");
    await this.restore({ version: 1, wallet: privateKey });
  }

  public async fromBackup(backup: string): Promise<void> {
    let conf;
    try {
      conf = JSON.parse(backup);
      this.logger.info("Backup file parsed successfully");
    } catch (error) {
      this.logger.error("Failed to parse backup file", error);
      throw new BaseError(SystemMessage.INVALID_BACKUP_FILE);
    }

    if (conf.version) {
      this.logger.debug("Restoring backup with version");
      await this.restore(conf);
    } else {
      this.logger.debug("Restoring legacy backup format");
      await this.restoreLegacy(conf);
    }
  }
}
