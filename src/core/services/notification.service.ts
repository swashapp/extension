import { FirebaseApp, initializeApp } from "firebase/app";
import { getToken } from "firebase/messaging";
import { getMessaging, Messaging } from "firebase/messaging/sw";

import { FirebaseConfig, VapidKey } from "@/firebase";
import { Any } from "@/types/any.type";
import { Managers } from "@/types/app.type";
import { Logger } from "@/utils/log.util";

import { UserService } from "./user.service";

declare const self: ServiceWorkerGlobalScope;

export class NotificationService {
  private app!: FirebaseApp;
  private messaging!: Messaging;
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    protected managers: Managers,
    protected user: UserService,
  ) {
    this.logger.info("Starting initialization");
    this.updateConfig();

    this.managers.coordinator.subscribe(
      "isOutOfDate",
      async (value, oldValue) => {
        if (value !== oldValue && !value) {
          this.logger.info("Updating configuration");
          this.updateConfig();
          this.logger.info("Configuration updated");
        }
      },
    );

    if (this.managers.coordinator.get("isActive")) this.updateToken().then();
    this.managers.coordinator.subscribe("isActive", async (active: boolean) => {
      if (active) await this.updateToken();
    });

    this.logger.info("Initialization completed");
  }

  private updateConfig(): void {
    this.app = initializeApp(FirebaseConfig);
    this.messaging = getMessaging(this.app);
  }

  public async updateToken(): Promise<void> {
    try {
      this.logger.debug("Updating notification token");
      const token = await getToken(this.messaging, {
        vapidKey: VapidKey,
        serviceWorkerRegistration: self.registration,
      });

      if (token === this.managers.preferences.get("notification").token)
        this.logger.info("Notification token is up-to-date");
      else {
        await this.user.registerNotification(token);
        await this.managers.preferences.setNotificationToken(token);
        this.logger.info("Notification token is updated");
      }

      if (!this.managers.preferences.get("notification").subscribed)
        await this.changeSubscription(true);
    } catch (error) {
      this.logger.error("Updating notification token failed", error);
    }
  }

  public async changeSubscription(status: boolean): Promise<void> {
    if (status) await this.user.subscribeNotification();
    else await this.user.unsubscribeNotification();

    await this.managers.preferences.setNotificationSubscribed(status);
    this.logger.info(
      `Notification subscription changed to ${status ? "subscribed" : "unsubscribed"}`,
    );
  }

  public async handlePush(payload: Any): Promise<void> {
    try {
      const { subscribed } = this.managers.preferences.get("notification");

      if (!subscribed) {
        this.logger.debug("Push received while unsubscribed");
        return;
      }

      const hasBrowserNotification =
        !!payload?.notification && typeof payload.notification === "object";
      if (hasBrowserNotification) {
        this.logger.warn("Push received with notification payload");
        return;
      }

      const n: Record<string, Any> =
        (payload?.data as Any) ??
        (typeof payload === "object"
          ? payload
          : { body: String(payload ?? "") }) ??
        {};

      const title = n.title ?? "Notification";
      const body = n.body ?? "";

      await self.registration.showNotification(title, {
        body,
        icon: typeof n.icon === "string" ? n.icon : undefined,
        badge: typeof n.badge === "string" ? n.badge : undefined,
        tag: typeof n.tag === "string" ? n.tag : undefined,
        data: n.link ? { url: n.link } : undefined,
      });

      this.logger.debug("Notification shown from data-only payload");
    } catch (error) {
      this.logger.error("Handling push message failed", error);
    }
  }
}
