import { ReactElement, useCallback, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { helper } from '../../core/webHelper';
import { StepperContext } from '../../pages/onboarding';

import { Select } from '../select/select';
import { ToastMessage } from '../toast/toast-message';

import { NavigationButtons } from './navigation-buttons';

const genderList = [
  { name: 'Male', value: 'Male' },
  { name: 'Female', value: 'Female' },
  { name: 'Non-binary', value: 'Non-binary' },
];

const ageList = [
  { name: '< 20', value: '-20' },
  { name: '20-30', value: '20-30' },
  { name: '30-40', value: '30-40' },
  { name: '40-50', value: '40-50' },
  { name: '50+', value: '50+' },
];

const incomeList = [
  { name: '< $12K', value: '-12K' },
  { name: '$12K - $25K', value: '12-25K' },
  { name: '$25K - $50K', value: '25-50K' },
  { name: '$50K - $75K', value: '50-75K' },
  { name: '$75K - $150K', value: '75-150K' },
  { name: '$150K+', value: '150K+' },
];

export function OnboardingProfile(): ReactElement {
  const stepper = useContext(StepperContext);
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [income, setIncome] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = useCallback(() => {
    setLoading(true);
    helper
      .saveProfileInOnBoarding(gender, age, income)
      .then(() => {
        setLoading(false);
        stepper.next();
      })
      .catch((err?: { message: string }) => {
        setLoading(false);
        toast(
          <ToastMessage
            type={'error'}
            content={<>{err?.message || 'Something went wrong!'}</>}
          />,
        );
      });
  }, [age, gender, income, stepper]);

  return (
    <div className={'onboarding-block'}>
      <div className={'page-header'}>
        <h6>Your Profile</h6>
      </div>
      <div className={'round no-overflow bg-white card'}>
        <div>
          <div className={'onboarding-profile-text'}>
            <p>
              When Swash data is sold, the profits are redistributed back to
              you, the Swash members.
              <br />
              <br />
              Please fill in the following profile information as accurately as
              you can. This will make the Swash data quality even better and
              even more valuable, so you’ll receive more for your contribution.
            </p>
          </div>
          <div className={'flex center gap16'}>
            <Select
              items={genderList}
              label={'Gender'}
              value={gender}
              onChange={(e) => setGender(e.target.value as string)}
            />
            <Select
              items={ageList}
              label={'Age'}
              value={age}
              onChange={(e) => setAge(e.target.value as string)}
            />
            <Select
              items={incomeList}
              label={'Household Income'}
              value={income}
              onChange={(e) => setIncome(e.target.value as string)}
            />
          </div>
          <NavigationButtons
            onBack={stepper.back}
            onSubmit={onSubmit}
            loading={loading}
            disableNext={!gender || !age || !income}
          />
        </div>
      </div>
    </div>
  );
}
