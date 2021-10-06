import React, { useState } from 'react';
import AcceptCheckBox from './accept-checkbox';
import NavigationButtons from './navigation-buttons';

export default function OnBoardingImportant(props: {
  onSubmit: () => void;
  onBack: () => void;
}) {
  const [accept, setAccept] = useState<boolean>(false);
  return (
    <>
      <div className="page-header on-boarding-header">
        <h2>Important!</h2>
      </div>
      <div className="simple-card">
        <p>
          Keep the private keys in a safe place.{' '}
          <b>
            You can share your wallet address but never share your private keys!
          </b>
          <br />
          <br />
          If you lose access and haven’t backed up your wallet,{' '}
          <b>you won’t be able to access your earnings.</b> Swash won’t be able
          to recover them for you. It’s your responsibility to be safe and
          secure.
        </p>
        <div className="flex-column">
          <AcceptCheckBox value={accept} setValue={setAccept} />
          <NavigationButtons
            onBack={props.onBack}
            onSubmit={accept ? props.onSubmit : () => {}}
            disableNext={!accept}
          />
        </div>
      </div>
    </>
  );
}
