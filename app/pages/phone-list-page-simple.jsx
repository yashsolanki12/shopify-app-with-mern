// import Loader from "../components/skeleton/loader";
// import PhoneList from "../components/phone/phone-list";

// import { useQuery } from "@tanstack/react-query";
// import {
//   deletePhone,
//   getAllPhone,
//   getCurrentSession,
//   getPhone,
// } from "../api/phone";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
// import Fab from "@mui/material/Fab";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
// import AddIcon from "@mui/icons-material/Add";
import React from "react";
// import { useQueryClient } from "@tanstack/react-query";

// const PhoneModal = React.lazy(() => import("../components/phone/phone-modal"));

export default function PhoneListPage() {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("+1");
  const [isEditing, setIsEditing] = React.useState(false);
  const [savedData, setSavedData] = React.useState(null);

  const countryCodes = [
    { value: "+1", label: "+1 (US/Canada)" },
    { value: "+44", label: "+44 (UK)" },
    { value: "+91", label: "+91 (India)" },
    { value: "+86", label: "+86 (China)" },
    { value: "+49", label: "+49 (Germany)" },
    { value: "+33", label: "+33 (France)" },
  ];

  const handleSave = () => {
    if (phoneNumber.trim()) {
      setSavedData({ phoneNumber, countryCode });
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    if (savedData) {
      setPhoneNumber(savedData.phoneNumber);
      setCountryCode(savedData.countryCode);
    }
    setIsEditing(true);
  };

  const handleDelete = () => {
    setSavedData(null);
    setPhoneNumber("");
    setCountryCode("+1");
    setIsEditing(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" color="primary" fontWeight={700} mb={3} textAlign="center">
          Phone Number
        </Typography>

        {!savedData || isEditing ? (
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Country Code</InputLabel>
              <Select
                value={countryCode}
                label="Country Code"
                onChange={(e) => setCountryCode(e.target.value)}
              >
                {countryCodes.map((country) => (
                  <MenuItem key={country.value} value={country.value}>
                    {country.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              type="tel"
            />

            <Box display="flex" gap={2} justifyContent="center">
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSave}
                disabled={!phoneNumber.trim()}
              >
                {isEditing ? "Update" : "Save"}
              </Button>
              {isEditing && (
                <Button 
                  variant="outlined" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Stack>
        ) : (
          <Stack spacing={3}>
            <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
              <Typography variant="h6" gutterBottom>
                Saved Phone Number:
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                {savedData.countryCode} {savedData.phoneNumber}
              </Typography>
            </Paper>

            <Box display="flex" gap={2} justifyContent="center">
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}