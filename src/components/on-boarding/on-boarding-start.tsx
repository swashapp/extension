import React from 'react';
import FlexGrid from '../flex-grid/flex-grid';
import AlreadyHaveWalletIcon from 'url:../../static/images/icons/already-have-wallet.svg';
import StartNewWalletIcon from 'url:../../static/images/icons/start-new-wallet.svg';
import Button from '../button/button';

export default function OnBoardingStart(props: {
  onStartNew: () => void;
  onStartReady: () => void;
}) {
  return (
    <>
      <div className="page-header on-boarding-header">
        <h2>Welcome!</h2>
        <h2>Are you new to Swash?</h2>
      </div>
      <FlexGrid column={2} className="on-boarding-start-cards card-gap">
        <div className="simple-card">
          <div>
            <div className="card-icon">
              <img src={StartNewWalletIcon} alt={''} />
            </div>
            <div className="on-boarding-start-title">
              <h4>Yes, I’m new here</h4>
            </div>
            <div className="on-boarding-start-text">
              I want to create a new wallet
            </div>
          </div>
          <div className="form-button">
            <Button
              color="primary"
              text="Start"
              link={false}
              onClick={() => props.onStartNew()}
            />
          </div>
        </div>
        <div className="simple-card">
          <div>
            <div className="card-icon">
              <img src={AlreadyHaveWalletIcon} alt={''} />
            </div>
            <div className="on-boarding-start-title">
              <h4>No, I already have a wallet</h4>
            </div>
            <div className="on-boarding-start-text">
              Import my existing wallet settings
            </div>
          </div>
          <div className="form-button">
            <Button
              color="primary"
              text="Start"
              link={false}
              onClick={() => props.onStartReady()}
            />
          </div>
        </div>
      </FlexGrid>
    </>
  );
}
