import { Box, Typography } from "@mui/material";
import FormList from "../components/FormList";

export default function MyForms() {
  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>My Saved Forms</Typography>
      <FormList />
    </Box>
  );
}
