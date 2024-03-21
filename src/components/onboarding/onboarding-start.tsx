import { ReactElement, useContext } from 'react';

import { StepperContext } from '../../pages/onboarding';
import { Button } from '../button/button';

const AlreadyHaveWalletIcon = '/static/images/icons/already-have-wallet.svg';
const StartNewWalletIcon = '/static/images/icons/start-new-wallet.svg';

export function OnboardingStart(): ReactElement {
  const stepper = useContext(StepperContext);
  return (
    <div className={'onboarding-block'}>
      <div className={'page-header'}>
        <h6>Welcome!</h6>
        <h6>Are you new to Swash?</h6>
      </div>
      <div className={'flex gap32'}>
        <div className={'round no-overflow bg-white card grow1'}>
          <div>
            <div className={'card-icon'}>
              <img src={StartNewWalletIcon} alt={''} />
            </div>
            <p className={'subHeader2'}>Yes, I’m new here</p>
            <p>I want to create a new wallet</p>
          </div>
          <Button
            className={'onboarding-button'}
            color={'primary'}
            text={'Start'}
            link={false}
            onClick={() => {
              stepper.changeSelectedPage('New', 'Create');
              stepper.next();
            }}
          />
        </div>
        <div className={'round no-overflow bg-white card grow1'}>
          <div>
            <div className={'card-icon'}>
              <img src={AlreadyHaveWalletIcon} alt={''} />
            </div>
            <p className={'subHeader2'}>No, I already have a wallet</p>
            <p>Import my existing wallet settings</p>
          </div>
          <Button
            className={'onboarding-button'}
            color={'primary'}
            text={'Start'}
            link={false}
            onClick={() => {
              stepper.changeSelectedPage('New', 'Import');
              stepper.next();
            }}
          />
        </div>
      </div>
    </div>
  );
}
