import { ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { helper } from '../../helper';
import { AdsType } from '../../types/ads.type';
import { AdsPreferences } from '../../types/storage/preferences.type';
import { PageHeader } from '../components/page-header/page-header';
import { showPopup } from '../components/popup/popup';
import { Switch } from '../components/switch/switch';
import { VerifiedUsersOnly } from '../components/verification/verified-users-only';
import { DashboardContext } from '../context/dashboard.context';

export function EarnFromAds(): ReactNode {
  const { account } = useContext(DashboardContext);

  const [ads, setAds] = useState<AdsType>({
    fullscreen: false,
    notification: false,
    integrated: false,
  });

  const updateValues = useCallback(async () => {
    const { status } = (await helper('preferences').get(
      'ads',
    )) as AdsPreferences;
    setAds(status);
  }, []);

  const onToggleClick = useCallback(
    async (name: keyof AdsType, value: boolean) => {
      await helper('preferences').setAdsStatus({ ...ads, [name]: value });
      updateValues();
    },
    [ads, updateValues],
  );

  useEffect(() => {
    updateValues();
  }, [updateValues]);

  useEffect(() => {
    if (!account.is_verified)
      showPopup({
        closable: false,
        closeOnBackDropClick: false,
        paperClassName: 'popup small',
        content: (
          <VerifiedUsersOnly
            header={'Get verified to Earn More!'}
            body={
              <>
                Earn More is only available for verified Swash members.
                <br />
                <br />
                Now live with Swash ads and a fully customisable New Tab
                Experience, new ways to Earn More will be added over time,
                including surveys, videos, and technical and commercial product
                integrations with Swash partners.
                <br />
                <br />
                To use the Earn More feature, your profile has to be verified.
                Take a few minutes to verify your profile and get ready to enter
                a new internet.
              </>
            }
          />
        ),
      });
  }, [account.is_verified]);

  return (
    <>
      <PageHeader header={'Earn More'} />
      {account.is_verified === undefined ? null : (
        <div className={'flex gap32'}>
          <div className={'round flex col col-17 bg-white card28'}>
            <div className={'flex col gap32'}>
              <div className={'flex col gap16'}>
                <p className={'subHeader2'}>Get the full page experience</p>
                <p>Ready to unlock the full potential of your browser?</p>
              </div>
              <p>
                With the Swash full page new tab, you can not-only earn from
                full page ads, you can also customise your view to include your
                taste. Widgets, jokes, gifs, and more coming soon.
                <br />
                <br />
                Plus, soon you will be able to check out the latest news by
                scrolling down the Swash News section. You can always tailor
                your preferences in your new tab settings.
              </p>
              <img
                src={'/static/images/background/new-tab.png'}
                alt={'New Tab Experience'}
                className={'earn-from-ads-image'}
              />
            </div>
          </div>
          <div className={'round flex col col-10 gap32 bg-white card28'}>
            <div className={'flex col gap32'}>
              <p className={'subHeader2'}>Swash Ads</p>
              <p>
                Earn even more with Swash by opting-in to receive Swash Ads on
                your favourite browser. You see ads and get paid as a thank you
                for your attention.
              </p>
            </div>
            <div className={'flex col gap24'}>
              <p className={'bold'}>
                Opt-in with the toggles below to get paid for seeing Swash ads:
              </p>
              <div className={'flex col gap24'}>
                <div className={'flex row align-center gap16'}>
                  <Switch
                    checked={ads.fullscreen}
                    onChange={(e) =>
                      onToggleClick('fullscreen', e.target.checked)
                    }
                  />
                  <p>Receive full page ads when opening a new tab</p>
                </div>
                <div className={'flex row align-center gap16'}>
                  <Switch
                    checked={ads.notification}
                    onChange={(e) =>
                      onToggleClick('notification', e.target.checked)
                    }
                  />
                  <p>Receive ads as push notifications</p>
                </div>
                <div className={'flex row align-center gap16'}>
                  <Switch
                    checked={ads.integrated}
                    onChange={(e) =>
                      onToggleClick('integrated', e.target.checked)
                    }
                  />
                  <p>Receive integrated display ads</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
