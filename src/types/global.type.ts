import { Any } from "@/types/any.type";

export {};

declare global {
  interface PushSubscriptionChangeEvent extends ExtendableEvent {
    readonly oldSubscription?: PushSubscription | null;
    readonly newSubscription?: PushSubscription | null;
  }

  interface ServiceWorkerGlobalScopeEventMap {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    pushsubscriptionchange: PushSubscriptionChangeEvent;
  }

  interface ServiceWorkerGlobalScope {
    addEventListener(
      type: "pushsubscriptionchange",
      listener: (
        this: ServiceWorkerGlobalScope,
        ev: PushSubscriptionChangeEvent,
      ) => Any,
      options?: boolean | AddEventListenerOptions,
    ): void;
  }
}
