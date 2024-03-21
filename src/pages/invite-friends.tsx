import { ReactElement, useCallback, useEffect, useState } from 'react';

import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from 'react-share';

import { LearnMore } from '../components/button/learn-more';
import { IconButton } from '../components/icon-button/icon-button';
import { CopyEndAdornment } from '../components/input/end-adornments/copy-end-adornment';
import { Input } from '../components/input/input';
import { NumericSection } from '../components/numeric-section/numeric-section';
import { helper } from '../core/webHelper';
import { WebsitePath } from '../paths';
import { initValue, UtilsService } from '../service/utils-service';

const TotalBonusIcon = '/static/images/icons/total-bonus.svg';
const TotalFriendsIcon = '/static/images/icons/total-friends.svg';
const EmailLogo = '/static/images/logos/email.png';
const FacebookLogo = '/static/images/logos/facebook.png';
const LinkedInLogo = '/static/images/logos/linkedin.png';
const TwitterLogo = '/static/images/logos/twitter.png';

const referralMessage = 'Use my referral link to earn as you surf with Swash:';

interface Notification {
  title: string;
  text: string;
  link: string;
}
export interface Notifications {
  general?: Notification;
  prize?: Notification;
}

export function InviteFriends(): ReactElement {
  const [referralLink, setReferralLink] = useState<string>('');
  const [referral, setReferral] = useState<{
    totalReward: string;
    totalReferral: string;
  }>({
    totalReward: initValue,
    totalReferral: initValue,
  });
  const [notifications, setNotifications] = useState<Notifications>({});

  const loadReferral = useCallback(() => {
    helper.load().then((db: { profile: { user_id: string } }) => {
      if (!db.profile.user_id) {
        setTimeout(() => loadReferral(), 3000);
        return;
      }
      const _referralLink = db.profile.user_id
        ? `${WebsitePath}/referral/${db.profile.user_id}`
        : '';
      setReferralLink(_referralLink);
    });
  }, []);

  const loadReferrals = useCallback(() => {
    helper
      .getReferrals()
      .then((_referral: { totalReward: string; totalReferral: string }) => {
        setReferral(_referral);
      });
  }, []);

  const loadInAppNotifications = useCallback(() => {
    helper.loadNotifications().then((_notifications) => {
      setNotifications(_notifications.inApp);
    });
  }, []);

  useEffect(() => {
    loadReferral();
    loadReferrals();
    loadInAppNotifications();
  }, [loadInAppNotifications, loadReferral, loadReferrals]);

  return (
    <>
      <div className={'page-header'}>
        <h6>Referral bonus</h6>
      </div>
      <div className={'flex col gap32'}>
        <div className="flex row gap32">
          <NumericSection
            title={'SWASH referral bonus'}
            tooltip={
              'Swash has anti-fraud measures to combat fake users. Only genuine referrals will be reflected here.'
            }
            value={UtilsService.purgeNumber(referral.totalReward)}
            layout={'layout1'}
            image={TotalBonusIcon}
            className={'grow1'}
          />
          <NumericSection
            title={'Invited friends'}
            tooltip={
              'You will not receive referral rewards for friends that are flagged as fake by Swash’s anti-fraud measures.'
            }
            value={referral.totalReferral}
            layout={'layout2'}
            image={TotalFriendsIcon}
            className={'grow1'}
          />
        </div>
        <div className={'round no-overflow flex nowrap gap32 bg-white card'}>
          <div className={'flex col gap32 grow1'}>
            <h6>Earn more by inviting your friends</h6>
            <p>
              Share your referral link to bring your friends to Swash. Keep
              checking this page for live referral programs.
            </p>
            <Input
              name="referral"
              label="Your referral link"
              value={referralLink}
              disabled={true}
              onChange={(e) => setReferralLink(e.target.value)}
              endAdornment={<CopyEndAdornment value={referralLink} />}
            />
            <div className={'flex align-center relative'}>
              <hr className={'grow1'} />
              <p className={'absolute bg-white invite-friends-share-line'}>
                Share
              </p>
            </div>
            <div className={'flex nowrap gap16'}>
              <TwitterShareButton
                className={'grow1 invite-friends-twitter-button'}
                url={referralLink}
                title={referralMessage}
              >
                <IconButton image={TwitterLogo} link={false} />
              </TwitterShareButton>
              <FacebookShareButton
                className={'grow1'}
                url={referralLink}
                title={referralMessage}
              >
                <IconButton image={FacebookLogo} link={false} />
              </FacebookShareButton>
              <LinkedinShareButton
                className={'grow1'}
                url={referralLink}
                summary={referralMessage}
              >
                <IconButton image={LinkedInLogo} link={false} />
              </LinkedinShareButton>
              <EmailShareButton
                className={'grow1'}
                url={referralLink}
                subject={'My Referral Link'}
                body={referralMessage}
              >
                <IconButton image={EmailLogo} link={false} />
              </EmailShareButton>
            </div>
          </div>
          <div className={'round bg-soft-green relative card3 grow1'}>
            <div className={'flex column justify-between'}>
              <div className={'invite-friends-win-prize-text'}>
                <h6>
                  {notifications.prize?.title ||
                    'There are currently no active referral programs'}
                </h6>
                <p>
                  {notifications.prize?.text ||
                    "Don't worry, your earnings are not affected. Come back again later!"}
                </p>
              </div>
              <div className={'invite-friends-win-prize-button'}>
                {notifications.prize ? (
                  <LearnMore
                    size={'small'}
                    position={'WinSwashPrize'}
                    link={notifications.prize?.link || ''}
                  />
                ) : (
                  <div style={{ height: 40 }} />
                )}
              </div>
              <img
                className={'absolute invite-friends-win-prize-img'}
                src={'/static/images/icons/earn/cup.png'}
                alt={''}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
