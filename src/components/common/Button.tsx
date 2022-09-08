import { FC, ComponentPropsWithRef } from "react";
import Loader from "./Loader";
import clx from "@/lib/classnames";

interface ButtonProps extends ComponentPropsWithRef<"button"> {
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
}

const buttonSizes = {
  sm: "h-8 min-h-[32px] min-w-[60px] py-1 px-4",
  md: "h-10 min-h-[32px] min-w-[60px] py-1 px-4",
  lg: "h-12 min-h-[32px] min-w-[60px] py-1 px-4",
};

const getGhostButtonStyles = ({
  variant,
  size = "md",
  disabled = false,
}: ButtonProps) => {
  return clx(
    buttonSizes[size],
    "relative rounded-md flex justify-center items-center gap-2 text-sm font-medium transition-colors duration-200",
    variant === "primary" &&
      "text-highlight border border-highlight hover:text-white hover:bg-highlight active:bg-highlightActive",
    variant === "secondary" &&
      "border border-secondary hover:text-white hover:bg-secondary active:bg-secondaryActive",
    variant === "success" &&
      "border border-success hover:bg-success active:bg-successActive",
    variant === "danger" &&
      "text-alert border border-alert hover:text-white hover:bg-alert active:bg-alertActive",
    variant === "warning" &&
      "text-warning border border-warning hover:text-white hover:bg-warning active:bg-warningActive",
    disabled && "opacity-50 cursor-not-allowed",
  );
};

export const getButtonStyles = ({
  variant,
  size = "md",
  fullWidth,
  disabled = false,
  ghost,
  className,
}: ButtonProps) => {
  if (ghost) {
    return getGhostButtonStyles({ variant, size, disabled });
  }

  return clx(
    buttonSizes[size],
    "relative rounded-md flex justify-center items-center gap-2 text-sm font-medium transition-colors duration-200",
    variant === "primary" &&
      "bg-highlight text-white hover:bg-highlightHover active:bg-highlightActive focus-visible:bg-highlightHover",
    variant === "secondary" &&
      "bg-secondary text-white hover:bg-secondaryHover active:bg-secondaryActive focus-visible:bg-secondaryHover",
    variant === "success" &&
      "bg-success text-white hover:bg-successHover active:bg-successActive focus-visible:bg-successHover",
    variant === "danger" &&
      "bg-alert text-white hover:bg-alertHover active:bg-alertActive focus-visible:bg-alertHover",
    variant === "warning" &&
      "bg-warning text-white hover:bg-warningHover active:bg-warningActive focus-visible:bg-warningHover",
    fullWidth ? "w-full" : "w-auto",
    disabled && "opacity-50 cursor-not-allowed",
    className ? className : "",
  );
};

const Button: FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  children,
  icon,
  loading = false,
  fullWidth = false,
  disabled = false,
  ghost = false,
  className,
  ...props
}) => {
  const buttonStyles = getButtonStyles({
    variant,
    size,
    ghost,
    disabled,
    fullWidth,
    className,
  });

  return (
    <button disabled={disabled || loading} className={buttonStyles} {...props}>
      {loading ? (
        <>
          <Loader />
          <span className="invisible">{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="flex items-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
