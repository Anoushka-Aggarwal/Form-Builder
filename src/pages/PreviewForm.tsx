import { Box, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FormRenderer from "../components/FormRenderer";
import { FormField } from "../types/form";
import { evaluateDerivedField } from "../components/DerivedFieldLogic";
import { validateForm } from "../utils/validations";

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

  const handleSubmit = () => {
    const newErrors = validateForm(values, form.fields);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
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
