export type Notification = {
  title: string;
  text: string;
  link: string;
};

export type InAppNotification = {
  [key: string]: Notification;
};

export type Notifications = {
  inApp: InAppNotification;
  push: Notification[];
};
