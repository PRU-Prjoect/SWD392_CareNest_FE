import React from "react";
import classNames from "classnames";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const spinnerClasses = classNames(
    "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
    sizeClasses[size],
    className
  );

  return <div className={spinnerClasses} />;
};
