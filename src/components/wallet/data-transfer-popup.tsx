import Button from '../button/button';
import React, { memo, useMemo, useState } from 'react';
import { showPopup, closePopup } from '../popup/popup';
import RightArrow from 'url:../../static/images/shape/right-arrow.svg';
import { toast } from 'react-toastify';
import ToastMessage from '../toast/toast-message';
import DataTransferCompleted from './data-transfer-completed';

function DataTransferField(props: {
  ellipsis?: boolean;
  value: string | number;
  label: string;
}) {
  const value = useMemo(() => {
    let ret = props.value.toString();
    if (props.ellipsis) {
      let firstPart = ret.substring(0, 6);
      let lastPart = ret.substring(ret.length - 6, ret.length);
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
export default memo(function DataTransferPopup(props: {
  amount: string | number;
  toAddress: string;
  onSend: () => Promise<any>;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <div className="wallet-data-transfer-container">
      <h6>Confirm DATA Transfer</h6>
      <div className="flex-row wallet-data-transfer-content">
        <DataTransferField label="Send" value={props.amount} />
        <img src={RightArrow} alt="-->" />
        <DataTransferField
          label="To Address"
          value={props.toAddress}
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
          onClick={() => {
            setLoading(true);
            props
              .onSend()
              .then((res) => {
                showPopup({
                  closable: false,
                  closeOnBackDropClick: true,
                  content: <DataTransferCompleted />,
                });
                toast(
                  <ToastMessage
                    type="success"
                    content={<>Successfully approved.</>}
                  />,
                );
              })
              .catch(() => {
                toast(
                  <ToastMessage
                    type="error"
                    content={<>Something went wrong!</>}
                  />,
                );
              })
              .finally(() => setLoading(false));
          }}
        />
      </div>
    </div>
  );
});
