import React from 'react';
import { PropsWithChildren } from 'react';

export interface LinkProps {
  url: string;
  position: string;
  event: string;
  external?: boolean;
  newTab?: boolean;
  className?: string;
}

export default function Link(props: PropsWithChildren<LinkProps>) {
  const { url, newTab = false, className = '' } = props;

  return (
    <a
      href={url}
      className={className}
      target={newTab ? '_blank' : '_self'}
      rel="noreferrer"
    >
      {props.children}
    </a>
  );
}
