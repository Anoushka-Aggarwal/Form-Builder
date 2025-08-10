export interface FormField {
    id: string;
    type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
    label: string;
    required: boolean;
    defaultValue?: string;
    options?: string[]; // For select and radio fields
    validations?: {
      minLength?: number;
      maxLength?: number;
      isEmail?: boolean;
      isPassword?: boolean;
    };
    derived?: {
      parentIds: string[];
      formula: string;
    };
  }
  