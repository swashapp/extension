import React, { useEffect, useState } from 'react';

import { LearnMore } from '../button/learn-more';
import { ClosablePanel } from '../closable-panel/closable-panel';
import { Circle } from '../drawing/circle';

interface Notification {
  title: string;
  text: string;
  link: string;
}
export interface Notifications {
  general?: Notification;
  prize?: Notification;
}

export function WelcomeToNewDataWorld(): JSX.Element {
  const [notifications, setNotifications] = useState<Notifications>({});
  useEffect(() => window.helper.loadNotifications().then(setNotifications), []);
  return (
    <>
      {notifications.general && notifications.general.title ? (
        <ClosablePanel className={'welcome-container'}>
          <>
            <div className="welcome-text">
              <h5>{notifications.general.title}</h5>
            </div>
            <Circle className={'welcome-circle1'} border={'black'} />
            <Circle className={'welcome-circle2'} color={'black'} />
            <Circle className={'welcome-circle3'} border={'black'} />
            <LearnMore position="Sidenav" link={notifications.general.link} />
          </>
        </ClosablePanel>
      ) : (
        <></>
      )}
    </>
  );
}
