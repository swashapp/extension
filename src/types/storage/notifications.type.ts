export type Notification = {
  title: string;
  text: string;
  link: string;
};

export type InAppNotification = {
  [key: string]: Notification;
};

export type PushNotification = Notification & {
  expire?: number;
  type: string;
};

export type Notifications = {
  inApp: InAppNotification;
  push: PushNotification[];
};
