import React, { useEffect, useState } from 'react';

import { LearnMore } from '../button/learn-more';
import { ClosablePanel } from '../closable-panel/closable-panel';
import { Circle } from '../drawing/circle';

interface BannerItem {
  title: string;
  text: string;
  link: string;
}
export interface Banner {
  general?: BannerItem;
  prize?: BannerItem;
}

export function WelcomeToNewDataWorld(): JSX.Element {
  const [banner, setBanner] = useState<Banner>({});
  useEffect(() => window.helper.loadBanner().then(setBanner), []);
  return (
    <>
      {banner.general && banner.general.title ? (
        <ClosablePanel className={'welcome-container'}>
          <>
            <div className="welcome-text">
              <h5>{banner.general.title}</h5>
            </div>
            <Circle className={'welcome-circle1'} border={'black'} />
            <Circle className={'welcome-circle2'} color={'black'} />
            <Circle className={'welcome-circle3'} border={'black'} />
            <LearnMore position="Sidenav" link={banner.general.link} />
          </>
        </ClosablePanel>
      ) : (
        <></>
      )}
    </>
  );
}
