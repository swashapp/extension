import React, { PropsWithChildren } from 'react';
import { Link as RLink } from 'react-router-dom';

export interface LinkProps {
  url: string;
  external?: boolean;
  newTab?: boolean;
  className?: string;
}

export function Link(
  props: PropsWithChildren<
    LinkProps & { children: JSX.Element[] | JSX.Element | string }
  >,
): JSX.Element {
  const { url, newTab = false, className = '' } = props;

  return props.external ? (
    <a
      href={url}
      className={className}
      target={newTab ? '_blank' : '_self'}
      rel="noreferrer"
    >
      {props.children}
    </a>
  ) : (
    <RLink
      to={url}
      className={className}
      target={newTab ? '_blank' : '_self'}
      rel="noreferrer"
    >
      {props.children}
    </RLink>
  );
}
