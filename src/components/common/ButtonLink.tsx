import { ComponentPropsWithRef, FC, forwardRef } from "react";
import Link, { LinkProps as NextLinkProps } from "next/link";
import { getButtonStyles } from "./Button";

type LinkProps = {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "success";

  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  ghost?: boolean;
  disabled?: boolean;
} & Omit<ComponentPropsWithRef<"a">, "href"> &
  NextLinkProps;

const ButtonLink: FC<LinkProps> = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      as,
      prefetch,
      replace,
      scroll,
      shallow,
      locale,
      passHref,
      children,
      variant,
      fullWidth = false,
      size = "md",
      disabled = false,
      ghost = false,
      className,
      ...props
    },
    forwardRef,
  ) => {
    const linkStyles = getButtonStyles({
      variant,
      size,
      fullWidth,
      disabled,
      ghost,
      className,
    });
    return (
      <Link
        href={href}
        as={as}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        locale={locale}
        passHref={passHref}
      >
        <a {...props} ref={forwardRef} className={linkStyles}>
          {children}
        </a>
      </Link>
    );
  },
);

ButtonLink.displayName = "ButtonLink";

export default ButtonLink;
