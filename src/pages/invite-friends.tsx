import React, { useCallback, useEffect, useState } from 'react';

import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from 'react-share';

import { LearnMore } from '../components/button/learn-more';
import { FlexGrid } from '../components/flex-grid/flex-grid';
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

export function InviteFriends(): JSX.Element {
  const [referralLink, setReferralLink] = useState<string>('');
  const [reward, setReward] = useState<string>(initValue);
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

  const loadActiveReferral = useCallback(() => {
    helper
      .getLatestPrograms()
      .then((data: { referral: { reward: string } }) => {
        if (data.referral.reward) setReward(data.referral.reward);
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
    loadActiveReferral();
    loadReferrals();
    loadInAppNotifications();
  }, [loadActiveReferral, loadInAppNotifications, loadReferral, loadReferrals]);

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h2>Referral bonus</h2>
        </div>
        <div className="flex-column card-gap">
          <FlexGrid column={2} className="invite-friends-numerics card-gap">
            <NumericSection
              title="SWASH Referral Bonus"
              tooltip="Swash has anti-fraud measures to combat fake users. Only genuine referrals will be reflected here."
              value={UtilsService.purgeNumber(referral.totalReward)}
              layout="layout1"
              image={TotalBonusIcon}
            />
            <NumericSection
              title="Invited Friends"
              tooltip="You will not receive referral rewards for friends that are flagged as fake by Swash’s anti-fraud measures."
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
                <h6>BONUS! Get more SWASH tokens when you invite a friend</h6>
                <p>
                  {reward === initValue || reward === '0'
                    ? 'Share your link to be in for a chance of winning the monthly 2000 SWASH prize!'
                    : `Share your referral link and earn ${reward} SWASH for every new friend you bring!`}
                </p>
                <Input
                  name="referral"
                  label="Your referral link"
                  value={referralLink}
                  disabled={true}
                  onChange={(e) => setReferralLink(e.target.value)}
                  endAdornment={<CopyEndAdornment value={referralLink} />}
                />
                <div className="or-share-on-line">
                  <div className="or-share-line">
                    <div className={'solid-line'} />
                  </div>
                  <div className="or-share">share</div>
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
