// import { Suspense, lazy } from "react";
import Loader from "../components/skeleton/loader";
// import PhoneList from "../components/phone/phone-list";

import { useQuery } from "@tanstack/react-query";
import {
  deletePhone,
  getAllPhone,
  getCurrentSession,
  // getPhone,
  createPhone,
  editPhone,
} from "../api/phone";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// const PhoneModal = lazy(() => import("../components/phone/phone-modal"));

export default function PhoneListPage() {
  const initialForm = { phone_number: "", country_code: "" };

  const queryClient = useQueryClient();
  // const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // const [formErrors, setFormErrors] = useState({});
  const [selectedId, setSelectedId] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Phone list
  const { error, data, isLoading } = useQuery({
    queryKey: ["phone"],
    queryFn: () => getAllPhone(),
    retry: 3,
    retryDelay: 1000,
    onError: (error) => {
      console.error("Phone list query error:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to load phone list",
        severity: "error",
      });
    },
  });

  // Current Session
  const {
    error: sessionError,
    data: sessionData,
    isLoading: sessionLoading,
  } = useQuery({
    queryKey: ["shopify-current-session"],
    queryFn: () => getCurrentSession(),
    retry: 3,
    retryDelay: 1000,
    onError: (error) => {
      console.error("Session query error:", error);
    },
  });

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const response = await createPhone({
        phone_number: form.phone_number,
        country_code: form.country_code,
        shopify_session_id: sessionData?.session?._id,
      });
      if (response) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["phone"] });
        setForm(initialForm);
      }
    } catch (error) {
      const errorMessages = error.response?.data;
      let message = "Failed to save phone";
      
      if (Array.isArray(errorMessages) && errorMessages.length > 0) {
        message = errorMessages.join(" | ");
      } else if (errorMessages?.message) {
        message = errorMessages.message;
      } else if (error.message) {
        message = error.message;
      }
      
      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEdit = () => {
    if (data?.data?.[0]) {
      setForm({
        phone_number: data.data[0].phone_number,
        country_code: data.data[0].country_code,
      });
      setSelectedId(data.data[0]._id);
      setEditMode(true);
    }
  };

  const handleUpdate = async () => {
    setSaveLoading(true);
    try {
      const response = await editPhone(selectedId, {
        phone_number: form.phone_number,
        country_code: form.country_code,
      });
      if (response) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["phone"] });
        setEditMode(false);
        setForm(initialForm);
      }
    } catch (error) {
      const errorMessages = error.response?.data;
      let message = "Failed to update phone";
      
      if (Array.isArray(errorMessages) && errorMessages.length > 0) {
        message = errorMessages.join(". ");
      } else if (errorMessages?.message) {
        message = errorMessages.message;
      } else if (error.message) {
        message = error.message;
      }
      
      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await deletePhone(data.data[0]._id);
      if (response) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["phone"] });
        setEditMode(false);
        setForm(initialForm);
        setSelectedId("");
      }
    } catch (error) {
      const errorMessages = error.response?.data;
      let message = "Failed to delete phone";
      
      if (Array.isArray(errorMessages) && errorMessages.length > 0) {
        message = errorMessages.join(". ");
      } else if (errorMessages?.message) {
        message = errorMessages.message;
      } else if (error.message) {
        message = error.message;
      }
      
      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const hasPhone = data?.data && data.data.length > 0;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" color="primary" fontWeight={700} mb={3} textAlign="center">
          Phone Number
        </Typography>

        {hasPhone && !editMode ? (
          <Stack spacing={3}>
            <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
              <Typography variant="h6" gutterBottom>
                Saved Phone Number:
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                {data.data[0].country_code} {data.data[0].phone_number}
              </Typography>
            </Paper>

            <Box display="flex" gap={2} justifyContent="center">
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleEdit}
                disabled={saveLoading || deleteLoading}
              >
                Edit
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleDelete}
                disabled={saveLoading || deleteLoading}
                startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
              >
                Delete
              </Button>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Country Code"
              value={form.country_code}
              onChange={(e) => setForm(prev => ({ ...prev, country_code: e.target.value }))}
              placeholder="e.g. +1, +91, +44"
            />

            <TextField
              fullWidth
              label="Phone Number"
              value={form.phone_number}
              onChange={(e) => setForm(prev => ({ ...prev, phone_number: e.target.value }))}
              placeholder="Enter phone number"
              type="tel"
            />

            <Box display="flex" gap={2} justifyContent="center">
              <Button 
                variant="contained" 
                color="primary" 
                onClick={editMode ? handleUpdate : handleSave}
                disabled={!form.phone_number.trim() || !form.country_code.trim() || saveLoading || deleteLoading}
                startIcon={saveLoading ? <CircularProgress size={20} /> : null}
              >
                {editMode ? "Update" : "Save"}
              </Button>
              {editMode && (
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setEditMode(false);
                    setForm(initialForm);
                  }}
                  disabled={saveLoading || deleteLoading}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Stack>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === "error" ? 5000 : 3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
