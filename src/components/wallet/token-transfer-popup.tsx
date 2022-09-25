import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { UtilsService } from '../../service/utils-service';
import { Button } from '../button/button';
import { showPopup, closePopup } from '../popup/popup';
import { ToastMessage } from '../toast/toast-message';

import { TokenTransferCompleted } from './token-transfer-completed';

const RightArrow = '/static/images/shape/right-arrow.svg';

function TokenTransferField(props: {
  ellipsis?: boolean;
  value: string | number;
  label: string;
}) {
  const value = useMemo(() => {
    let ret = props.value.toString();
    if (props.ellipsis) {
      ret = UtilsService.purgeString(value, 6);
    }
    return ret;
  }, [props.ellipsis, props.value]);
  return (
    <div className="flex-column wallet-token-transfer-field">
      <div className="wallet-token-transfer-field-label">{props.label}</div>
      <h1>{value}</h1>
    </div>
  );
}
export function TokenTransferPopup(props: {
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
      .then((result: { tx: string; reason: string }) => {
        setLoading(false);
        if (result.tx) {
          props.onSuccess().then();
          toast(
            <ToastMessage
              type="success"
              content={<>Approved successfully.</>}
            />,
          );
          showPopup({
            closable: false,
            closeOnBackDropClick: true,
            paperClassName: 'large-popup',
            content: (
              <TokenTransferCompleted
                transactionId={result.tx}
                sendToMainnet={props.sendToMainnet}
              />
            ),
          });
        } else {
          toast(
            <ToastMessage
              type="error"
              content={<>{result.reason || 'Something went wrong!'}</>}
            />,
          );
        }
      })
      .catch((err?: { message: string }) => {
        setLoading(false);
        toast(
          <ToastMessage
            type="error"
            content={<>{err?.message || 'Something went wrong!'}</>}
          />,
        );
      });
  }, [props]);

  return (
    <div className="wallet-token-transfer-container">
      <h6>Confirm SWASH Transfer</h6>
      <div className="flex-row wallet-token-transfer-content">
        <TokenTransferField label="Send" value={props.amount} />
        <img src={RightArrow} alt="-->" />
        <TokenTransferField
          label="To Address"
          value={props.recipient}
          ellipsis
        />
      </div>
      <div className="flex-row wallet-token-transfer-buttons">
        <Button
          className="form-button"
          link={false}
          color="secondary"
          text="Cancel"
          onClick={() => closePopup()}
        />
        <Button
          className="form-button confirm-and-send"
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
