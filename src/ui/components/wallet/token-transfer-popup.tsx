import { ReactNode, useCallback, useMemo, useState } from 'react';

import { ButtonColors } from '../../../enums/button.enum';
import { SystemMessage } from '../../../enums/message.enum';
import { helper } from '../../../helper';
import { UtilsService } from '../../service/utils-service';
import { Button } from '../button/button';
import { showPopup, closePopup } from '../popup/popup';
import { toastMessage } from '../toast/toast-message';

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
      ret = UtilsService.purgeString(ret, 6);
    }
    return ret;
  }, [props.ellipsis, props.value]);
  return (
    <div className={'flex col wallet-token-transfer-field'}>
      <div className={'wallet-token-transfer-field-label'}>{props.label}</div>
      <h1>{value}</h1>
    </div>
  );
}
export function TokenTransferPopup(props: {
  amount: string | number;
  recipient: string;
  onSuccess: () => Promise<unknown>;
}): ReactNode {
  const [loading, setLoading] = useState<boolean>(false);

  const withdraw = useCallback(() => {
    setLoading(true);
    helper
      .withdrawToTarget(props.recipient, props.amount)
      .then((result: { tx: string; reason: string }) => {
        setLoading(false);
        if (result.tx) {
          props.onSuccess().then();
          toastMessage('success', SystemMessage.SUCCESSFULLY);
          showPopup({
            closable: false,
            closeOnBackDropClick: true,
            paperClassName: 'popup large',
            content: <TokenTransferCompleted transactionId={result.tx} />,
          });
        } else {
          toastMessage(
            'error',
            result.reason || SystemMessage.UNEXPECTED_THINGS_HAPPENED,
          );
        }
      })
      .catch((err?: { message: string }) => {
        setLoading(false);
        toastMessage(
          'error',
          err?.message || SystemMessage.UNEXPECTED_THINGS_HAPPENED,
        );
      });
  }, [props]);

  return (
    <div className={'wallet-token-transfer-container'}>
      <h6>Confirm SWASH Transfer</h6>
      <div className={'flex wallet-token-transfer-content'}>
        <TokenTransferField label={'Send'} value={props.amount} />
        <img src={RightArrow} alt={'-->'} />
        <TokenTransferField
          label={'To Address'}
          value={props.recipient}
          ellipsis
        />
      </div>
      <div className={'flex wallet-token-transfer-buttons'}>
        <Button
          text={'Cancel'}
          className={'form-button'}
          color={ButtonColors.SECONDARY}
          onClick={() => closePopup()}
        />
        <Button
          text={'Confirm and Send'}
          className={'form-button confirm-and-send'}
          loading={loading}
          loadingText={'Sending...'}
          onClick={withdraw}
        />
      </div>
    </div>
  );
}
