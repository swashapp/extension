import React, { useCallback, useEffect, useState } from 'react';

import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from 'react-share';

import { LearnMore } from '../components/button/learn-more';
import { BackgroundTheme } from '../components/drawing/background-theme';
import { Circle } from '../components/drawing/circle';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { IconButton } from '../components/icon-button/icon-button';
import { CopyEndAdornment } from '../components/input/end-adornments/copy-end-adornment';
import { Input } from '../components/input/input';
import { INVITE_FRIENDS_TOUR_CLASS } from '../components/invite-friends/invite-friends-tour';
import { NumericSection } from '../components/numeric-section/numeric-section';
import { Notifications } from '../components/sidenav/welcome-to-new-data-world';
import { UtilsService } from '../service/utils-service';

const TotalBonusIcon = '/static/images/icons/total-bonus.svg';
const TotalFriendsIcon = '/static/images/icons/total-friends.svg';
const EmailLogo = '/static/images/logos/email.png';
const FacebookLogo = '/static/images/logos/facebook.png';
const LinkedInLogo = '/static/images/logos/linkedin.png';
const TwitterLogo = '/static/images/logos/twitter.png';

const referralMessage = 'Use my referral link to earn as you surf with Swash:';

export function InviteFriends(): JSX.Element {
  const [referralLink, setReferralLink] = useState<string>('');
  const [reward, setReward] = useState<number>(0);
  const [referral, setReferral] = useState<{
    totalReward: string;
    totalReferral: string;
  }>({
    totalReward: '$',
    totalReferral: '$',
  });

  const loadReferral = useCallback(() => {
    window.helper.load().then((db: { profile: { user_id: string } }) => {
      if (!db.profile.user_id) {
        setTimeout(() => loadReferral(), 5000);
        return;
      }
      const _referralLink = db.profile.user_id
        ? `https://swashapp.io/referral/${db.profile.user_id}`
        : '';
      setReferralLink(_referralLink);
    });
  }, []);

  const loadActiveReferral = useCallback(() => {
    window.helper.getActiveReferral().then((referral: { reward: number }) => {
      if (referral.reward) setReward(referral.reward);
    });
  }, []);

  const loadReferrals = useCallback(() => {
    window.helper
      .getReferrals()
      .then((_referral: { totalReward: string; totalReferral: string }) => {
        setReferral(_referral);
      });
  }, []);

  useEffect(() => {
    loadReferral();
    loadActiveReferral();
    loadReferrals();
  }, [loadActiveReferral, loadReferral, loadReferrals]);

  const [notifications, setNotifications] = useState<Notifications>({});
  useEffect(() => window.helper.loadNotifications().then(setNotifications), []);
  return (
    <div className="page-container">
      <BackgroundTheme />
      <div className="page-content">
        <div className="page-header">
          <h2>Invite Friends</h2>
        </div>
        <div className="flex-column card-gap">
          <FlexGrid column={2} className="invite-friends-numerics card-gap">
            <NumericSection
              title="Total Bonus Earned"
              value={UtilsService.purgeNumber(referral.totalReward)}
              layout="layout1"
              image={TotalBonusIcon}
            />
            <NumericSection
              tourClassName={INVITE_FRIENDS_TOUR_CLASS.FRIENDS}
              title="Total Invited Friends"
              value={referral.totalReferral}
              layout="layout2"
              image={TotalFriendsIcon}
            />
          </FlexGrid>
          <div className="simple-card">
            <FlexGrid
              column={2}
              className="invite-friends-bonus-cards card-gap"
            >
              <div className="simple-card">
                <h6>Get More Swash Bonus</h6>
                <p>
                  Share your referral link and earn {reward} SWASH for every
                  friend you bring to Swash!
                </p>
                <Input
                  className={INVITE_FRIENDS_TOUR_CLASS.REFERRAL}
                  name="referral"
                  label="Your Referral Link"
                  value={referralLink}
                  disabled={true}
                  onChange={(e) => setReferralLink(e.target.value)}
                  endAdornment={<CopyEndAdornment value={referralLink} />}
                />
                <div className="or-share-on-line">
                  <div className="or-share-line">
                    <div className={'solid-line'} />
                  </div>
                  <div className="or-share">or share</div>
                  <div className="or-share-line">
                    <div className={'solid-line'} />
                  </div>
                </div>
                <FlexGrid column={4} className="flex-grid form-item-gap">
                  <TwitterShareButton
                    className="share-button"
                    url={referralLink}
                    title={referralMessage}
                  >
                    <IconButton image={TwitterLogo} link={false} />
                  </TwitterShareButton>
                  <FacebookShareButton
                    className="share-button"
                    url={referralLink}
                    quote={referralMessage}
                  >
                    <IconButton image={FacebookLogo} link={false} />
                  </FacebookShareButton>
                  <LinkedinShareButton
                    className="share-button"
                    url={referralLink}
                    summary={referralMessage}
                  >
                    <IconButton image={LinkedInLogo} link={false} />
                  </LinkedinShareButton>
                  <EmailShareButton
                    className="share-button"
                    url={referralLink}
                    subject={'My Referral Link'}
                    body={referralMessage}
                  >
                    <IconButton image={EmailLogo} link={false} />
                  </EmailShareButton>
                </FlexGrid>
              </div>
              <div className="simple-card win-swash-prize">
                <Circle
                  className={'win-swash-prize-circle1'}
                  border={'black'}
                  dashed={'6 14'}
                />
                <Circle
                  className={'win-swash-prize-circle2'}
                  border={'black'}
                />
                <Circle className={'win-swash-prize-circle3'} color={'black'} />
                <div className="flex-column win-swash-prize-content">
                  <div className="win-swash-prize-title">
                    <h5>
                      {notifications.prize?.title ||
                        'There are currently no active referral programs'}
                    </h5>
                  </div>
                  <div className="flex-column justify-space-between">
                    <div className="win-swash-prize-text">
                      {notifications.prize?.text ||
                        "Don't worry, your earnings are not affected. Come back again later!"}
                    </div>
                    <div className="win-swash-prize-button">
                      {notifications.prize ? (
                        <LearnMore
                          size="small"
                          position="WinSwashPrize"
                          link={notifications.prize?.link || ''}
                        />
                      ) : (
                        <div style={{ height: 40 }} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FlexGrid>
          </div>
        </div>
      </div>
    </div>
  );
}
