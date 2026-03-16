import React from "react";
import { ChevronDown } from "lucide-react";
import { ICommonList } from "@/interface/Common.interface";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  errors?: string;
  options?: ICommonList[];
  isLoading?: boolean;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  errors = "",
  options = [],
  isLoading = false,
  className = "",
  placeholder = "",
  ...rest
}) => {
  return (
    <div className="w-full group">
      {label && (
        <label
          htmlFor={name}
          className={`block text-left text-sm font-medium mb-1 transition-colors duration-200 ${errors
              ? "text-red-500"
              : "text-gray-700 dark:text-gray-200 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400"
            }`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={name}
          name={name}
          disabled={isLoading || rest.disabled}
          className={`
            appearance-none block w-full pl-4 pr-12 py-2.5 border rounded-xl shadow-sm
            bg-primary text-foreground dark:text-white cursor-pointer
            outline-none transition-all duration-200 ease-in-out
            truncate 
            hover:border-slate-400 dark:hover:border-gray-600
            disabled:opacity-50 disabled:cursor-not-allowed
            ${errors
              ? "border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-border dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            }
            ${className}
          `}
          {...rest}
        >
          <option value="" hidden className="dark:bg-gray-900">
            {isLoading ? "Loading..." : placeholder}
          </option>
          {!isLoading &&
            options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                // FIXED: Removed hardcoded bg-white/text-slate-900
                className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white py-2"
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground dark:text-white group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors">
          <ChevronDown className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>

      <div className="h-5">
        {errors && (
          <p className="text-red-600 text-left text-xs mt-1">
            {errors}
          </p>
        )}
      </div>
    </div>
  );
};

export default Select;