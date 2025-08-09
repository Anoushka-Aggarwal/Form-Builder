import { useEffect, useState } from "react";
import { getForms } from "../utils/localStorage";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function FormList() {
  const [forms, setForms] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = getForms();
    setForms(saved);
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Saved Forms</Typography>
      {forms.length === 0 ? (
        <Typography>No forms found.</Typography>
      ) : (
        forms.map((form, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant="h6">{form.name}</Typography>
            <Typography variant="body2">Created at: {form.createdAt}</Typography>
            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={() => navigate("/preview", { state: { form } })}
            >
              Preview
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
}
