import React, { useEffect, useState } from 'react';

import { UtilsService } from '../../service/utils-service';
import { Button } from '../button/button';
import { Input } from '../input/input';
import { closePopup } from '../popup/popup';

export function VerificationPopup(props: {
  title: 'Mobile' | 'Email';
}): JSX.Element {
  const [page, setPage] = useState<'input' | 'verify'>('input');
  const [minutes, setMinutes] = useState<number>(2);
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [minutes, seconds]);

  if (page === 'verify') {
    return (
      <div className="verification-popup-container">
        <div className="flex-column verification-popup-content">
          <h2>Check your {props.title.toLowerCase()}!</h2>
          <div className="text">
            <p>
              We have sent you a verification code, please verify your{' '}
              {props.title === 'Mobile' ? 'mobile number' : 'email address'} to
              continue.
            </p>
          </div>
          <div className="input">
            <Input label="Verification Code" />
          </div>
          <div className="question">
            <p>
              Doesn&apos;t work?{' '}
              {seconds === 0 && minutes === 0 ? (
                <a style={{ color: 'var(--blue)' }} href="#">
                  Send me another code.
                </a>
              ) : (
                <div style={{ color: 'var(--green)', display: 'inline-block' }}>
                  {UtilsService.padWithZero(minutes) +
                    ':' +
                    UtilsService.padWithZero(seconds)}
                </div>
              )}
            </p>
          </div>
        </div>
        <hr className="nav" />
        <div className="flex-row verification-popup-buttons">
          <Button
            className="form-button"
            link={false}
            color="secondary"
            text="Back"
            onClick={() => setPage('input')}
          />
          <Button className="form-button" link={false} text={'Verify'} />
        </div>
      </div>
    );
  } else
    return (
      <div className="verification-popup-container">
        <div className="flex-column verification-popup-content">
          <h2>{props.title} verification</h2>
          <div className="text">
            <p>
              Please provide your{' '}
              {props.title === 'Mobile' ? 'mobile number' : 'email address'}
            </p>
          </div>
          <div className="input">
            <Input
              label={
                props.title === 'Mobile' ? 'Mobile number' : 'Email address'
              }
            />
          </div>
          <div className="question" />
        </div>
        <hr className="nav" />
        <div className="flex-row verification-popup-buttons">
          <Button
            className="form-button"
            link={false}
            color="secondary"
            text="Cancel"
            onClick={() => closePopup()}
          />
          <Button
            className="form-button"
            link={false}
            text={'Submit'}
            onClick={() => {
              setPage('verify');
            }}
          />
        </div>
      </div>
    );
}
