import React from 'react';

import { Button } from '../components/button/button';
import { BackgroundTheme } from '../components/drawing/background-theme';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { ForwardEndAdornment } from '../components/input/end-adornments/forward-end-adornment';
import { Input } from '../components/input/input';
import { showPopup } from '../components/popup/popup';
import { Select } from '../components/select/select';
import { VerificationPopup } from '../components/verification-popup/verification-popup';

const networkList = [
  { name: 'Male', value: 'Male' },
  { name: 'Male', value: 'Male' },
  { name: 'Male', value: 'Male' },
];

export function Profile(): JSX.Element {
  return (
    <div className="page-container">
      <BackgroundTheme />
      <div className="page-content">
        <div className="page-header">
          <h2>Profile</h2>
        </div>
        <FlexGrid column={2} className="half-cards card-gap">
          <div className="simple-card">
            <h6>Provide the following information</h6>
            <div className="flex-column form-item-gap">
              <FlexGrid className="half-form-items form-item-gap" column={2}>
                <Select items={networkList} label="Birth year" value={''} />
                <Select items={networkList} label="Marital status" value={''} />
              </FlexGrid>
              <FlexGrid className="half-form-items form-item-gap" column={2}>
                <Select items={networkList} label="Household size" value={''} />
                <Select
                  items={networkList}
                  label="Employment status"
                  value={''}
                />
              </FlexGrid>
              <Select
                items={networkList}
                label="Household size"
                value={'test'}
              />
            </div>
            <Button
              className="form-button"
              color="primary"
              text="Withdraw"
              link={false}
            />
          </div>
          <div className="flex-column card-gap">
            <div className="verify-profile title">
              To withdraw your earnings and receive 100 SWASH bonus, please
              verify your profile.
            </div>
            <div className="simple-card">
              <h6>Contact information</h6>
              <Input
                label="Email Address"
                value={'text'}
                disabled={true}
                endAdornment={
                  <ForwardEndAdornment
                    onClick={() => {
                      showPopup({
                        closable: false,
                        paperClassName: 'large-popup',
                        content: <VerificationPopup title={'Email'} />,
                      });
                    }}
                  />
                }
              />
              <Input
                label="Phone number"
                value={'text'}
                disabled={true}
                endAdornment={
                  <ForwardEndAdornment
                    onClick={() => {
                      showPopup({
                        closable: false,
                        paperClassName: 'large-popup',
                        content: <VerificationPopup title={'Mobile'} />,
                      });
                    }}
                  />
                }
              />
            </div>
          </div>
        </FlexGrid>
      </div>
    </div>
  );
}
