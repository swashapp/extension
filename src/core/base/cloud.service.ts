import { runtime, Tabs, tabs } from "webextension-polyfill";

import { BaseError } from "@/base-error";
import { CacheManager } from "@/core/managers/cache.manager";
import { SystemMessage } from "@/enums/message.enum";
import { HashAlgorithm } from "@/enums/security.enum";
import { OnlineFile } from "@/types/file.type";
import { CacheStorage } from "@/types/storage/cache.type";
import { getTabTitle, openInNewTab } from "@/utils/browser.util";
import { Logger } from "@/utils/log.util";
import { hash } from "@/utils/security.util";

export abstract class BaseCloudService {
  private readonly EXTENSION_ID = "authsaz@gmail.com";
  private readonly REDIRECT_URL: string;
  protected readonly logger = new Logger(this.constructor.name);

  protected constructor(
    private name: keyof CacheStorage["session"],
    private cache: CacheManager,
    private clientId: string,
    private authUrl: string,
    private scopes: string,
  ) {
    this.REDIRECT_URL = `https://callbacks.swashapp.io/${hash(
      HashAlgorithm.SHA256,
      this.EXTENSION_ID,
    )}/${this.name.replace("_", "").toLowerCase()}`;
    this.logger.info("Initialization completed");
  }

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
    timeout: number = 600000,
  ): Promise<string> {
    this.logger.debug("Start waiting for auth token");
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.logger.error("Auth token wait timed out");
        cleanup();
        reject(new BaseError(SystemMessage.TIMEOUT_CLOUD_OAUTH_TOKEN));
      }, timeout);

      const cleanup = async (tabId?: number) => {
        clearTimeout(timeoutId);
        tabs.onRemoved.removeListener(onRemove);
        tabs.onUpdated.removeListener(onUpdate);
        tabs.onActivated.removeListener(onActivated);

        if (tabId) await tabs.remove(tabId);
      };

      const onRemove = (removedTabId: number) => {
        if (removedTabId === tabId) {
          this.logger.warn("Authentication tab removed before token retrieval");
          cleanup();
          reject(new BaseError(SystemMessage.CLOSED_TAB_BEFORE_COMPLETE));
        }
      };

      const onUpdate = async (
        updatedTabId: number,
        changeInfo: Tabs.OnUpdatedChangeInfoType,
      ) => {
        if (updatedTabId === tabId && changeInfo.status === "complete") {
          this.logger.debug(
            "Tab updated and complete, checking for auth token",
          );
          try {
            const tab = await tabs.get(tabId);
            if (tab?.url) {
              const url = new URL(tab.url);
              const accessToken = this.extractAccessTokenFromUrl(url);
              if (accessToken) {
                this.logger.debug("Auth token found in URL");
                await cleanup(tabId);
                resolve(accessToken);
                return;
              } else this.logger.debug("Auth token not found in URL");
            }

            const results = await getTabTitle(tabId);
            if (runtime.lastError || !results || !results.length) return;

            const title = results[0].result || results[0];
            const accessToken = this.extractAccessTokenFromTitle(title);
            if (accessToken) {
              this.logger.debug("Auth token found in tab title");
              await cleanup(tabId);
              resolve(accessToken);
            } else this.logger.debug("Auth token not found in tab title");
          } catch (error) {
            this.logger.error(
              "Error during token extraction from updated tab",
              error,
            );
          }
        }
      };

      const onActivated = async (
        activeInfo: Tabs.OnActivatedActiveInfoType,
      ) => {
        if (activeInfo.tabId === tabId) {
          this.logger.debug("Tab activated, checking for auth token");
          try {
            const tab = await tabs.get(tabId);
            if (tab?.url && tab.status === "complete") {
              const url = new URL(tab.url);
              const accessToken = this.extractAccessTokenFromUrl(url);
              if (accessToken) {
                this.logger.debug("Auth token found on tab activation");
                await cleanup(tabId);
                resolve(accessToken);
              }
            }
          } catch (error) {
            this.logger.error(
              "Error during token extraction on activated tab",
              error,
            );
          }
        }
      };

      tabs.onRemoved.addListener(onRemove);
      tabs.onUpdated.addListener(onUpdate);
      tabs.onActivated.addListener(onActivated);
    });
  }

  private async authenticate() {
    this.logger.debug("Begin authentication process");
    const params = new URLSearchParams({
      response_type: "token",
      client_id: this.clientId,
      redirect_uri: this.REDIRECT_URL,
      scope: this.scopes,
    }).toString();

    const tab = await openInNewTab(`${this.authUrl}?${params}`);
    if (tab.id) {
      this.logger.debug("Authentication tab opened successfully");
      const accessToken = await this.waitForAuthToken(tab.id);
      this.logger.debug("Auth token acquired successfully");
      await this.cache.setSession(this.name, accessToken, 60000);
      this.logger.info("Session token set in cache");
    } else {
      this.logger.error("Failed to open authentication tab");
      throw new BaseError(SystemMessage.FAILED_TAB_OPEN);
    }
  }

  private async generateToken() {
    if (!this.cache.getSession(this.name)) {
      this.logger.debug("No valid session found, starting authentication");
      await this.authenticate();
    } else {
      this.logger.debug("Using existing session token from cache");
    }
    return `Bearer ${this.cache.getSession(this.name)}`;
  }

  protected async getAuthorization() {
    this.logger.debug("Generating authorization header");
    return {
      Authorization: await this.generateToken(),
    };
  }

  abstract list(size?: number): Promise<OnlineFile[]>;

  abstract upload(file: File): Promise<void>;

  abstract download(file: string): Promise<Blob>;
}
