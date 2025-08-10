import { FormField } from "../types/form";

export function validateForm(values: Record<string, string>, fields: FormField[]) {
  const newErrors: Record<string, string> = {};

  fields.forEach((field: FormField) => {
    const val = values[field.id] || "";

    if (field.required && !val.trim()) {
      newErrors[field.id] = "This field is required.";
    }

    if (field.label.toLowerCase().includes("name") && /\d/.test(val)) {
      newErrors[field.id] = "Name cannot contain numbers";
    }

    if (field.validations) {
      if (field.validations.minLength && val.length < field.validations.minLength) {
        newErrors[field.id] = `Minimum length: ${field.validations.minLength}`;
      }
      if (field.validations.maxLength && val.length > field.validations.maxLength) {
        newErrors[field.id] = `Maximum length: ${field.validations.maxLength}`;
      }
      if (field.validations.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        newErrors[field.id] = "Invalid email address.";
      }
      if (field.validations.isPassword && !/^(?=.*\d).{8,}$/.test(val)) {
        newErrors[field.id] = "Password must be 8+ chars and include a number.";
      }
    }
  });

  return newErrors;
}

