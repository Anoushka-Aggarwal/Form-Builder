import { Box, Button, Typography, TextField } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import FieldEditor from "../components/FieldEditor";
import FormRenderer from "../components/FormRenderer";
import { resetForm } from "../redux/formSlice";
import { useState } from "react";
import { saveFormToLocalStorage } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { removeField, moveFieldUp, moveFieldDown } from "../redux/formSlice";


export default function CreateForm() {
  const fields = useSelector((state: RootState) => state.form.fields);
  const dispatch = useDispatch();
  const [formName, setFormName] = useState("");
  const navigate = useNavigate();

  const handleSave = () => {
    if (!formName.trim()) return alert("Please enter a form name");

    const formSchema = {
      id: Date.now().toString(),
      name: formName,
      createdAt: new Date().toISOString(),
      fields,
    };

    saveFormToLocalStorage(formSchema);
    dispatch(resetForm());
    setFormName("");
    navigate("/myforms");
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>Create a New Form</Typography>
      <FieldEditor />
      <Typography variant="h6" gutterBottom>Live Preview</Typography>
      <FormRenderer
        fields={fields}
        values={{}}
        onChange={() => {}}
      />
      

<Box sx={{ mt: 2 }}>
  {fields.map((field, idx) => (
    <Box
      key={field.id}
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: 2,
        p: 1,
        mb: 1,
      }}
    >
      <Typography sx={{ flexGrow: 1 }}>
        {idx + 1}. {field.label} ({field.type})
      </Typography>
      <IconButton
        onClick={() => dispatch(moveFieldUp(field.id))}
        disabled={idx === 0}
      >
        <ArrowUpwardIcon />
      </IconButton>
      <IconButton
        onClick={() => dispatch(moveFieldDown(field.id))}
        disabled={idx === fields.length - 1}
      >
        <ArrowDownwardIcon />
      </IconButton>
      <IconButton onClick={() => dispatch(removeField(field.id))}>
        <DeleteIcon />
      </IconButton>
    </Box>
  ))}
</Box>

      <TextField
        fullWidth
        label="Form Name"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        sx={{ mt: 3 }}
      />
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSave}
        disabled={fields.length === 0}
      >
        Save Form
      </Button>
    </Box>
  );
}
