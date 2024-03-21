import { ReactElement, useCallback, useEffect, useState } from 'react';

import { showPopup } from '../components/popup/popup';
import { Switch } from '../components/switch/switch';
import { VerifiedUsersOnly } from '../components/verification/verified-users-only';
import { helper } from '../core/webHelper';
import { AdsTypeStatus } from '../types/storage/ads-config.type';

export function EarnFromAds(): ReactElement {
  const [verified, setVerified] = useState<boolean | undefined>(undefined);
  const [ads, setAds] = useState<AdsTypeStatus>({
    fullScreen: false,
    pushNotification: false,
    integratedDisplay: false,
  });

  const updateValues = useCallback(() => {
    helper.getAdsStatus().then(setAds);
  }, []);

  const onToggleClick = useCallback(
    (name, value) => {
      helper.updateAdsStatus({ ...ads, [name]: value }).then();
      updateValues();
    },
    [ads, updateValues],
  );

  const checkVerification = useCallback(() => {
    helper.isAccountInitialized().then((initiated: boolean) => {
      if (initiated) {
        helper.isVerified().then((verified: boolean) => {
          setVerified(verified);
        });
      } else {
        setTimeout(checkVerification, 3000, true);
      }
    });
  }, []);

  useEffect(() => {
    checkVerification();
    updateValues();
  }, [checkVerification, updateValues]);

  return (
    <>
      <div className={'page-header beta-badge-header'}>
        <h2>Earn More</h2>
        <div className={'beta-badge-page'}>Beta</div>
      </div>
      {verified === undefined ? (
        <></>
      ) : (
        <div className={'flex col gap32'}>
          {verified ? (
            <></>
          ) : (
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
                      including surveys, videos, and technical and commercial
                      product integrations with Swash partners.
                      <br />
                      <br />
                      To use the Earn More feature, your profile has to be
                      verified. Take a few minutes to verify your profile and
                      get ready to enter a new internet.
                    </>
                  }
                />
              ),
            })
          )}
          <div className={'round no-overflow flex col gap16 bg-white card'}>
            <h6>Swash Ads</h6>
            <p>
              Earn even more with Swash by opting-in to receive Swash Ads on
              your favourite browser. You see ads and get paid as a thank you
              for your attention.
            </p>
            <br />
            <p>
              Opt-in with the toggles below to get paid for seeing Swash ads:
            </p>
            <div className={'flex col gap16'}>
              <div className={'flex row align-center gap16'}>
                <Switch
                  checked={ads.fullScreen}
                  onChange={(e) =>
                    onToggleClick('fullScreen', e.target.checked)
                  }
                />
                Receive full page ads when opening a new tab
              </div>
              <div className={'flex row align-center gap16'}>
                <Switch
                  checked={ads.pushNotification}
                  onChange={(e) =>
                    onToggleClick('pushNotification', e.target.checked)
                  }
                />
                Receive ads as push notifications
              </div>
              <div className={'flex row align-center gap16'}>
                <Switch
                  checked={ads.integratedDisplay}
                  onChange={(e) =>
                    onToggleClick('integratedDisplay', e.target.checked)
                  }
                />
                Receive integrated display ads
              </div>
            </div>
          </div>
          <div className={'round no-overflow bg-white card'}>
            <div className={'flex row align-center justify-between gap32'}>
              <div className={'grow1'}>
                <h6>Get the full page experience</h6>
                <p>
                  Ready to unlock the full potential of your browser?
                  <br />
                  <br />
                  With the Swash full page new tab, you can not-only earn from
                  full page ads, you can also customise your view to include
                  your taste. Widgets, jokes, gifs, and more coming soon.
                  <br />
                  <br />
                  Plus, soon you will be able to check out the latest news by
                  scrolling down the Swash News section. You can always tailor
                  your preferences in your new tab settings.
                </p>
              </div>
              <img
                src={'/static/images/background/new-tab.png'}
                alt={'New Tab Experience'}
                className={'earn-from-ads-image'}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
