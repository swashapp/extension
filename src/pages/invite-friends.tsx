import React, { useState } from 'react';
import FlexGrid from '../components/flex-grid/flex-grid';
import NumericSection from '../components/numeric-section/numeric-section';
import TotalBonusIcon from 'url:../static/images/icons/total-bonus.svg';
import TotalFriendsIcon from 'url:../static/images/icons/total-friends.svg';
import TwitterLogo from 'url:../static/images/logos/twitter.png';
import FacebookLogo from 'url:../static/images/logos/facebook.png';
import LinkedinLogo from 'url:../static/images/logos/linkedin.png';
import EmailLogo from 'url:../static/images/logos/email.png';
import Input from '../components/input/input';
import CopyEndAdornment from '../components/input/end-adronments/copy-end-adornment';
import BackgroundTheme from '../components/drawing/background-theme';
import LearnMore from '../components/button/learn-more';
import Circle from '../components/drawing/circle';
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from 'react-share';
import IconButton from '../components/icon-button/icon-button';

const referralMessage =
  'Use my referral link to earn money as you surf with Swash:';
export default function InviteFriends() {
  const [referralLink, setReferralLink] = useState<string>('');
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
                  Share your referral link and earn 1 DATA for every friend you
                  bring to Swash!
                </p>
                <Input
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
                    <IconButton image={LinkedinLogo} link={false} />
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
                <div className="win-data-prize-title">
                  <h5>Win 1000 DATA prize every month!</h5>
                </div>
                <div className="flex-column">
                  <div className="win-data-prize-text">
                    Bring the most new users in a month, you’ll receive a 1000
                    DATA prize!
                  </div>
                </div>
                <div className="win-data-prize-button">
                  <LearnMore size="small" position="WinDataPrize" />
                </div>
              </div>
            </FlexGrid>
          </div>
        </div>
      </div>
    </div>
  );
}
