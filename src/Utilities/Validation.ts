// validation.ts

export const BaseValidation: Record<string, RegExp> = {
  alphaNumeric: /^[a-zA-Z0-9]*$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
  password: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
  atleastOneAlphaOneNumeric: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
  alphabatic: /^[A-Za-z]+$/,
  nameAlphabatic: /^[A-Za-z ]+$/,
  numeric: /^[0-9]+$/,
  price: /^\d+(\.\d{1,2})?$/,
  username: /^[A-Za-z0-9 ]{2,20}$/,
  gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  phone: /^[6-9]\d{9}$/,
  vehicleNumber: /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
  pinCode: /^[1-9][0-9]{5}$/,
} as const;

// A generic type for a validation rule that has a value and a message
type Rule<T> = {
  value: T;
  message: string;
};

// Defines the structure for a set of validation rules for a single field
type FieldValidationRules = {
  pattern?: Rule<RegExp>;
  maxLength?: Rule<number>;
  minLength?: Rule<number>;
  validate?: (value: string) => boolean | string;
};

// Defines the overall shape of the errorTypes object
type ErrorTypes = {
  required: (fieldName?: string) => { required: string };
  email: FieldValidationRules;
  phone: FieldValidationRules;
  password: FieldValidationRules;
  name: FieldValidationRules;
  gstNumber: FieldValidationRules;
  pinCode: FieldValidationRules;
  aadhaar: FieldValidationRules;
  pan: FieldValidationRules;
  url: FieldValidationRules;
  // Add other validation types here as needed
};

export const errorTypes: ErrorTypes = {
  required: (fieldName = "This field") => ({
    required: `${fieldName} is required`,
  }),

  email: {
    pattern: {
      value: BaseValidation.email,
      message: "Invalid email address",
    },
    validate: (value) =>
      value === value?.toLowerCase() || "Email must be in lowercase",
  },

  phone: {
    pattern: {
      value: BaseValidation.phone,
      message: "Please enter a valid 10-digit mobile number",
    },
    maxLength: {
      value: 10,
      message: "Mobile number cannot be more than 10 digits",
    },
    minLength: {
      value: 10,
      message: "Mobile number must be exactly 10 digits",
    },
  },

  password: {
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters long",
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
      message:
        "Password must include uppercase, lowercase, number, and special character",
    },
  },

  name: {
    pattern: {
      value: /^[a-zA-Z\s]*$/,
      message: "Name must contain only letters and spaces",
    },
    maxLength: {
      value: 160,
      message: "Name should not exceed 160 characters",
    },
  },

  gstNumber: {
    pattern: {
      value: BaseValidation?.gst,
      message:
        "Please enter a valid 15-digit GST number (e.g., 22ABCDE1234F1Z5)",
    },
    maxLength: {
      value: 15,
      message: "GST number must be 15 characters",
    },
    minLength: {
      value: 15,
      message: "GST number must be 15 characters",
    },
  },

  pinCode: {
    pattern: {
      value: BaseValidation.pinCode,
      message: "Please enter a valid 6-digit PIN code",
    },
    maxLength: {
      value: 6,
      message: "PIN code must be exactly 6 digits",
    },
    minLength: {
      value: 6,
      message: "PIN code must be exactly 6 digits",
    },
  },

  aadhaar: {
    pattern: {
      value: /^[2-9]{1}[0-9]{11}$/, // Aadhaar must start from 2-9 and be 12 digits
      message:
        "Invalid Aadhaar Number (must be 12 digits, not starting with 0/1)",
    },
  },

  url: {
    pattern: {
      value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
      message: "Invalid url",
    },
  },

  pan: {
    pattern: {
      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // PAN must follow AAAAA9999A format
      message: "Invalid PAN format (e.g., ABCDE1234F)",
    },
  },
};
