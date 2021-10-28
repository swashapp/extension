import React from 'react';
import { PropsWithChildren } from 'react';

const ErrorIcon = '/static/images/icons/error.png';
const SuccessIcon = '/static/images/icons/success.png';
const WarningIcon = '/static/images/icons/warning.png';

const FormMessages = {
  warning: { icon: WarningIcon, color: 'var(--warning)' },
  error: { icon: ErrorIcon, color: 'var(--error)' },
  success: { icon: SuccessIcon, color: 'var(--green)' },
};

export function FormMessage(
  props: PropsWithChildren<{ text: string; type: keyof typeof FormMessages }>,
): JSX.Element {
  return (
    <div
      className="form-message-container"
      style={props.text ? { visibility: 'visible' } : { visibility: 'hidden' }}
    >
      <img width={12} height={12} src={FormMessages[props.type].icon} alt="!" />
      <div
        className="form-message-text"
        style={{ color: FormMessages[props.type].color }}
      >
        {props.text}
      </div>
    </div>
  );
}
