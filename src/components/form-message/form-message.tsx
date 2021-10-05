import React from 'react';
import { PropsWithChildren } from 'react';
import warningIcon from 'url:../../static/images/shape/warning.png';
import errorIcon from 'url:../../static/images/shape/error.png';

const FormMessages = {
  warning: { icon: warningIcon, color: 'var(--warning)' },
  error: { icon: errorIcon, color: 'var(--error)' },
};

export default function FormMessage(
  props: PropsWithChildren<{ text: string; type: keyof typeof FormMessages }>,
) {
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
