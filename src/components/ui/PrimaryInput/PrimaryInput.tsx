import React from "react";

type PrimaryInputProps = {
  label?: string;
  name?: string;
  errors?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const PrimaryInput: React.FC<PrimaryInputProps> = ({
  label,
  name,
  type = "text",
  errors = "",
  className = "",
  ...rest
}) => {
  return (
    <div className="w-full group">
      {label && (
        <label
          htmlFor={name}
          className={`block text-left text-sm font-medium mb-1 transition-colors duration-200 ${errors ? "text-red-500" : "text-foreground group-focus-within:text-blue-600"
            }`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          onWheel={(e) => {
            if (type === "number") {
              e.currentTarget.blur(); // 🔥 stops scroll increment
            }
          }}
          className={`
    block w-full px-4 py-2.5 border rounded-xl shadow-sm 
    bg-primary text-foreground placeholder:text-foreground/40 
    outline-none transition-all duration-200 ease-in-out
    hover:border-slate-400
    ${errors
              ? "border-red-500 focus:ring-2 focus:ring-red-100 animate-shake"
              : "border-border focus:ring-4 focus:ring-blue-50/50 focus:border-blue-500"
            }
    ${className}
  `}
          {...rest}
        />

      </div>

      {/* Animated Error Message */}
      <div className="h-5"> {/* Fixed height prevents layout shift when error appears */}
        {errors && (
          <p className="text-red-600 text-left text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
            {errors}
          </p>
        )}
      </div>
    </div>
  );
};

export default PrimaryInput;