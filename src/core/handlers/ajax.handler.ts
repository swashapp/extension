import { tabs, Tabs, WebRequest, webRequest } from "webextension-polyfill";

import { BaseModuleHandler } from "@/core/base/module.handler";
import { DataService } from "@/core/services/data.service";
import { ModuleHandler } from "@/enums/handler.enum";
import { PlatformOS } from "@/enums/platform.enum";
import { Any } from "@/types/any.type";
import { AjaxCollector } from "@/types/handler/ajax.type";
import { CollectorBase, InMemoryModules } from "@/types/handler/module.type";
import { ModuleConfiguration } from "@/types/storage/configuration.type";
import { createMessageHeader } from "@/utils/message.util";
import { wildcard } from "@/utils/pattern.util";

export class AjaxHandler extends BaseModuleHandler<ModuleHandler.AJAX> {
  private callbacks: Record<string, Any> = {};
  private enabledCallbacks: Record<number, boolean> = {};
  private enabledTabs: Record<number, boolean> = {};

  constructor(
    onDiskModules: ModuleConfiguration,
    os: PlatformOS,
    protected data: DataService,
  ) {
    super(ModuleHandler.AJAX, onDiskModules, os);
    this.scripts = ["/core/scripts/ajax.script.js"];

    this.getModules = this.getModules.bind(this);
    this.record = this.record.bind(this);
  }

  private updateTabsStatus(tabId: number, url?: string): void {
    if (url) {
      this.enabledTabs[tabId] = Array.from(this.modules).some((collector) =>
        collector.url_matches.some((pattern) => wildcard(url, pattern)),
      );
    } else {
      this.enabledTabs[tabId] = false;
    }
  }

  private onTabCreated = (tab: Tabs.Tab) => {
    if (tab.id !== undefined) {
      this.enabledCallbacks[tab.id] = false;
      this.updateTabsStatus(tab.id, tab.url);
    }
  };

  private onTabRemoved = (tabId: number) => {
    delete this.enabledCallbacks[tabId];
    delete this.enabledTabs[tabId];
  };

  private onTabUpdated = (
    tabId: number,
    changeInfo: Tabs.OnUpdatedChangeInfoType,
  ) => {
    if (changeInfo.url) {
      this.updateTabsStatus(tabId, changeInfo.url);
    }
  };

  private addTabListeners() {
    tabs.onCreated.addListener(this.onTabCreated);
    tabs.onRemoved.addListener(this.onTabRemoved);
    tabs.onUpdated.addListener(this.onTabUpdated);
  }

  private removeTabListeners() {
    tabs.onCreated.removeListener(this.onTabCreated);
    tabs.onRemoved.removeListener(this.onTabRemoved);
    tabs.onUpdated.removeListener(this.onTabUpdated);
  }

  private async handleWebRequest(
    module: InMemoryModules<ModuleHandler.AJAX>,
    item: CollectorBase<AjaxCollector>,
  ) {
    const name = `${module.name}_${item.name}`;

    const callback = async (details: WebRequest.OnCompletedDetailsType) => {
      const tabId = details.tabId;
      if (!tabId || !this.enabledCallbacks[tabId] || !this.enabledTabs[tabId]) {
        return;
      }

      const {
        // documentId,
        // documentLifecycle,
        frameId,
        // frameType,
        fromCache,
        initiator,
        method,
        // parentDocumentId,
        parentFrameId,
        requestId,
        statusCode,
        statusLine,
        timeStamp,
        type,
        url,
      } = details;

      await this.data.collect({
        origin: url,
        header: createMessageHeader("ajax", item.name, module),
        data: {
          out: {
            // documentId,
            // documentLifecycle,
            frameId,
            // frameType,
            fromCache,
            initiator,
            method,
            // parentDocumentId,
            parentFrameId,
            requestId,
            statusCode,
            statusLine,
            tabId,
            timeStamp,
            type,
            url,
          },
          schems: [
            { jpath: "$.documentId", type: "id" },
            { jpath: "$.documentLifecycle", type: "text" },
            { jpath: "$.frameId", type: "id" },
            { jpath: "$.frameType", type: "text" },
            { jpath: "$.fromCache", type: "text" },
            { jpath: "$.initiator", type: "url" },
            { jpath: "$.method", type: "text" },
            { jpath: "$.parentDocumentId", type: "id" },
            { jpath: "$.parentFrameId", type: "id" },
            { jpath: "$.requestId", type: "id" },
            { jpath: "$.statusCode", type: "text" },
            { jpath: "$.statusLine", type: "text" },
            { jpath: "$.tabId", type: "id" },
            { jpath: "$.timeStamp", type: "date" },
            { jpath: "$.type", type: "text" },
            { jpath: "$.url", type: "url" },
          ],
        },
      });
    };

    if (!webRequest.onCompleted.hasListener(callback)) {
      const filter = item.filter ?? module.filter;
      const extraInfoSpec = item.extra_info_spec ?? module.extra_info_spec;

      webRequest.onCompleted.addListener(callback, filter, extraInfoSpec);
      this.callbacks[name] = callback;
    }

    const updateTabsStatus = (id: number, url?: string): void => {
      if (url) {
        this.enabledTabs[id] = module.url_matches.some((pattern) =>
          wildcard(url, pattern),
        );
      }
    };

    tabs.onCreated.addListener((tab) => {
      if (tab.id) {
        this.enabledCallbacks[tab.id] = false;
        updateTabsStatus(tab.id, tab.url);
      }
    });

    tabs.onRemoved.addListener((tabId) => {
      delete this.enabledCallbacks[tabId];
      delete this.enabledTabs[tabId];
    });

    tabs.onUpdated.addListener((tabId, changeInfo) => {
      updateTabsStatus(tabId, changeInfo.url);
    });
  }

  public async load() {
    this.addTabListeners();

    for (const collector of this.modules) {
      for (const item of collector.items) {
        if (item.hook === "webRequest") {
          await this.handleWebRequest(collector, item);
        }
      }
    }
    await this.registerContentScript();
  }

  public async unload() {
    for (const collector of this.modules) {
      for (const item of collector.items) {
        const name = `${collector.name}_${item.name}`;
        const callback = this.callbacks[name];
        if (callback) {
          if (item.hook === "webRequest")
            webRequest.onCompleted.removeListener(callback);
          delete this.callbacks[name];
        }
      }
    }

    await this.unregisterContentScript();
    this.removeTabListeners();

    this.enabledCallbacks = {};
    this.enabledTabs = {};
  }

  public async getModules(url: string) {
    const modules: InMemoryModules<ModuleHandler.AJAX>[] = [];
    for (const module of this.modules) {
      for (const item of module.url_matches) {
        if (wildcard(url, item)) {
          modules.push(module);
          break;
        }
      }
    }
    return modules;
  }

  public async record(duration: number) {
    const [activeTab] = await tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    if (activeTab?.id) {
      this.enabledCallbacks[activeTab.id] = true;

      setTimeout(() => {
        if (activeTab.id) {
          this.enabledCallbacks[activeTab.id] = false;
        }
      }, duration);
    }
  }
}
