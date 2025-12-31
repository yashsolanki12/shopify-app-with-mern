import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function DebugInfo({ data, sessionData, error, sessionError }) {
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const shopDomain = urlParams?.get("shop");

  return (
    <Box sx={{ mt: 2 }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" color="secondary">
            🐛 Debug Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">URL Information:</Typography>
            <Typography>Shop Domain: {shopDomain || "Not found"}</Typography>
            <Typography>Current URL: {typeof window !== "undefined" ? window.location.href : "SSR"}</Typography>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">API Data:</Typography>
            <Typography>Phone Data: {data ? JSON.stringify(data, null, 2) : "No data"}</Typography>
            <Typography>Phone Error: {error ? error.message : "No error"}</Typography>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">Session Data:</Typography>
            <Typography>Session Data: {sessionData ? JSON.stringify(sessionData, null, 2) : "No session data"}</Typography>
            <Typography>Session Error: {sessionError ? sessionError.message : "No session error"}</Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}