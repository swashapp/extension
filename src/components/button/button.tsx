import {
  Button as MuiButton,
  ButtonProps,
  CircularProgress,
  styled,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ReactElement } from 'react';

import { Link, LinkProps } from '../link/link';

const StyledButton = styled(MuiButton)`
  border-radius: 8px;
`;

const useStyles = makeStyles(() => ({
  primary: {
    background: 'var(--color-black)',
    color: ' var(--color-white)',
    borderRadius: 100,
    '&:hover': {
      background: ' var(--color-white)',
      color: ' var(--color-black)',
      border: '1px solid var(--color-black)',
    },
  },
  secondary: {
    background: 'var(--color-dark-purple)',
    color: ' var(--color-white)',
    borderRadius: 100,
    '&:hover': {
      background: 'var(--color-dark-purple)',
      color: ' var(--color-white)',
      border: '1px solid var(--color-black)',
    },
  },
  disabled: {
    background: 'var(--color-lightest-grey)',
    color: ' var(--color-black)',
    borderRadius: 100,
  },
}));

function getButton(
  color: string,
  size: string,
  fixed: boolean,
  text: string | ReactElement,
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
  color?: 'primary' | 'secondary';
  size?: 'small' | 'large';
  fixed?: boolean;
  text: string | ReactElement;
  link: LinkProps | false;
  onClick?: () => void;
  muiProps?: ButtonProps;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
}): ReactElement {
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
    classes[disabled ? 'disabled' : color],
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
