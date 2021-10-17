import React, { memo, useCallback, useEffect, useState } from 'react';

import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from 'react-share';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import TotalBonusIcon from 'url:../static/images/icons/total-bonus.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import TotalFriendsIcon from 'url:../static/images/icons/total-friends.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import EmailLogo from 'url:../static/images/logos/email.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import FacebookLogo from 'url:../static/images/logos/facebook.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import LinkedInLogo from 'url:../static/images/logos/linkedin.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import TwitterLogo from 'url:../static/images/logos/twitter.png';

import LearnMore from '../components/button/learn-more';
import BackgroundTheme from '../components/drawing/background-theme';
import Circle from '../components/drawing/circle';
import FlexGrid from '../components/flex-grid/flex-grid';

import IconButton from '../components/icon-button/icon-button';
import CopyEndAdornment from '../components/input/end-adornments/copy-end-adornment';
import Input from '../components/input/input';
import NumericSection from '../components/numeric-section/numeric-section';
const referralMessage =
  'Use my referral link to earn money as you surf with Swash:';
export default memo(function InviteFriends() {
  const [referralLink, setReferralLink] = useState<string>('');
  const [reward, setReward] = useState<number>(0);

  const loadReferral = useCallback(() => {
    window.helper.load().then((db) => {
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
    window.helper.getActiveReferral().then((referral) => {
      if (referral.reward) setReward(referral.reward);
    });
  }, []);

  useEffect(() => {
    loadReferral();
    loadActiveReferral();
  }, [loadActiveReferral, loadReferral]);
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
              value={'124343.9'}
              layout="layout1"
              image={TotalBonusIcon}
            />
            <NumericSection
              title="Total Invited Friends"
              value={'123'}
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
                <h6>Get More Data Bonus</h6>
                <p>
                  Share your referral link and earn {reward} DATA for every
                  friend you bring to Swash!
                </p>
                <Input
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
              <div className="simple-card win-data-prize">
                <Circle
                  className={'win-data-prize-circle1'}
                  border={'black'}
                  dashed={'6 14'}
                />
                <Circle className={'win-data-prize-circle2'} border={'black'} />
                <Circle className={'win-data-prize-circle3'} color={'black'} />
                <div className="flex-column win-data-prize-content">
                  <div className="win-data-prize-title">
                    <h5>Win 1000 DATA prize every month!</h5>
                  </div>
                  <div className="flex-column justify-space-between">
                    <div className="win-data-prize-text">
                      Bring the most new users in a month, you’ll receive a 1000
                      DATA prize!
                    </div>
                    <div className="win-data-prize-button">
                      <LearnMore size="small" position="WinDataPrize" />
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
});
