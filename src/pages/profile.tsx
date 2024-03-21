import { Badge } from '@mui/material';
import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { toast } from 'react-toastify';

import { Button } from '../components/button/button';
import { ClickableInput } from '../components/clickable-input/clickable-input';
import { showPopup } from '../components/popup/popup';
import { PunchedBox } from '../components/punched-box/punched-box';
import { Select } from '../components/select/select';
import { ToastMessage } from '../components/toast/toast-message';
import { VerificationBadge } from '../components/verification/verification-badge';
import { VerificationPopup } from '../components/verification/verification-popup';
import { helper } from '../core/webHelper';

import { VerificationBannerItems } from '../data/verification-banner-items';

import { AppContext } from './app';

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

export function Profile(): ReactElement {
  const app = useContext(AppContext);
  const [reward, setReward] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [email, setEmail] = useState(undefined);
  const [phone, setPhone] = useState(undefined);

  const [birth, setBirth] = useState('');
  const [marital, setMarital] = useState('');
  const [household, setHousehold] = useState('');
  const [employment, setEmployment] = useState('');
  const [industry, setIndustry] = useState('');

  const fetchProfile = useCallback(
    (forceUpdate?: boolean) => {
      setEmailLoading(true);
      helper.getUserProfile().then((profile) => {
        if (!profile.email) {
          setTimeout(fetchProfile, 3000, true);
        } else {
          setEmailLoading(false);
          setEmail(profile.email || '');
          setPhone(profile.phone || '');

          setBirth(profile.birth || '');
          setMarital(profile.marital || '');
          setHousehold(profile.household || '');
          setEmployment(profile.employment || '');
          setIndustry(profile.industry || '');

          if (profile.industry) setSubmitted(true);
          if (forceUpdate) app.forceUpdate();
        }
      });
    },
    [app],
  );

  const updateData = useCallback(() => {
    setEmailLoading(true);
    helper.updateVerification().then(() => {
      fetchProfile(true);
    });
  }, [fetchProfile]);

  const loadActiveProfile = useCallback(() => {
    helper.getLatestPrograms().then((data: { profile: { reward: string } }) => {
      if (data.profile.reward) setReward(data.profile.reward);
    });
  }, []);

  useEffect(() => {
    fetchProfile();
    loadActiveProfile();
  }, [fetchProfile, loadActiveProfile]);

  const onSubmit = useCallback(() => {
    setLoading(true);
    helper
      .updateUserProfile({
        birth,
        marital,
        household,
        employment,
        industry,
      })
      .then(() => {
        setLoading(false);
        setSubmitted(true);
        toast(
          <ToastMessage
            type={'success'}
            content={<>{'Saved profile successfully'}</>}
          />,
        );
      })
      .catch((err) => {
        setLoading(false);
        toast(<ToastMessage type={'error'} content={<>{err}</>} />);
      });
  }, [employment, household, industry, marital, birth]);

  return (
    <>
      <div className={'flex align-center page-header'}>
        <h6>Profile</h6>
        <VerificationBadge
          verified={phone === undefined ? phone : phone !== ''}
        />
      </div>
      <div className={'flex gap32'}>
        <div className={`round flex col no-overflow bg-white card grow1 card`}>
          <div>
            <h6>Complete your profile</h6>
            <p>
              Tell Swash you’re human by verifying your profile. Only members
              who verify can withdraw their earnings.
            </p>
          </div>
          <div className={'flex col gap16'}>
            <div className={'flex row gap16'}>
              <Select
                items={birthYearList}
                label={'Birth year'}
                value={birth}
                onChange={(e) => setBirth(e.target.value as string)}
              />
              <Select
                items={maritalStatus}
                label={'Marital status'}
                value={marital}
                onChange={(e) => setMarital(e.target.value as string)}
              />
            </div>
            <div className={'flex row gap16'}>
              <Select
                items={householdSize}
                label={'Household size'}
                value={household}
                onChange={(e) => setHousehold(e.target.value as string)}
              />
              <Select
                items={employmentStatus}
                label={'Employment status'}
                value={employment}
                onChange={(e) => setEmployment(e.target.value as string)}
              />
            </div>
            <Select
              items={occupationalIndustry}
              label={'Occupational industry'}
              value={industry}
              onChange={(e) => setIndustry(e.target.value as string)}
            />
          </div>
          <div className={'form-button-right'}>
            {submitted ? (
              <Button
                className={'form-button'}
                color={'primary'}
                text={'Update'}
                link={false}
                onClick={onSubmit}
                loading={loading}
                disabled={
                  !birth || !marital || !household || !employment || !industry
                }
              />
            ) : reward === '' || reward === '0' ? (
              <Button
                className={'form-button'}
                color={'primary'}
                text={'Submit'}
                link={false}
                onClick={onSubmit}
                loading={loading}
                disabled={
                  !birth || !marital || !household || !employment || !industry
                }
              />
            ) : (
              <Badge
                badgeContent={`+${reward} SWASH`}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                className="profile-submit-badge"
                sx={{
                  '& .MuiBadge-badge': {
                    padding: '5px 9px',
                    color: 'white',
                    backgroundColor: 'var(--color-green)',
                    fontWeight: 600,
                  },
                }}
              >
                <Button
                  className={'form-button'}
                  color={'primary'}
                  text={'Submit'}
                  link={false}
                  onClick={onSubmit}
                  loading={loading}
                  disabled={
                    !birth || !marital || !household || !employment || !industry
                  }
                />
              </Badge>
            )}
          </div>
        </div>
        <div className={'flex col grow1 gap32'}>
          {VerificationBannerItems.map(
            ({ text, image, className, verified }, index) => (
              <PunchedBox
                className={`card3 profile-verification-banner ${className} ${
                  phone === undefined
                    ? 'hide'
                    : verified === !!phone
                    ? ''
                    : 'hide'
                }`}
                key={`verification-banner-${index}`}
              >
                <div className={'flex row justify-between align-center'}>
                  <h5 className={'profile-verification-banner-text'}>{text}</h5>
                  <img
                    className={'profile-verification-banner-img'}
                    src={image}
                    alt={'verification-banner'}
                  />
                </div>
              </PunchedBox>
            ),
          )}
          <div className={'round no-overflow flex col gap24 bg-white card'}>
            <h6>Contact information</h6>
            <div className={'flex col gap16'}>
              <ClickableInput
                label={'Email address'}
                placeholder={
                  <>
                    <img
                      src={'/static/images/shape/error.svg'}
                      width={16}
                      height={16}
                      alt={'error'}
                    />
                    Unverified
                  </>
                }
                value={email ? email : undefined}
                loading={emailLoading}
                onClick={() => {
                  showPopup({
                    id: 'verify-email',
                    closable: false,
                    closeOnBackDropClick: true,
                    paperClassName: 'popup large',
                    content: (
                      <VerificationPopup
                        title={'email'}
                        callback={updateData}
                      />
                    ),
                  });
                }}
              />
              <ClickableInput
                label={'Phone number'}
                placeholder={
                  <>
                    <img
                      src={'/static/images/shape/error.svg'}
                      width={16}
                      height={16}
                      alt={'error'}
                    />
                    Unverified
                  </>
                }
                value={phone ? phone : undefined}
                loading={emailLoading}
                onClick={() => {
                  showPopup({
                    id: 'verify-phone',
                    closable: false,
                    closeOnBackDropClick: true,
                    paperClassName: 'popup large',
                    content: (
                      <VerificationPopup
                        title={'phone'}
                        callback={updateData}
                      />
                    ),
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
