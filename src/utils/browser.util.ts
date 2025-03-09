import { action, runtime, scripting, Tabs, tabs } from "webextension-polyfill";

import { PlatformOS } from "@/enums/platform.enum";
import { Any } from "@/types/any.type";

export function getAppName(): string {
  return runtime.getManifest().name;
}

export function getAppVersion(): string {
  return runtime.getManifest().version;
}

export function getUserAgent(): string {
  return navigator.userAgent;
}

export function getBrowserLanguage(): string {
  return navigator.language;
}

export async function getSystemInfo() {
  const info: {
    arch: string;
    osName: PlatformOS;
    osVersion: string;
    userAgent: string;
  } = {
    arch: "Unknown",
    osName: PlatformOS.UNKNOWN,
    osVersion: "Unknown",
    userAgent: getUserAgent(),
  };

  if (runtime.getPlatformInfo) {
    const { arch, os } = await runtime.getPlatformInfo();
    info.arch = arch;
    info.osName = os as PlatformOS;
  }

  const userAgent = info.userAgent || "Unknown";

  if (info.osName === PlatformOS.UNKNOWN) {
    if (/Windows NT/.test(userAgent)) info.osName = PlatformOS.WINDOWS;
    else if (/Mac OS X/.test(userAgent)) info.osName = PlatformOS.MAC;
    else if (/iPhone OS/.test(userAgent)) info.osName = PlatformOS.IOS;
    else if (/iPad OS/.test(userAgent)) info.osName = PlatformOS.IPADOS;
    else if (/Linux/.test(userAgent)) info.osName = PlatformOS.LINUX;
    else if (/Android/.test(userAgent)) info.osName = PlatformOS.ANDROID;
  }

  if (info.osName === PlatformOS.WINDOWS) {
    const match = userAgent.match(/Windows NT ([\d.]+)/);
    if (match) info.osVersion = match[1];
  } else if (info.osName === PlatformOS.MAC) {
    const match = userAgent.match(/Mac OS X ([\d._]+)/);
    if (match) info.osVersion = match[1].replace(/_/g, ".");
  } else if (info.osName === PlatformOS.IOS) {
    const match = userAgent.match(/iPhone OS ([\d_]+)/);
    if (match) info.osVersion = match[1].replace(/_/g, ".");
  } else if (info.osName === PlatformOS.IPADOS) {
    const match = userAgent.match(/iPad OS ([\d_]+)/);
    if (match) info.osVersion = match[1].replace(/_/g, ".");
  } else if (info.osName === PlatformOS.ANDROID) {
    const match = userAgent.match(/Android ([\d.]+)/);
    if (match) info.osVersion = match[1];
  }

  return info;
}

export function getExtensionURL(path: string): string {
  return runtime.getURL(path);
}

export async function openInNewTab(url: string): Promise<Tabs.Tab> {
  const allTabs = await tabs.query({});
  const tab = allTabs.find((tab) => tab.url === url);

  if (!tab) return tabs.create({ url });
  await tabs.update(tab.id, { active: true });
  return { ...tab, active: true };
}

export async function openInTab(url: string): Promise<Tabs.Tab> {
  const allTabs = await tabs.query({ currentWindow: true, active: true });
  await tabs.update(allTabs[0].id, { url });

  return { ...allTabs[0], active: true };
}

export function setBrowserIcon(items: Any): void {
  action.setIcon(items);
}

export async function executeScript(
  tabId: number,
  files: string[],
): Promise<void> {
  await scripting.executeScript({
    injectImmediately: true,
    target: { tabId, allFrames: false },
    files,
  });
}

export async function getTabTitle(tabId: number): Promise<Any[]> {
  return scripting.executeScript({
    target: { tabId: tabId },
    func: () => document.title,
  });
}
