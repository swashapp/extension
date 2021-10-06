import React, { useState } from 'react';
import FlexGrid from '../flex-grid/flex-grid';
import Select from '../select/select';
import NavigationButtons from './navigation-buttons';
const genderList = [
  { description: '', value: '' },
  { description: 'Male', value: 'Male' },
  { description: 'Female', value: 'Female' },
  { description: 'Non-binary', value: 'Non-binary' },
];

const ageList = [
  { description: '', value: '' },
  { description: '< 20', value: '-20' },
  { description: '20-30', value: '20-30' },
  { description: '30-40', value: '30-40' },
  { description: '40-50', value: '40-50' },
  { description: '50+', value: '50+' },
];

const incomeList = [
  { description: '', value: '' },
  { description: '< $12K', value: '-12K' },
  { description: '$12K - $25K', value: '12-25K' },
  { description: '$25K - $50K', value: '25-50K' },
  { description: '$50K - $75K', value: '50-75K' },
  { description: '$75K - $150K', value: '75-150K' },
  { description: '$150K+', value: '150K+' },
];
export default function OnBoardingProfile(props: {
  onSubmit: () => void;
  onBack: () => void;
}) {
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [income, setIncome] = useState<string>('');
  return (
    <>
      <div className="page-header on-boarding-header">
        <h2>Your Profile</h2>
      </div>
      <div className="simple-card">
        <div>
          <div className="on-boarding-profile-text">
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
            className="on-boarding-profile-form-items form-item-gap"
          >
            <Select
              items={genderList}
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
            <Select
              items={ageList}
              label="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <Select
              items={incomeList}
              label="Household Income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </FlexGrid>
          <NavigationButtons
            onBack={props.onBack}
            onSubmit={props.onSubmit}
            disableNext={!gender || !age || !income}
          />
        </div>
      </div>
    </>
  );
}
