import { FC, ComponentPropsWithRef } from "react";
import Loader from "./Loader";

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

const classes = {
  base: "relative rounded-md flex justify-center items-center gap-2 text-sm font-medium transition-colors duration-200",
  size: {
    sm: "h-8 min-h-[32px] min-w-[60px] py-1 px-4",
    md: "h-10 min-h-[32px] min-w-[60px] py-1 px-4",
    lg: "h-12 min-h-[32px] min-w-[60px] py-1 px-4",
  },
};

const getAltButtonColors = (variant: ButtonProps["variant"]) => {
  const altColors = {
    default: "border",
    primary:
      "text-highlight border border-highlight hover:text-white hover:bg-highlight active:bg-highlightActive",
    secondary:
      "border border-secondary hover:text-white hover:bg-secondary active:bg-secondaryActive",
    success: "border border-success hover:bg-success active:bg-successActive",
    danger:
      "text-alert border border-alert hover:text-white hover:bg-alert active:bg-alertActive",
    warning:
      "text-warning border border-warning hover:text-white hover:bg-warning active:bg-warningActive",
  };

  return altColors[variant || "default"];
};

const getButtonColors = (
  variant: ButtonProps["variant"],
  ghost: boolean,
  disabled: boolean,
) => {
  const colors = {
    default: "",
    primary:
      "border border-transparent bg-highlight text-white hover:bg-highlightHover active:bg-highlightActive",
    secondary:
      "border border-transparent bg-secondary text-white hover:bg-secondaryHover active:bg-secondaryActive",
    success:
      "border border-transparent bg-success text-white hover:bg-successHover active:bg-successActive",
    danger: "bg-alert text-white hover:bg-alertHover active:bg-alertActive",
    warning:
      "border border-transparent bg-warning text-white hover:bg-warningHover active:bg-warningActive",
  };

  if (disabled) {
    return "border border-grayAlt opacity-30 cursor-not-allowed";
  }

  if (ghost) {
    return getAltButtonColors(variant);
  }

  return colors[variant || "default"];
};

const Button: FC<ButtonProps> = ({
  variant = "default",
  size = "sm",
  children,
  icon,
  loading,
  fullWidth,
  ghost = false,
  disabled = false,
  ...props
}) => {
  const buttonStyles = getButtonColors(variant, ghost, disabled);

  return (
    <button
      disabled={disabled || loading}
      className={`${buttonStyles} ${classes.base} ${classes.size[size]} ${
        fullWidth ? "w-full" : "w-auto"
      }`}
      {...props}
    >
      {icon && <span className="flex justify-center items-center">{icon}</span>}
      {loading ? (
        <div>
          <Loader />
          <span className="invisible">{children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
