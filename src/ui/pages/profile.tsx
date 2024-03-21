import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { VerificationActionType, VerificationType } from '../../enums/api.enum';
import { ButtonColors } from '../../enums/button.enum';
import { SystemMessage } from '../../enums/message.enum';
import { helper } from '../../helper';
import { GetAvailableInfo } from '../../types/api/info.type';
import { MultiPageRef } from '../../types/ui.type';
import { Button } from '../components/button/button';
import { ClickableInput } from '../components/clickable-input/clickable-input';
import { PhoneInput } from '../components/input/phone-input';
import { Select } from '../components/input/select';
import { MultiPageView } from '../components/multi-page-view/multi-page-view';
import { PageHeader } from '../components/page-header/page-header';
import { closePopup, showPopup } from '../components/popup/popup';
import { PunchedBox } from '../components/punched-box/punched-box';
import { Recaptcha } from '../components/recaptcha/recaptcha';
import { toastMessage } from '../components/toast/toast-message';

import { VerifyCode } from '../components/verify-code/verify-code';
import { WaitForDone } from '../components/wait-for-done/wait-for-done';
import { DashboardContext } from '../context/dashboard.context';
import { VerificationBannerItems } from '../data/verification-banner-items';
import { useErrorHandler } from '../hooks/use-error-handler';

export function VerifyMobile() {
  const ref = useRef<MultiPageRef>();
  const { safeRun } = useErrorHandler();
  const { update } = useContext(DashboardContext);

  const [phone, setPhone] = useState<string>('');
  const [challenge, setChallenge] = useState<string>('');
  const [requestId, setRequestId] = useState<string>('');
  const [code, setCode] = useState<string>('');

  return (
    <MultiPageView ref={ref}>
      <PhoneInput
        onBack={() => {
          closePopup();
        }}
        onNext={(phone) => {
          setPhone(phone);
          ref.current?.next();
        }}
        nextButtonText={'Send code'}
      />
      <Recaptcha
        onBack={() => {
          setChallenge('');
          ref.current?.back();
        }}
        onTokenReceived={(token: string) => {
          setChallenge(token);
          ref.current?.next();
        }}
      />
      <WaitForDone
        onBack={() => {
          setChallenge('');
          setRequestId('');
          ref.current?.back();
        }}
        onLoad={() => {
          safeRun(async () => {
            const verify = await helper('user').verify(
              VerificationType.PHONE,
              VerificationActionType.INFO,
              phone,
              challenge,
            );
            setRequestId(verify.request_id);
            ref.current?.next();
          });
        }}
      />
      <VerifyCode
        text={phone}
        onBack={() => {
          setChallenge('');
          setRequestId('');
          setCode('');
          ref.current?.back(2);
        }}
        onNext={async (code) => {
          setCode(code);
          ref.current?.next();
        }}
        nextButtonText={'Set password'}
      />
      <WaitForDone
        onBack={() => {
          setChallenge('');
          setRequestId('');
          setCode('');
          ref.current?.back(3);
        }}
        onLoad={async () => {
          safeRun(
            async () => {
              await helper('user').updateVerifiedInfo(requestId, code);
              toastMessage(
                'success',
                SystemMessage.SUCCESSFULLY_UPDATED_PHONE_NUMBER,
              );
              update(true);
              closePopup();
            },
            {
              failure: async () => {
                toastMessage(
                  'error',
                  SystemMessage.FAILED_UPDATED_PHONE_NUMBER,
                );
              },
            },
          );
        }}
      />
    </MultiPageView>
  );
}

export function Profile(): ReactNode {
  const { safeRun } = useErrorHandler();
  const { account } = useContext(DashboardContext);

  const [data, setData] = useState<GetAvailableInfo>({
    birth: { min: 0, max: 0 },
    gender: [],
    marital: [],
    household: [],
    employment: [],
    industry: [],
    income: [],
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [birth, setBirth] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [marital, setMarital] = useState<string>('');
  const [household, setHousehold] = useState<string>('');
  const [employment, setEmployment] = useState<string>('');
  const [income, setIncome] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');

  const updateAdditionalInfo = useCallback(async () => {
    await safeRun(
      async () => {
        setLoading(true);
        await helper('user').updateAdditionalInfo(
          +birth,
          gender,
          marital,
          household,
          employment,
          income,
          industry,
        );
        toastMessage('success', SystemMessage.SUCCESSFULLY_UPDATED_PROFILE);
      },
      {
        finally: () => {
          setLoading(false);
        },
      },
    );
  }, [
    safeRun,
    birth,
    gender,
    marital,
    household,
    employment,
    income,
    industry,
  ]);

  useEffect(() => {
    safeRun(async () => {
      const data = await helper('user').getAvailableAdditionalInfo();
      setData(data);
    }).then();
  }, [data.gender.length, safeRun]);

  useEffect(() => {
    safeRun(async () => {
      const {
        birth,
        gender,
        marital,
        household,
        employment,
        income,
        industry,
      } = await helper('user').getAdditionalInfo();
      setBirth(birth);
      setGender(gender);
      setMarital(marital);
      setHousehold(household);
      setEmployment(employment);
      setIncome(income);
      setIndustry(industry);
    }).then();
  }, [safeRun]);

  return (
    <>
      <PageHeader header={'Profile'} />
      <div className={'flex gap32'}>
        <div className={`round flex col col-17 gap32 bg-white card28`}>
          <div className={'flex col gap16'}>
            <h6>Complete your profile</h6>
            <p>
              Tell Swash you’re human by verifying your profile. Only members
              who verify can withdraw their earnings.
            </p>
          </div>
          <div className={'flex col gap32'}>
            <div className={'flex row gap32'}>
              <Select
                label={'Birth year'}
                value={birth}
                items={Array.from(
                  { length: data.birth.max - data.birth.min + 1 },
                  (_, i) => ({
                    value: `${data.birth.min + i}`,
                    display: `${data.birth.min + i}`,
                  }),
                )}
                onChange={(e) => setBirth(e.target.value as string)}
              />
              <Select
                label={'Gender'}
                value={gender}
                items={data.gender}
                onChange={(e) => setGender(e.target.value as string)}
              />
            </div>
            <div className={'flex row gap32'}>
              <Select
                label={'Marital status'}
                value={marital}
                items={data.marital}
                onChange={(e) => setMarital(e.target.value as string)}
              />
              <Select
                label={'Household size'}
                value={household}
                items={data.household}
                onChange={(e) => setHousehold(e.target.value as string)}
              />
            </div>
            <div className={'flex row gap32'}>
              <Select
                label={'Employment status'}
                value={employment}
                items={data.employment}
                onChange={(e) => setEmployment(e.target.value as string)}
              />
              <Select
                label={'Income'}
                value={income}
                items={data.income}
                onChange={(e) => setIncome(e.target.value as string)}
              />
            </div>
            <Select
              label={'Occupational industry'}
              value={industry}
              items={data.industry}
              onChange={(e) => setIndustry(e.target.value as string)}
            />
          </div>
          <div className={'flex justify-end'}>
            <Button
              text={'Update'}
              color={ButtonColors.PRIMARY}
              loading={loading}
              disabled={
                !birth ||
                !gender ||
                !marital ||
                !household ||
                !employment ||
                !income ||
                !industry
              }
              onClick={updateAdditionalInfo}
            />
          </div>
        </div>
        <div className={'flex col col-10 gap32'}>
          {VerificationBannerItems.map(
            ({ text, image, className, verified }, index) => (
              <PunchedBox
                className={`card38 profile-verification-banner ${className} ${
                  verified === !account.is_verified ? '' : 'hide'
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
          <div className={'round no-overflow flex col gap24 bg-white card28'}>
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
                value={account.email}
                onClick={() => {}}
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
                value={account.phone}
                onClick={() => {
                  showPopup({
                    closable: false,
                    closeOnBackDropClick: true,
                    paperClassName: 'popup custom',
                    content: <VerifyMobile />,
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
