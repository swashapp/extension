import React from 'react';
import {
  Button as MButton,
  ButtonProps,
  CircularProgress,
  makeStyles,
  withStyles,
} from '@material-ui/core';

import Link, { LinkProps } from '../link/link';

const StyledButton = withStyles(() => ({
  root: {
    borderRadius: 8,
  },
}))(MButton);

const useStyles = makeStyles(() => ({
  primary: {
    background: 'var(--blue)',
    color: 'var(--white)',
    '&:hover': { background: 'transparent', color: 'var(--black)' },
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
    >
      <div
        className={`button-text ${'button-' + size + '-text'} ${
          fixed ? 'button-fixed' : ''
        }`}
      >
        {text ? <>{text}</> : <></>}
        {loading && <CircularProgress color={'inherit'} size={24} />}
      </div>
    </StyledButton>
  );
}

export default function Button(props: {
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
}) {
  const classes = useStyles();
  const {
    color = 'primary',
    size = 'large',
    text,
    fixed = false,
    onClick = () => {},
    disabled = false,
  } = props;
  const button = getButton(
    classes[disabled ? 'gray' : color],
    size,
    fixed,
    props.loading ? props.loadingText || '' : text,
    props?.muiProps,
    props?.loading,
    disabled ? () => {} : onClick,
    props?.className,
  );

  if (props.link === false) return button;
  else return <Link {...props.link}>{button}</Link>;
}
