import {
  Button as MuiButton,
  ButtonProps,
  CircularProgress,
  styled,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { ReactNode } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { Link, LinkProps } from "@/ui/components/link/link";

import styles from "./button.module.css";

const StyledButton = styled(MuiButton)`
  border-radius: 8px;
`;

const useStyles = makeStyles(() => ({
  primary: {
    background: "var(--color-black)",
    color: "var(--color-white)",
    border: "1px solid var(--color-black)",
    borderRadius: 100,
    textTransform: "none",
    "&:hover": {
      background: "var(--color-white)",
      color: "var(--color-black)",
      border: "1px solid var(--color-black)",
    },
    "&:hover img": { filter: "invert(100%) !important" },
  },
  secondary: {
    background: "var(--color-white)",
    color: "var(--color-black)",
    border: "1px solid var(--color-black)",
    borderRadius: 100,
    textTransform: "none",
    "&:hover": {
      background: "var(--color-black)",
      color: "var(--color-white)",
      border: "1px solid var(--color-black)",
    },
    "&:hover img": { filter: "invert(100%) !important" },
  },
  tertiary: {
    background: "transparent",
    color: "inherit",
    border: "2px solid var(--color-light-grey)",
    borderRadius: 16,
    textTransform: "none",
    "&:hover": {
      background: "var(--color-black)",
      color: "var(--color-white)",
      border: "2px solid var(--color-black)",
    },
    "&:hover img": { filter: "invert(100%) !important" },
  },
  transparent: {
    background: "transparent",
    color: "var(--color-darkest-grey)",
    textTransform: "none",
    "&:hover": {
      background: "transparent",
      color: "var(--color-black)",
    },
    "&:hover img": { filter: "invert(100%) !important" },
  },
  disabled: {
    background: "var(--color-lightest-grey)",
    color: "var(--color-black)",
    borderRadius: 100,
    textTransform: "none",
  },
}));

function getButton(
  text: string | ReactNode,
  className: string,
  color: string,
  loading: boolean,
  disabled: boolean,
  onClick?: () => void,
  muiProps?: ButtonProps,
) {
  return (
    <StyledButton
      {...muiProps}
      className={clsx(className, color)}
      onClick={loading ? () => {} : onClick}
      disabled={disabled}
    >
      <div className={clsx("flex align-center", styles.text)}>
        {text ? <p className={styles.text}>{text}</p> : null}
        {loading && <CircularProgress color={"inherit"} size={16} />}
      </div>
    </StyledButton>
  );
}

export function Button({
  text,
  className = "normal-button",
  color = ButtonColors.PRIMARY,
  loading = false,
  loadingText = "",
  disabled = false,
  link,
  onClick,
  muiProps,
}: {
  text: string | ReactNode;
  className?: string;
  color?: ButtonColors;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  link?: LinkProps;
  onClick?: () => void;
  muiProps?: ButtonProps;
}): ReactNode {
  const classes = useStyles();

  const button = getButton(
    loading ? loadingText : text,
    className,
    classes[disabled ? "disabled" : color],
    loading,
    disabled,
    disabled || loading ? undefined : onClick,
    muiProps,
  );

  if (link) return <Link {...link}>{button}</Link>;
  else return button;
}
