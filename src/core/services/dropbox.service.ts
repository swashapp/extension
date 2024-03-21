import { RequestMethod } from '../../enums/api.enum';
import { CloudServices } from '../../enums/cloud.enum';
import { Any } from '../../types/any.type';
import { BaseCloudService } from '../base/cloud.service';
import { CacheManager } from '../managers/cache.manager';

import { ApiService } from './api.service';

export class DropboxService extends BaseCloudService {
  private readonly api: ApiService;
  private readonly contentApi: ApiService;

  constructor(cache: CacheManager) {
    super(
      CloudServices.DROPBOX,
      cache,
      'whddvse2klqvglx',
      'https://www.dropbox.com/oauth2/authorize',
      '',
    );

    this.api = new ApiService('https://api.dropboxapi.com', { timeout: 5000 });
    this.contentApi = new ApiService('https://content.dropboxapi.com', {
      timeout: 5000,
    });
  }

  async list(size = 1000) {
    const response = await this.api.fetch('/2/files/list_folder', {
      method: RequestMethod.POST,
      headers: {
        ...(await this.getAuthorization()),
        'Content-Type': 'application/json',
      },
      data: {
        path: '',
        limit: size,
      },
    });

    const data = await response.json();
    return (
      data?.entries.map((entry: Any) => ({
        id: entry.id,
        name: entry.name,
        modifiedTime: entry.client_modified,
        size: entry.size ? `${(entry.size / 1024).toFixed(2)} KB` : 'Unknown',
      })) || []
    );
  }

  async upload(file: File) {
    const response = await this.contentApi.fetch('/2/files/upload', {
      method: RequestMethod.POST,
      headers: {
        ...(await this.getAuthorization()),
        'Dropbox-API-Arg': JSON.stringify({
          path: `/${file.name}`,
          mode: 'add',
          mute: false,
        }),
        'Content-Type': 'application/octet-stream',
      },
      data: file,
    });

    return await response.json();
  }

  async download(file: string): Promise<Blob> {
    const response = await this.contentApi.fetch('/2/files/download', {
      method: RequestMethod.POST,
      headers: {
        ...(await this.getAuthorization()),
        'Dropbox-API-Arg': JSON.stringify({ path: file }),
      },
    });

    return await response.blob();
  }
}
