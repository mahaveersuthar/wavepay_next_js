import React, { FC } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;

  value?: string | number;
  defaultValue?: string | number;

  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  endIcon?: React.ReactNode;
  maxLength?:number;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  defaultValue,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  required = false,
  success = false,
  error = false,
  hint,
  endIcon,
  maxLength
}) => {
  let inputClasses =
    `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs 
     placeholder:text-gray-400 focus:outline-hidden focus:ring-3 ${className}`;

  if (endIcon) inputClasses += " pr-12";

  if (disabled) {
    inputClasses +=
      " text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  } else if (error) {
    inputClasses +=
      " text-error-800 border-error-500 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500";
  } else if (success) {
    inputClasses +=
      " text-success-500 border-success-400 focus:ring-success-500/10 dark:text-success-400 dark:border-success-500";
  } else {
    inputClasses +=
      " bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";
  }

  return (
    <div>
      {/* INPUT + ICON (fixed height) */}
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
          className={inputClasses}
          maxLength={maxLength}
        />

        {endIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/3">
            {endIcon}
          </div>
        )}
      </div>

      {/* HINT (outside so it never affects icon position) */}
      <p
        className={`mt-1.5 min-h-[16px] text-xs ${
          error
            ? "text-error-500"
            : success
            ? "text-success-500"
            : "text-gray-500"
        }`}
      >
        {hint ?? ""}
      </p>
    </div>
  );
};

export default Input;
