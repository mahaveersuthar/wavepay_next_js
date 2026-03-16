"use client";
import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  className = "",
}) => {
  // Size-specific classes for the outer track and inner knob
  const sizeClasses = {
    sm: {
      track: "w-9 h-5",
      knob: "h-4 w-4",
      translate: "translate-x-4",
    },
    md: {
      track: "w-11 h-6",
      knob: "h-5 w-5",
      translate: "translate-x-5",
    },
  };

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {/* The Switch Control */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={`
          relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-900
          ${sizeClasses[size].track}
          ${checked ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out transform
            ${sizeClasses[size].knob}
            ${checked ? sizeClasses[size].translate : "translate-x-0"}
          `}
        />
      </button>

      {/* Label and Description */}
      {(label || description) && (
        <div className="flex flex-col cursor-pointer" onClick={handleToggle}>
          {label && (
            <span className="text-sm font-medium text-gray-800 dark:text-white">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Toggle;