import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  MenuItem,
  RadioGroup,
  Radio,
  FormLabel,
} from "@mui/material";
import { FormField } from "../redux/formSlice";

interface Props {
  fields: FormField[];
  values: { [key: string]: string };
  onChange: (id: string, value: string) => void;
  errors?: { [key: string]: string };
}

export default function FormRenderer({
  fields,
  values,
  onChange,
  errors = {},
}: Props) {
  return (
    <Box>
      {fields.map((field) => {
        const error = errors[field.id];
        const commonProps = {
          fullWidth: true,
          label: field.label,
          value: values[field.id] || "",
          onChange: (e: any) => onChange(field.id, e.target.value),
          error: Boolean(error),
          helperText: error || "",
        };

        switch (field.type) {
          case "text":
          case "number":
          case "date":
            return (
              <TextField
                key={field.id}
                type={field.type}
                {...commonProps}
                sx={{ my: 1 }}
              />
            );

          case "textarea":
            return (
              <TextField
                key={field.id}
                multiline
                rows={3}
                {...commonProps}
                sx={{ my: 1 }}
              />
            );

          case "checkbox":
            return (
              <FormControlLabel
                key={field.id}
                control={
                  <Checkbox
                    checked={values[field.id] === "true"}
                    onChange={(e) =>
                      onChange(field.id, e.target.checked ? "true" : "false")
                    }
                  />
                }
                label={field.label}
              />
            );

          case "select":
            return (
              <TextField
                key={field.id}
                select
                {...commonProps}
                sx={{ my: 1 }}
              >
                {field.options?.map((opt: string, idx: number) => (
  <MenuItem key={idx} value={opt}>
    {opt}
  </MenuItem>
))}

              </TextField>
            );

          case "radio":
            return (
              <Box key={field.id} sx={{ my: 1 }}>
                <FormLabel>{field.label}</FormLabel>
                <RadioGroup
                  value={values[field.id] || ""}
                  onChange={(e) => onChange(field.id, e.target.value)}
                >
                 {field.options?.map((opt: string, idx: number) => (
  <FormControlLabel
    key={idx}
    value={opt}
    control={<Radio />}
    label={opt}
  />
))}

                </RadioGroup>
                {error && (
                  <Typography variant="caption" color="error">
                    {error}
                  </Typography>
                )}
              </Box>
            );

          default:
            return (
              <Typography key={field.id} color="error">
                Unsupported field: {field.type}
              </Typography>
            );
        }
      })}
    </Box>
  );
}
