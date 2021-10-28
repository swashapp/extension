import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '../button/button';
import { showPopup, closePopup } from '../popup/popup';
import { ToastMessage } from '../toast/toast-message';

import { DataTransferCompleted } from './data-transfer-completed';

const RightArrow = '/static/images/shape/right-arrow.svg';

function DataTransferField(props: {
  ellipsis?: boolean;
  value: string | number;
  label: string;
}) {
  const value = useMemo(() => {
    let ret = props.value.toString();
    if (props.ellipsis) {
      const firstPart = ret.substring(0, 6);
      const lastPart = ret.substring(ret.length - 6, ret.length);
      ret = firstPart + '...' + lastPart;
    }
    return ret;
  }, [props.ellipsis, props.value]);
  return (
    <div className="flex-column wallet-data-transfer-field">
      <div className="wallet-data-transfer-field-label">{props.label}</div>
      <h1>{value}</h1>
    </div>
  );
}
export function DataTransferPopup(props: {
  amount: string | number;
  recipient: string;
  onSuccess: () => Promise<unknown>;
  useSponsor: boolean;
  sendToMainnet: boolean;
}): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);

  const withdraw = useCallback(() => {
    setLoading(true);
    window.helper
      .withdrawToTarget(
        props.recipient,
        props.amount,
        props.useSponsor,
        props.sendToMainnet,
      )
      .then((result) => {
        if (result.tx) {
          props.onSuccess().then();
          toast(
            <ToastMessage
              type="success"
              content={<>Successfully approved.</>}
            />,
          );
          showPopup({
            closable: false,
            closeOnBackDropClick: true,
            content: (
              <DataTransferCompleted
                transactionId={result.tx}
                sendToMainnet={props.sendToMainnet}
              />
            ),
          });
        } else {
          toast(
            <ToastMessage
              type="error"
              content={<>{result.reason} || Something went wrong!</>}
            />,
          );
        }
      })
      .finally(() => setLoading(false));
  }, [props]);

  return (
    <div className="wallet-data-transfer-container">
      <h6>Confirm DATA Transfer</h6>
      <div className="flex-row wallet-data-transfer-content">
        <DataTransferField label="Send" value={props.amount} />
        <img src={RightArrow} alt="-->" />
        <DataTransferField
          label="To Address"
          value={props.recipient}
          ellipsis
        />
      </div>
      <div className="flex-row wallet-data-transfer-buttons">
        <Button
          className="form-button data-transfer-button"
          link={false}
          color="secondary"
          text="Cancel"
          onClick={() => closePopup()}
        />
        <Button
          className="data-transfer-confirm-button data-transfer-button"
          link={false}
          text={'Confirm and Send'}
          loadingText={'Sending...'}
          loading={loading}
          onClick={withdraw}
        />
      </div>
    </div>
  );
}
