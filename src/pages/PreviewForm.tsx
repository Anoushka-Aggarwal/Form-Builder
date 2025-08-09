import { Box, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FormRenderer from "../components/FormRenderer";
import { FormField } from "../redux/formSlice";
import { evaluateDerivedField } from "../components/DerivedFieldLogic";

export default function PreviewForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const form = location.state?.form;
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const newValues = { ...values };
    form?.fields.forEach((field: FormField) => {
      if (field.derived) {
        const parentValues = field.derived.parentIds.reduce((acc, id) => {
          acc[id] = newValues[id] || "";
          return acc;
        }, {} as Record<string, any>);
        newValues[field.id] = evaluateDerivedField(field.derived.formula, parentValues);
      }
    });
    setValues(newValues);
  }, [values, form?.fields]);

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    form.fields.forEach((field: FormField) => {
      const val = values[field.id] || "";
      if (field.required && !val.trim()) {
        newErrors[field.id] = "This field is required.";
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      alert("Form submitted");
    }
  };

  if (!form) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Form not found. Go back.</Typography>
        <Button onClick={() => navigate("/myforms")}>Back</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>{form.name}</Typography>
      <FormRenderer fields={form.fields} values={values} onChange={handleChange} errors={errors} />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
}
