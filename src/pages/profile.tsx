import React, { useCallback, useEffect } from 'react';

import { toast } from 'react-toastify';

import { Button } from '../components/button/button';
import { BackgroundTheme } from '../components/drawing/background-theme';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { ForwardEndAdornment } from '../components/input/end-adornments/forward-end-adornment';
import { Input } from '../components/input/input';
import { showPopup } from '../components/popup/popup';
import { Select } from '../components/select/select';
import { ToastMessage } from '../components/toast/toast-message';
import { VerificationPopup } from '../components/verification-popup/verification-popup';
import { helper } from '../core/webHelper';

const birthYearList: { name: string; value: string }[] = [];

for (let i = new Date().getFullYear(); i >= 1900; i--) {
  birthYearList.push({ name: `${i}`, value: `${i}` });
}

const maritalStatus = [
  { name: 'Single', value: 'Single' },
  { name: 'Married', value: 'Married' },
  { name: 'Separated', value: 'Separated' },
  { name: 'Divorced', value: 'Divorced' },
  { name: 'Widowed', value: 'Widowed' },
];

const householdSize = [
  { name: '1', value: '1' },
  { name: '2', value: '2' },
  { name: '3', value: '3' },
  { name: '4', value: '4' },
  { name: '5', value: '5' },
  { name: '6 or more', value: '6+' },
];

const employmentStatus = [
  { name: 'Full-time', value: 'Full-time' },
  { name: 'Part-time', value: 'Part-time' },
  { name: 'Freelancer', value: 'Freelancer' },
  { name: 'Unemployed', value: 'Unemployed' },
  { name: 'Student', value: 'Student' },
  { name: 'Retired', value: 'Retired' },
];

const occupationalIndustry = [
  { name: 'Advertising and Marketing', value: 'Advertising and Marketing' },
  { name: 'Aerospace', value: 'Aerospace' },
  { name: 'Agriculture', value: 'Agriculture' },
  { name: 'Computer and Technology', value: 'Computer and Technology' },
  { name: 'Construction', value: 'Construction' },
  { name: 'Education', value: 'Education' },
  { name: 'Energy', value: 'Energy' },
  { name: 'Entertainment', value: 'Entertainment' },
  { name: 'Fashion', value: 'Fashion' },
  { name: 'Finance and Economic', value: 'Finance and Economic' },
  { name: 'Food and Beverage', value: 'Food and Beverage' },
  { name: 'Healthcare', value: 'Healthcare' },
  { name: 'Hospitality', value: 'Hospitality' },
  { name: 'Manufacturing', value: 'Manufacturing' },
  { name: 'Media and News', value: 'Media and News' },
  { name: 'Mining', value: 'Mining' },
  { name: 'Pharmaceutical', value: 'Pharmaceutical' },
  { name: 'Telecommunication', value: 'Telecommunication' },
];

export function Profile(): JSX.Element {
  const [loading, setLoading] = React.useState(false);

  const [email, setEmail] = React.useState(undefined);
  const [phone, setPhone] = React.useState(undefined);

  const [year, setYear] = React.useState('');
  const [marital, setMarital] = React.useState('');
  const [household, setHousehold] = React.useState('');
  const [employment, setEmployment] = React.useState('');
  const [industry, setIndustry] = React.useState('');

  useEffect(() => {
    helper.getUserProfile().then((profile) => {
      setEmail(profile.email);
      setPhone(profile.phone);

      setYear(profile.birthYear || '');
      setMarital(profile.maritalStatus || '');
      setHousehold(profile.householdSize || '');
      setEmployment(profile.employmentStatus || '');
      setIndustry(profile.occupationIndustry || '');
    });
  }, []);

  const onSubmit = useCallback(() => {
    setLoading(true);
    helper
      .setUserProfile({
        birthYear: year,
        maritalStatus: marital,
        householdSize: household,
        employmentStatus: employment,
        occupationIndustry: industry,
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
          toast(
            <ToastMessage
              type="success"
              content={<>{'Saved profile successfully'}</>}
            />,
          );
        }, 500);
      });
  }, [employment, household, industry, marital, year]);

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
                <Select
                  items={birthYearList}
                  label="Birth year"
                  value={year}
                  onChange={(e) => setYear(e.target.value as string)}
                />
                <Select
                  items={maritalStatus}
                  label="Marital status"
                  value={marital}
                  onChange={(e) => setMarital(e.target.value as string)}
                />
              </FlexGrid>
              <FlexGrid className="half-form-items form-item-gap" column={2}>
                <Select
                  items={householdSize}
                  label="Household size"
                  value={household}
                  onChange={(e) => setHousehold(e.target.value as string)}
                />
                <Select
                  items={employmentStatus}
                  label="Employment status"
                  value={employment}
                  onChange={(e) => setEmployment(e.target.value as string)}
                />
              </FlexGrid>
              <Select
                items={occupationalIndustry}
                label="Occupational industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value as string)}
              />
            </div>
            <Button
              className="form-button"
              color="primary"
              text="Submit"
              link={false}
              onClick={onSubmit}
              loading={loading}
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
                value={email ? email : 'Not provided'}
                disabled={true}
                endAdornment={
                  <ForwardEndAdornment
                    onClick={() => {
                      showPopup({
                        id: 'verify-email',
                        closable: false,
                        closeOnBackDropClick: true,
                        paperClassName: 'large-popup',
                        content: <VerificationPopup title={'email'} />,
                      });
                    }}
                  />
                }
              />
              <Input
                label="Phone number"
                value={phone ? phone : 'Not provided'}
                disabled={true}
                endAdornment={
                  <ForwardEndAdornment
                    onClick={() => {
                      showPopup({
                        id: 'verify-phone',
                        closable: false,
                        closeOnBackDropClick: true,
                        paperClassName: 'large-popup',
                        content: <VerificationPopup title={'mobile'} />,
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
