import { downloads } from 'webextension-polyfill';

import { CloudServices } from '../../enums/cloud.enum';
import { Managers } from '../../types/app.type';
import { formatDate } from '../../utils/date.util';
import { BaseCloudService } from '../base/cloud.service';

import { DropboxService } from './dropbox.service';
import { GoogleDriveService } from './google-drive.service';

export class BackupService {
  private readonly dataType = 'application/json; charset=utf-8';

  constructor(protected managers: Managers) {}

  private generateName(): string {
    return `Swash-backup-${formatDate(undefined, 'YYMMDDHHmm')}.json`;
  }

  private create(): string {
    return JSON.stringify({
      version: 1,
      wallet: this.managers.wallet.getAll(),
      privacy: this.managers.privacy.getAll(),
      preferences: {
        extension: this.managers.preferences.getAll(),
      },
    });
  }

  public async download() {
    await downloads.download({
      url: `data:${this.dataType},` + encodeURIComponent(this.create()),
      filename: this.generateName(),
      saveAs: true,
    });
  }

  public async uploadToCloud(service: CloudServices): Promise<void> {
    let helper: BaseCloudService | undefined;

    if (service === CloudServices.GOOGLE_DRIVE)
      helper = new GoogleDriveService(this.managers.cache);
    else if (service === CloudServices.DROPBOX)
      helper = new DropboxService(this.managers.cache);

    if (helper)
      await helper.upload(
        new File([this.create()], this.generateName(), {
          type: `${this.dataType}`,
        }),
      );
  }
}
