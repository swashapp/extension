import {
  bookmarks,
  Bookmarks,
  tabs,
  Tabs,
  webRequest,
  WebRequest,
} from "webextension-polyfill";

import { BaseModuleHandler } from "@/core/base/module.handler";
import { DataService } from "@/core/services/data.service";
import { ModuleHandler } from "@/enums/handler.enum";
import { MatchType } from "@/enums/pattern.enum";
import { PlatformOS } from "@/enums/platform.enum";
import { Any } from "@/types/any.type";
import {
  BookmarkCollector,
  ResponseCollector,
  WebRequestCollector,
  WebRequestCollectorPattern,
} from "@/types/handler/browsing.type";
import { CollectorBase, InMemoryModules } from "@/types/handler/module.type";
import { CollectedMessage } from "@/types/message.type";
import { ModuleConfiguration } from "@/types/storage/configuration.type";
import { Logger } from "@/utils/log.util";
import { createMessageHeader } from "@/utils/message.util";
import { wildcard } from "@/utils/pattern.util";

export class BrowsingHandler extends BaseModuleHandler<ModuleHandler.BROWSING> {
  private callbacks: Record<string, Any> = {};

  constructor(
    onDiskModules: ModuleConfiguration,
    os: PlatformOS,
    protected data: DataService,
  ) {
    super(ModuleHandler.BROWSING, onDiskModules, os);
  }

  public async load(): Promise<void> {
    for (const module of this.modules) {
      for (const item of module.items) {
        const hook = item.hook ?? "webRequest";
        const key = `${module.name}_${item.name}`;

        switch (hook) {
          case "webRequest":
            this.handleWebRequest(
              module,
              item as CollectorBase<WebRequestCollector>,
              key,
            );
            break;
          case "bookmarks":
            this.handleBookmarks(
              module,
              item as CollectorBase<BookmarkCollector>,
              key,
            );
            break;
          case "response":
            this.handleResponse(
              module,
              item as CollectorBase<ResponseCollector>,
              key,
            );
            break;
          default:
            Logger.warn(`Unknown hook type: ${hook}`);
        }
      }
    }
  }

  public async unload(): Promise<void> {
    for (const module of this.modules) {
      for (const item of module.items) {
        const hook = item.hook ?? "webRequest";
        const key = `${module.name}_${item.name}`;

        if (this.callbacks[key]) {
          switch (hook) {
            case "webRequest":
              if (webRequest.onBeforeRequest.hasListener(this.callbacks[key])) {
                webRequest.onBeforeRequest.removeListener(this.callbacks[key]);
              }
              break;
            case "bookmarks":
              if (bookmarks.onCreated.hasListener(this.callbacks[key])) {
                bookmarks.onCreated.removeListener(this.callbacks[key]);
              }
              break;
            case "response":
              if (
                webRequest.onHeadersReceived.hasListener(this.callbacks[key])
              ) {
                webRequest.onHeadersReceived.removeListener(
                  this.callbacks[key],
                );
              }
              break;
            default:
              Logger.warn(`Unknown hook type: ${hook}`);
          }
          delete this.callbacks[key];
        }

        if (hook === "bookmarks") {
          const changeKey = `${key}_change`;
          if (this.callbacks[changeKey]) {
            bookmarks.onChanged.removeListener(this.callbacks[changeKey]);
            delete this.callbacks[changeKey];
          }
        }
      }
    }
  }

  private handleWebRequest(
    module: InMemoryModules<ModuleHandler.BROWSING>,
    item: CollectorBase<WebRequestCollector>,
    key: string,
  ): void {
    this.callbacks[key] = async (
      details: WebRequest.OnBeforeRequestDetailsType,
    ) => {
      if (details.tabId < 0) return;

      let res: CollectedMessage | null = null;
      let tab: Tabs.Tab;

      const targetListener = item.target_listener ?? "inspectRequest";
      try {
        switch (targetListener) {
          case "inspectRequest":
            res = this.inspectRequestPatterns(module, item, details);
            break;
          case "inspectReferrer":
            tab = await tabs.get(details.tabId);
            res = this.inspectReferrer(module, item, details, tab.url ?? "");
            break;
          case "inspectVisit":
            res = this.inspectVisit(module, item, details);
            break;
          default:
            Logger.warn(`Unknown target listener: ${targetListener}`);
        }

        if (res) await this.data.collect(res);
      } catch (error) {
        Logger.error(`Error in handleWebRequest callback: ${error}`);
      }
    };

    const filter = item.filter ?? module.filter;
    const extraInfoSpec = item.extra_info_spec ?? module.extra_info_spec;

    if (!webRequest.onBeforeRequest.hasListener(this.callbacks[key]))
      webRequest.onBeforeRequest.addListener(
        this.callbacks[key],
        filter,
        extraInfoSpec,
      );
  }

  private handleBookmarks(
    module: InMemoryModules<ModuleHandler.BROWSING>,
    item: CollectorBase<BookmarkCollector>,
    key: string,
  ): void {
    this.callbacks[key] = async (
      _id: string,
      bookmark: Bookmarks.BookmarkTreeNode,
    ) => {
      await this.data.collect({
        origin: bookmark.url ?? "",
        header: createMessageHeader("browsing", item.name, module),
        data: {
          out: {
            bookmark: bookmark,
          },
          schems: [
            { jpath: "$.bookmark.id", type: "id" },
            { jpath: "$.bookmark.parentId", type: "id" },
            { jpath: "$.bookmark.title", type: "text" },
            { jpath: "$.bookmark.dateAdded", type: "date" },
            { jpath: "$.bookmark.url", type: "url" },
          ],
        },
      });
    };

    if (!bookmarks.onCreated.hasListener(this.callbacks[key]))
      bookmarks.onCreated.addListener(this.callbacks[key]);

    const changeKey = `${key}_change`;
    this.callbacks[changeKey] = async (
      id: string,
      changeInfo: Bookmarks.BookmarkTreeNode,
    ) => {
      changeInfo.id = id;
      await this.data.collect({
        origin: changeInfo.url ?? "",
        header: createMessageHeader("browsing", "Bookmark Changed", module),
        data: {
          out: {
            bookmark: changeInfo,
          },
          schems: [
            { jpath: "$.bookmark.title", type: "text" },
            { jpath: "$.bookmark.url", type: "url" },
            { jpath: "$.bookmark.id", type: "id" },
          ],
        },
      });
    };

    if (!bookmarks.onChanged.hasListener(this.callbacks[changeKey]))
      bookmarks.onChanged.addListener(this.callbacks[changeKey]);
  }

  private handleResponse(
    module: InMemoryModules<ModuleHandler.BROWSING>,
    item: CollectorBase<ResponseCollector>,
    key: string,
  ): void {
    this.callbacks[key] = async (
      details: WebRequest.OnHeadersReceivedDetailsType,
    ) => {
      const matched = item.patterns?.some(
        (pattern) => details.statusCode === pattern.status_code,
      );

      if (matched)
        await this.data.collect({
          origin: details.url,
          header: createMessageHeader("browsing", item.name, module),
          data: {
            out: {
              statusCode: details.statusCode,
              url: details.url,
            },
            schems: [
              { jpath: "$.statusCode", type: "text" },
              { jpath: "$.url", type: "url" },
            ],
          },
        });
    };

    const filter = item.filter ?? module.filter;

    if (!webRequest.onHeadersReceived.hasListener(this.callbacks[key]))
      webRequest.onHeadersReceived.addListener(this.callbacks[key], filter);
  }

  private inspectReferrer(
    module: InMemoryModules<ModuleHandler.BROWSING>,
    item: CollectorBase<WebRequestCollector>,
    requestDetails: WebRequest.OnBeforeRequestDetailsType,
    origin: string,
  ): CollectedMessage | null {
    if (
      requestDetails.type !== "main_frame" ||
      (!requestDetails.originUrl && !requestDetails.initiator)
    ) {
      return null;
    }
    return {
      origin,
      header: createMessageHeader("browsing", item.name, module),
      data: {
        out: {
          url: requestDetails.url,
          originUrl: requestDetails.originUrl ?? requestDetails.initiator,
        },
        schems: [
          { jpath: "$.url", type: "url" },
          { jpath: "$.originUrl", type: "url" },
        ],
      },
    };
  }

  private inspectVisit(
    module: InMemoryModules<ModuleHandler.BROWSING>,
    item: CollectorBase<WebRequestCollector>,
    requestDetails: WebRequest.OnBeforeRequestDetailsType,
  ): CollectedMessage | null {
    if (requestDetails.type !== "main_frame") return null;
    return {
      origin: requestDetails.url,
      header: createMessageHeader("browsing", item.name, module),
      data: {
        out: {
          url: requestDetails.url,
        },
        schems: [{ jpath: "$.url", type: "url" }],
      },
    };
  }

  private inspectRequestPatterns(
    module: InMemoryModules<ModuleHandler.BROWSING>,
    item: CollectorBase<WebRequestCollector>,
    requestDetails: WebRequest.OnBeforeRequestDetailsType,
  ): CollectedMessage | null {
    if (!item.patterns) return null;

    for (const pattern of item.patterns) {
      const result = this.inspectRequestPattern(
        module,
        item,
        pattern,
        requestDetails,
      );
      if (result && Object.keys(result).length > 0) {
        return result;
      }
    }
    return null;
  }

  private inspectRequestPattern(
    module: InMemoryModules<ModuleHandler.BROWSING>,
    item: CollectorBase<WebRequestCollector>,
    pattern: WebRequestCollectorPattern,
    requestDetails: WebRequest.OnBeforeRequestDetailsType,
  ): CollectedMessage | null {
    if (requestDetails.method !== pattern.method) {
      return null;
    }

    let matchResult: RegExpExecArray | null = null;
    let isMatched = false;

    switch (pattern.pattern_type) {
      case MatchType.Regex:
        matchResult = new RegExp(pattern.url_pattern).exec(requestDetails.url);
        isMatched = matchResult !== null;
        break;
      case MatchType.Wildcard:
        isMatched = wildcard(requestDetails.url, pattern.url_pattern);
        break;
      case MatchType.Exact:
        isMatched = requestDetails.url === pattern.url_pattern;
        break;
      default:
        Logger.warn(`Unknown pattern type: ${pattern.pattern_type}`);
    }

    if (isMatched) {
      const res: Record<string, Any> = {};
      pattern.param.forEach((p: Any) => {
        let val: string | null = null;
        let query: string | null = null;

        switch (p.type) {
          case "regex":
            if (matchResult && matchResult[p.group ?? 0]) {
              val = decodeURIComponent(matchResult[p.group ?? 0]);
            }
            break;
          case "form":
            if (requestDetails.requestBody?.formData?.[p.key || ""]) {
              val = decodeURIComponent(
                requestDetails.requestBody.formData[p.key || ""][0],
              );
            }
            break;
          case "query":
            query = new URL(requestDetails.url).searchParams.get(p.key ?? "");
            if (query) {
              val = decodeURIComponent(query);
            }
            break;
          case "link":
            try {
              const url = new URL(requestDetails.url);
              if (["href", "origin", "hostname"].includes(p.key ?? "")) {
                val = decodeURIComponent(url[p.key as keyof URL] as string);
              }
            } catch (error) {
              Logger.error(`Invalid URL: ${requestDetails.url}`);
            }
            break;
          case "referrer":
            val = requestDetails.originUrl ?? requestDetails.initiator ?? null;
            break;
          default:
            Logger.warn(`Unknown parameter type: ${p.type}`);
        }

        if (val) {
          res[p.name] = val;
        } else if (p.default !== undefined) {
          res[p.name] = p.default;
        }
      });

      if (Object.keys(res).length === 0) return null;

      return {
        origin: requestDetails.url,
        header: createMessageHeader("browsing", item.name, module),
        data: {
          out: res,
          schems: pattern.schems,
        },
      };
    }

    return null;
  }
}
