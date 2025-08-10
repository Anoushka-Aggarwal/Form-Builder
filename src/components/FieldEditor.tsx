import { useState } from "react";
import {
  TextField,
  MenuItem,
  Switch,
  Button,
  Box,
  Typography,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addField } from "../redux/formSlice";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../redux/store";
import DeleteIcon from "@mui/icons-material/Delete";

const fieldTypes = [
  "text",
  "number",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "date",
];

export default function FieldEditor() {
  const dispatch = useDispatch();
  const existingFields = useSelector((state: RootState) => state.form.fields);

  // Basic field data
  const [label, setLabel] = useState("");
  const [type, setType] = useState("text");
  const [required, setRequired] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");

  // Validation rules
  const [minLength, setMinLength] = useState<number | undefined>();
  const [maxLength, setMaxLength] = useState<number | undefined>();
  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  // Options for select/radio
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");

  // Derived field settings
  const [isDerived, setIsDerived] = useState(false);
  const [parentIds, setParentIds] = useState<string[]>([]);
  const [formula, setFormula] = useState("");

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions((prev) => [...prev, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleParentSelection = (id: string) => {
    setParentIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleAddField = () => {
    if (!label.trim()) {
      alert("Label is required");
      return;
    }

    const newField: any = {
      id: uuidv4(),
      type,
      label,
      required,
      defaultValue,
      validations: {
        minLength,
        maxLength,
        isEmail,
        isPassword,
      },
    };

    if (type === "select" || type === "radio") {
      newField.options = options;
    }

    if (isDerived) {
      newField.derived = {
        parentIds,
        formula,
      };
    }

    dispatch(addField(newField));

    // Reset form
    setLabel("");
    setType("text");
    setRequired(false);
    setDefaultValue("");
    setMinLength(undefined);
    setMaxLength(undefined);
    setIsEmail(false);
    setIsPassword(false);
    setOptions([]);
    setIsDerived(false);
    setParentIds([]);
    setFormula("");
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add New Field
      </Typography>

      {/* Label */}
      <TextField
        fullWidth
        label="Label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Type */}
      <TextField
        fullWidth
        select
        label="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        sx={{ mb: 2 }}
      >
        {fieldTypes.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </TextField>

      {/* Default Value */}
      <TextField
        fullWidth
        label="Default Value"
        value={defaultValue}
        onChange={(e) => setDefaultValue(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Required toggle */}
      <FormControlLabel
        control={
          <Switch
            checked={required}
            onChange={() => setRequired((prev) => !prev)}
          />
        }
        label="Required"
      />

      {/* Validation Rules */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Validation Rules:
      </Typography>
      <TextField
        type="number"
        label="Min Length"
        value={minLength ?? ""}
        onChange={(e) => setMinLength(e.target.value ? Number(e.target.value) : undefined)}
        sx={{ mr: 2, mt: 1 }}
      />
      <TextField
        type="number"
        label="Max Length"
        value={maxLength ?? ""}
        onChange={(e) => setMaxLength(e.target.value ? Number(e.target.value) : undefined)}
        sx={{ mt: 1 }}
      />

      {/* Options for Select/Radio */}
      {(type === "select" || type === "radio") && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Options:</Typography>
          <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
            <TextField
              label="New Option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              sx={{ mr: 1 }}
            />
            <Button variant="outlined" onClick={handleAddOption}>
              Add
            </Button>
          </Box>
          {options.map((opt, idx) => (
            <Box key={idx} display="flex" alignItems="center" sx={{ mt: 1 }}>
              <Typography sx={{ flexGrow: 1 }}>{opt}</Typography>
              <IconButton onClick={() => handleRemoveOption(idx)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Derived Field */}
      <FormControlLabel
        control={
          <Switch
            checked={isDerived}
            onChange={() => setIsDerived((prev) => !prev)}
          />
        }
        label="Derived Field"
      />

      {isDerived && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle2">Select Parent Fields:</Typography>
          {existingFields.map((f) => (
            <FormControlLabel
              key={f.id}
              control={
                <Switch
                  checked={parentIds.includes(f.id)}
                  onChange={() => handleParentSelection(f.id)}
                />
              }
              label={f.label}
            />
          ))}
          <TextField
            fullWidth
            label="Formula"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            helperText="Use parent field IDs as variables in the formula"
            sx={{ mt: 2 }}
          />
        </Box>
      )}

      {/* Add Field Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddField}
        sx={{ mt: 3 }}
      >
        Add Field
      </Button>
    </Box>
  );
}
