import React from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function MessageInput({ value, onChange }) {
  return (
    <Card sx={{ mb: 3, borderRadius: "10px" }}>
      <CardContent>
        <Typography
          variant="h2"
          sx={{ fontSize: "14px", paddingBottom: "5px" }}
          fontWeight={600}
          mb={{ xs: 2, sm: 3.5 }}
        >
          Message Settings
        </Typography>
        <TextField
          fullWidth
          label="Your Message"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your message here..."
          multiline
          rows={2}
          inputProps={{ maxLength: 50 }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: { xs: "14px", sm: "inherit" },
            },
            "& .MuiInputLabel-root": {
              fontSize: { xs: "14px", sm: "inherit" },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption" color="textSecondary">
                  {value?.length || 0}/50
                </Typography>
              </InputAdornment>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
}
