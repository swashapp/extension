import React, { useContext } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import AlreadyHaveWalletIcon from 'url:../../static/images/icons/already-have-wallet.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import StartNewWalletIcon from 'url:../../static/images/icons/start-new-wallet.svg';

import { StepperContext } from '../../pages/onboarding';

import { Button } from '../button/button';
import { FlexGrid } from '../flex-grid/flex-grid';

export function OnboardingStart(): JSX.Element {
  const stepper = useContext(StepperContext);
  return (
    <>
      <div className="page-header onboarding-header">
        <h2>Welcome!</h2>
        <h2>Are you new to Swash?</h2>
      </div>
      <FlexGrid column={2} className="onboarding-start-cards card-gap">
        <div className="simple-card">
          <div>
            <div className="card-icon">
              <img src={StartNewWalletIcon} alt={''} />
            </div>
            <div className="onboarding-start-title">
              <h4>Yes, I’m new here</h4>
            </div>
            <div className="onboarding-start-text">
              I want to create a new wallet
            </div>
          </div>
          <div className="form-button">
            <Button
              color="primary"
              text="Start"
              link={false}
              onClick={() => {
                stepper.changeSelectedPage('New', 'Create');
                stepper.next();
              }}
            />
          </div>
        </div>
        <div className="simple-card">
          <div>
            <div className="card-icon">
              <img src={AlreadyHaveWalletIcon} alt={''} />
            </div>
            <div className="onboarding-start-title">
              <h4>No, I already have a wallet</h4>
            </div>
            <div className="onboarding-start-text">
              Import my existing wallet settings
            </div>
          </div>
          <div className="form-button">
            <Button
              color="primary"
              text="Start"
              link={false}
              onClick={() => {
                stepper.changeSelectedPage('New', 'Import');
                stepper.next();
              }}
            />
          </div>
        </div>
      </FlexGrid>
    </>
  );
}
