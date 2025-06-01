import { type FC, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

const Label: FC<LabelProps> = ({ children, htmlFor, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={twMerge(
        clsx("block text-sm font-medium text-gray-700", className)
      )}
    >
      {children}
    </label>
  );
};

export default Label;
