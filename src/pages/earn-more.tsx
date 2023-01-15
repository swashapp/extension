import React, { useCallback, useEffect, useState } from 'react';

import { BackgroundTheme } from '../components/drawing/background-theme';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { Switch } from '../components/switch/switch';
import { helper } from '../core/webHelper';
import { AdsTypeStatus } from '../types/storage/ads-config.type';

export function EarnMore(): JSX.Element {
  const [ads, setAds] = useState<AdsTypeStatus>({
    fullScreen: false,
    pushNotification: false,
    integratedDisplay: false,
  });
  const [ntx, setNtx] = useState<boolean>(false);

  const updateValues = useCallback(() => {
    helper.getNewTabStatus().then(setNtx);
    helper.getAdsStatus().then(setAds);
  }, []);

  const onToggleClick = useCallback(
    (name, value) => {
      switch (name) {
        case 'ntx':
          helper.updateNewTabStatus(value).then();
          break;
        default:
          helper.updateAdsStatus({ ...ads, [name]: value }).then();
          break;
      }
      updateValues();
    },
    [ads, updateValues],
  );

  useEffect(() => {
    updateValues();
  }, [updateValues]);

  return (
    <div className="page-container">
      <BackgroundTheme />
      <div className="page-content">
        <div className="page-header">
          <h2>Earn More</h2>
        </div>
        <div className="flex-column card-gap">
          <div className="simple-card">
            <h6>Earn More</h6>
            <p>
              Currently in beta, Swash’s Earn More feature enables verified
              Swash app members to turbo boost their earnings by opting in for
              new ways to earn online. Now live with Swash ads and a fully
              customisable New Tab Experience, new ways to Earn More will be
              added to this page over time, including surveys, videos, and
              technical and commercial product integrations with our partners.
            </p>
            <div className="flex-row flex-align-center form-item-gap">
              <Switch
                checked={!ads.fullScreen}
                onChange={(e) => onToggleClick('fullScreen', !e.target.checked)}
              />
              Receive full page ads when opening a new tab
            </div>
            <div className="flex-row flex-align-center form-item-gap">
              <Switch
                checked={!ads.pushNotification}
                onChange={(e) =>
                  onToggleClick('pushNotification', !e.target.checked)
                }
              />
              Receive ads as push notifications
            </div>
            <div className="flex-row flex-align-center form-item-gap">
              <Switch
                checked={!ads.integratedDisplay}
                onChange={(e) =>
                  onToggleClick('integratedDisplay', !e.target.checked)
                }
              />
              Receive integrated display ads
            </div>
          </div>
          <div className="simple-card">
            <FlexGrid column={2} className="earn-more-new-tab-cards card-gap">
              <div className="simple-card">
                <h6>Get the New Tab Experience</h6>
                <p className="earn-more-new-tab-description">
                  Are you ready to level up your browser?
                  <br />
                  <br />
                  With the Swash NTX, you can not-only earn from full page ads,
                  you can also fully customise your view to include widgets,
                  jokes, gifs, and more.
                  <br />
                  <br />
                  Plus, you can also check out the latest news by scrolling down
                  the Swash News section. Tailor results to your favourite
                  sources in NTX settings.
                </p>
                <div className="flex-row flex-align-center form-item-gap">
                  <Switch
                    checked={!ntx}
                    onChange={(e) => onToggleClick('ntx', !e.target.checked)}
                  />
                  Yes, I want to give my new tab a glow up
                </div>
              </div>
              <div className="simple-card flex-row flex-align-center earn-more-new-tab-image">
                <img
                  src={'/static/images/background/new-tab.png'}
                  alt={'New Tab Experience'}
                />
              </div>
            </FlexGrid>
          </div>
        </div>
      </div>
    </div>
  );
}
