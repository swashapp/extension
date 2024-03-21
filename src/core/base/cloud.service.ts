import { runtime, Tabs, tabs } from "webextension-polyfill";

import { BaseError } from "@/core/base-error";
import { CacheManager } from "@/core/managers/cache.manager";
import { SystemMessage } from "@/enums/message.enum";
import { HashAlgorithm } from "@/enums/security.enum";
import { OnlineFile } from "@/types/file.type";
import { CacheStorage } from "@/types/storage/cache.type";
import { getTabTitle, openInNewTab } from "@/utils/browser.util";
import { hash } from "@/utils/security.util";

export abstract class BaseCloudService {
  private readonly extId = "authsaz@gmail.com";

  protected constructor(
    private name: keyof CacheStorage["session"],
    private cache: CacheManager,
    private clientId: string,
    private authUrl: string,
    private scopes: string,
  ) {}

  private extractAccessTokenFromUrl(url: URL): string | undefined {
    if (url.hash.includes("access_token")) {
      const params = new URLSearchParams(url.hash.substring(1));
      return params.get("access_token") || undefined;
    }
    return;
  }

  private extractAccessTokenFromTitle(title: string): string | null {
    const match = title.match(/access_token=([^&]+)/);
    return match ? match[1] : null;
  }

  private async waitForAuthToken(
    tabId: number,
    timeout: number = 60000,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new BaseError(SystemMessage.TIMEOUT_CLOUD_OAUTH_TOKEN));
      }, timeout);

      const cleanup = () => {
        clearTimeout(timeoutId);
        tabs.onRemoved.removeListener(onRemove);
        tabs.onUpdated.removeListener(onUpdate);
        tabs.onActivated.removeListener(onActivated);
      };

      const onRemove = (removedTabId: number) => {
        if (removedTabId === tabId) {
          cleanup();
          reject(new BaseError(SystemMessage.CLOSED_TAB_BEFORE_COMPLETE));
        }
      };

      const onUpdate = async (
        updatedTabId: number,
        changeInfo: Tabs.OnUpdatedChangeInfoType,
      ) => {
        if (updatedTabId === tabId && changeInfo.status === "complete") {
          try {
            const tab = await tabs.get(tabId);
            if (tab?.url) {
              const url = new URL(tab.url);

              const accessToken = this.extractAccessTokenFromUrl(url);
              if (accessToken) {
                cleanup();
                await tabs.remove(tabId);
                resolve(accessToken);
                return;
              }
            }

            const results = await getTabTitle(tabId);

            if (runtime.lastError || !results || !results.length) {
              cleanup();
              reject(new BaseError(SystemMessage.FAILED_TAB_INJECT_SCRIPT));
              return;
            }

            const title = results[0].result || results[0];
            const accessToken = this.extractAccessTokenFromTitle(title);
            if (accessToken) {
              cleanup();
              await tabs.remove(tabId);
              resolve(accessToken);
            } else {
              cleanup();
              reject(new BaseError(SystemMessage.FAILED_CLOUD_ACCESS_TOKEN));
            }
          } catch (error) {
            cleanup();
            reject(new BaseError(SystemMessage.INVALID_LINK_FORMAT));
          }
        }
      };

      const onActivated = async (
        activeInfo: Tabs.OnActivatedActiveInfoType,
      ) => {
        if (activeInfo.tabId === tabId) {
          try {
            const tab = await tabs.get(tabId);
            if (tab?.url && tab.status === "complete") {
              const url = new URL(tab.url);
              const accessToken = this.extractAccessTokenFromUrl(url);
              if (accessToken) {
                cleanup();
                await tabs.remove(tabId);
                resolve(accessToken);
              }
            }
          } catch (error) {
            cleanup();
            reject(new BaseError(SystemMessage.UNEXPECTED_THINGS_HAPPENED));
          }
        }
      };

      tabs.onRemoved.addListener(onRemove);
      tabs.onUpdated.addListener(onUpdate);
      tabs.onActivated.addListener(onActivated);
    });
  }

  private async authenticate() {
    const params = new URLSearchParams({
      response_type: "token",
      client_id: this.clientId,
      redirect_uri: `https://callbacks.swashapp.io/${hash(
        HashAlgorithm.SHA256,
        this.extId,
      )}/${this.name.replace("_", "").toLowerCase()}`,
      scope: this.scopes,
    }).toString();

    const tab = await openInNewTab(`${this.authUrl}?${params}`);

    if (tab.id) {
      const accessToken = await this.waitForAuthToken(tab.id);
      await this.cache.setSession(this.name, accessToken, 60000);
    } else throw new BaseError(SystemMessage.FAILED_TAB_OPEN);
  }

  private async generateToken() {
    if (!this.cache.getSession(this.name)) await this.authenticate();
    return `Bearer ${this.cache.getSession(this.name)}`;
  }

  protected async getAuthorization() {
    return {
      Authorization: await this.generateToken(),
    };
  }

  abstract list(size?: number): Promise<OnlineFile[]>;

  abstract upload(file: File): Promise<void>;

  abstract download(file: string): Promise<Blob>;
}
