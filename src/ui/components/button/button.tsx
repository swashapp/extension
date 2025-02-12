import {
  Button as MuiButton,
  ButtonProps,
  CircularProgress,
  styled,
} from "@mui/material";
import clsx from "clsx";
import { ReactNode } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { Link, LinkProps } from "@/ui/components/link/link";

import styles from "./button.module.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "transparent"
  | "disabled";

interface StyledButtonProps {
  variantStyle: ButtonVariant;
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "variantStyle",
})<StyledButtonProps>(({ variantStyle }) => {
  let variantStyles = {};

  switch (variantStyle) {
    case "primary":
      variantStyles = {
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
      };
      break;
    case "secondary":
      variantStyles = {
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
      };
      break;
    case "tertiary":
      variantStyles = {
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
      };
      break;
    case "transparent":
      variantStyles = {
        background: "transparent",
        color: "var(--color-darkest-grey)",
        textTransform: "none",
        "&:hover": {
          background: "transparent",
          color: "var(--color-black)",
        },
        "&:hover img": { filter: "invert(100%) !important" },
      };
      break;
    case "disabled":
      variantStyles = {
        background: "var(--color-lightest-grey)",
        color: "var(--color-black)",
        borderRadius: 100,
        textTransform: "none",
      };
      break;
  }

  return {
    borderRadius: 8,
    ...variantStyles,
  };
});

function getButton(
  text: string | ReactNode,
  extraClassName: string,
  variantStyle: ButtonVariant,
  loading: boolean,
  disabled: boolean,
  onClick?: () => void,
  muiProps?: ButtonProps,
): ReactNode {
  return (
    <StyledButton
      {...muiProps}
      variantStyle={variantStyle}
      className={clsx(extraClassName)}
      onClick={loading ? () => {} : onClick}
      disabled={disabled}
    >
      <div className={clsx("flex align-center", styles.text)}>
        {text ? <p className={styles.text}>{text}</p> : null}
        {loading && <CircularProgress color="inherit" size={16} />}
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
  color?: "primary" | "secondary" | "tertiary" | "transparent";
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  link?: LinkProps;
  onClick?: () => void;
  muiProps?: ButtonProps;
}): ReactNode {
  const variantStyle: ButtonVariant = disabled ? "disabled" : color;
  const button = getButton(
    loading ? loadingText : text,
    className,
    variantStyle,
    loading,
    disabled,
    disabled || loading ? undefined : onClick,
    muiProps,
  );

  return link ? <Link {...link}>{button}</Link> : button;
}
