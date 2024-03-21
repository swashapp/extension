import { ReactNode } from "react";
import { Link as RLink } from "react-router-dom";

export interface LinkProps {
  url: string;
  external?: boolean;
  newTab?: boolean;
  className?: string;
}

export function Link({
  url,
  newTab = false,
  external = false,
  className = "",
  children,
}: LinkProps & { children: ReactNode[] | ReactNode | string }): ReactNode {
  return external ? (
    <a
      href={url}
      className={className}
      target={newTab ? "_blank" : "_self"}
      rel={"noreferrer"}
    >
      {children}
    </a>
  ) : (
    <RLink
      to={url}
      className={className}
      target={newTab ? "_blank" : "_self"}
      rel={"noreferrer"}
    >
      {children}
    </RLink>
  );
}
