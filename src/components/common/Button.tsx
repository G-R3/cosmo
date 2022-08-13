import { FC, ComponentPropsWithRef } from "react";

interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: "primary" | "secondary" | "danger" | "warning" | "success";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  loading?: boolean;
}

const classes = {
  base: "relative rounded-md flex justify-center items-center gap-2 text-sm font-medium transition-colors duration-200",
  disabled: "opacity-50 cursor-not-allowed",
  size: {
    sm: "h-8 min-h-[32px] min-w-[60px] py-1 px-4 w-auto",
    md: "h-10 min-h-[32px] min-w-[60px] py-1 px-4 w-auto",
    lg: "h-12 min-h-[32px] min-w-[60px] py-1 px-4 w-auto",
  },
  variants: {
    primary:
      "bg-highlight text-white hover:bg-highlightHover active:bg-highlightActive",
    secondary:
      "bg-secondary text-white hover:bg-secondaryHover active:bg-secondaryActive",
    success:
      "bg-success text-white hover:bg-successHover active:bg-successActive",
    danger: "bg-alert text-white hover:bg-alertHover active:bg-alertActive",
    warning:
      "bg-warning text-white hover:bg-warningHover active:bg-warningActive",
  },
};

const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "sm",
  children,
  icon,
  loading,
  className,
  disabled,
  ...prop
}) => {
  return (
    <button
      className={`${classes.base} ${classes.size[size]} 
      ${classes.variants[variant]} 
      ${disabled && classes.disabled}`}
      disabled={disabled || loading}
      {...prop}
    >
      {icon && <span className="flex justify-center items-center">{icon}</span>}
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
