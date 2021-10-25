import React, { useCallback, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { StepperContext } from '../../pages/onboarding';

import { FlexGrid } from '../flex-grid/flex-grid';
import { Select } from '../select/select';
import { ToastMessage } from '../toast/toast-message';

import { NavigationButtons } from './navigation-buttons';

const genderList = [
  { value: '' },
  { value: 'Male' },
  { value: 'Female' },
  { value: 'Non-binary' },
];

const ageList = [
  { value: '' },
  { value: '-20' },
  { value: '20-30' },
  { value: '30-40' },
  { value: '40-50' },
  { value: '50+' },
];

const incomeList = [
  { value: '' },
  { value: '-12K' },
  { value: '12-25K' },
  { value: '25-50K' },
  { value: '50-75K' },
  { value: '75-150K' },
  { value: '150K+' },
];
export function OnboardingProfile(): JSX.Element {
  const stepper = useContext(StepperContext);
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [income, setIncome] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = useCallback(() => {
    setLoading(true);
    window.helper
      .saveProfileInOnBoarding(gender, age, income)
      .then(() => {
        setLoading(false);
        stepper.next();
      })
      .catch(() => {
        setLoading(false);
        toast(
          <ToastMessage type="error" content={<>Something went wrong!</>} />,
        );
      });
  }, [age, gender, income, stepper]);

  return (
    <>
      <div className="page-header onboarding-header">
        <h2>Your Profile</h2>
      </div>
      <div className="simple-card">
        <div>
          <div className="onboarding-profile-text">
            <p>
              When Swash data is sold, 70% of profits are returned back to you,
              the Swash members.
              <br />
              <br />
              Please fill in the following profile information as accurately as
              you can. This will make the Swash data quality even better and
              even more valuable, so you’ll receive more for your contribution.
            </p>
          </div>
          <FlexGrid
            column={3}
            className="onboarding-profile-form-items form-item-gap"
          >
            <Select
              items={genderList}
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as string)}
            />
            <Select
              items={ageList}
              label="Age"
              value={age}
              onChange={(e) => setAge(e.target.value as string)}
            />
            <Select
              items={incomeList}
              label="Household Income"
              value={income}
              onChange={(e) => setIncome(e.target.value as string)}
            />
          </FlexGrid>
          <NavigationButtons
            onBack={stepper.back}
            onSubmit={onSubmit}
            loading={loading}
            disableNext={!gender || !age || !income}
          />
        </div>
      </div>
    </>
  );
}
