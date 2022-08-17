import { FC } from "react";

interface AlertProps {
  type?: "default" | "error" | "success" | "warning";
  children: React.ReactNode;
}

const getColor = (type: AlertProps["type"]) => {
  const colors = {
    default: "bg-highlight/20 border border-highlight/75",
    error: "bg-alert/20 border border-alert/75",
    success: "bg-success/20 border border-success/75",
    warning: "bg-warning/20 border border-warning/75",
  };

  return colors[type || "default"];
};

const Alert: FC<AlertProps> = ({ type = "default", children }) => {
  const styles = getColor(type);

  return (
    <div
      className={`p-3 rounded-md flex items-center gap-2 ${styles}`}
      data-cy="alert"
      role="alert"
    >
      {children}
    </div>
  );
};

export default Alert;
