import {
  Button as MuiButton,
  ButtonProps,
  CircularProgress,
  styled,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

import { Link, LinkProps } from '../link/link';

const StyledButton = styled(MuiButton)`
  border-radius: 8px;
`;

const useStyles = makeStyles(() => ({
  primary: {
    background: 'var(--blue)',
    color: 'var(--white)',
    '&:hover': { background: 'var(--black)', color: 'var(--white)' },
  },
  secondary: {
    background: 'var(--lightest-blue)',
    color: 'var(--black)',
    '&:hover': { background: 'var(--black)', color: 'var(--white)' },
  },
  white: {
    background: 'white',
    color: 'var(--black)',
    '&:hover': { background: 'var(--black)', color: 'var(--white)' },
  },
  gray: {
    background: 'var(--gray)',
    color: 'var(--black)',
    '&:hover': { background: 'var(--gray)', color: 'var(--black)' },
  },
}));

function getButton(
  color: string,
  size: string,
  fixed: boolean,
  text: string | JSX.Element,
  disabled: boolean,
  muiProps?: ButtonProps,
  loading?: boolean,
  onClick?: () => void,
  className?: string,
) {
  return (
    <StyledButton
      {...muiProps}
      className={`${color} ${'button-' + size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div
        className={`button-text ${'button-' + size + '-text'} ${
          fixed ? 'button-fixed' : ''
        }`}
      >
        {text ? <>{text}</> : <></>}
        {loading && <CircularProgress color={'inherit'} size={16} />}
      </div>
    </StyledButton>
  );
}

export function Button(props: {
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
  size?: 'small' | 'large';
  fixed?: boolean;
  text: string | JSX.Element;
  link: LinkProps | false;
  onClick?: () => void;
  muiProps?: ButtonProps;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
}): JSX.Element {
  const classes = useStyles();
  const {
    color = 'primary',
    size = 'large',
    text,
    fixed = false,
    onClick = () => undefined,
    disabled = false,
  } = props;
  const button = getButton(
    classes[disabled ? 'gray' : color],
    size,
    fixed,
    props.loading ? props.loadingText || '' : text,
    disabled,
    props?.muiProps,
    props?.loading,
    disabled || props.loading ? () => undefined : onClick,
    props?.className,
  );

  if (props.link === false) return button;
  else return <Link {...props.link}>{button}</Link>;
}
