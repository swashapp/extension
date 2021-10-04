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
}));

function getButton(
  color: string,
  size: string,
  fixed: boolean,
  text: string | JSX.Element,
  muiProps?: ButtonProps,
  loading?: boolean,
) {
  return (
    <StyledButton {...muiProps} className={`${color} ${'button-' + size}`}>
      <div
        className={`${'button-text'} ${'button-' + size + '-text'} ${
          fixed ? 'button-fixed' : ''
        }`}
      >
        {loading && <CircularProgress color={'inherit'} size={28} />}
        {!loading && text}
      </div>
    </StyledButton>
  );
}

export default function Button(props: {
  color?: 'primary' | 'secondary' | 'white';
  size?: 'small' | 'large';
  fixed?: boolean;
  text: string | JSX.Element;
  link: LinkProps | false;
  muiProps?: ButtonProps;
  loading?: boolean;
}) {
  const classes = useStyles();
  const { color = 'primary', size = 'large', text, fixed = false } = props;

  const button = getButton(
    classes[color],
    size,
    fixed,
    text,
    props?.muiProps,
    props?.loading,
  );

  if (props.link === false) return button;
  else return <Link {...props.link}>{button}</Link>;
}
