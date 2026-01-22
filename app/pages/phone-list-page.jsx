import Loader from "../components/skeleton/loader";
import WhatsAppSettings from "../components/whatsapp/whatsapp-settings";
import WhatsAppIcon from "../components/whatsapp/whatsapp-icon";

import { useQuery } from "@tanstack/react-query";
import {
  getAllPhone,
  getCurrentSession,
  createPhone,
  editPhone,
  // deletePhone,
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
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FormLabel } from "@mui/material";

// const PhoneModal = lazy(() => import("../components/phone/phone-modal"));

export default function PhoneListPage({
  appEmbedEnabled = false,
  initialSettings = {},
  apiKey = "",
  session = null,
  foundBlockType = "",
}) {
  const initialForm = { phone_number: "", country_code: "" };

  const queryClient = useQueryClient();
  // ...
  const [editMode, setEditMode] = React.useState(false);
  const [form, setForm] = React.useState(initialForm);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedId, setSelectedId] = React.useState("");
  const [saveLoading, setSaveLoading] = React.useState(false);
  // const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [iconPosition, setIconPosition] = React.useState(
    initialSettings?.position || "right",
  );
  const [message, setMessage] = React.useState(initialSettings?.message || "");
  const [buttonStyle, setButtonStyle] = React.useState(
    initialSettings?.button_style || "icon_only",
  );
  const [customIcon, setCustomIcon] = React.useState(
    initialSettings?.custom_icon || "whatsapp",
  );
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

  React.useEffect(() => {
    if (initialSettings && !data?.data?.[0]) {
      setIconPosition(initialSettings.position || "right");
      setMessage(initialSettings.message || "");
      setButtonStyle(initialSettings.button_style || "icon_only");
      setCustomIcon(initialSettings.custom_icon || "whatsapp");
    }
  }, [initialSettings, data]);

  React.useEffect(() => {
    if (data?.data?.[0]) {
      const phoneData = data.data[0];
      if (phoneData.position) setIconPosition(phoneData.position);
      if (phoneData.message !== undefined) setMessage(phoneData.message);
      if (phoneData.button_style) setButtonStyle(phoneData.button_style);
      if (phoneData.custom_icon) setCustomIcon(phoneData.custom_icon);
    }
  }, [data]);

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
      let response;
      if (selectedId) {
        response = await editPhone(selectedId, {
          phone_number: form.phone_number,
          country_code: form.country_code,
        });
      } else {
        response = await createPhone({
          phone_number: form.phone_number,
          country_code: form.country_code,
          shopify_session_id: sessionData?.session?._id,
        });
      }
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
    if (data?.data?.length > 0) {
      data?.data?.map((ele) => {
        setForm({
          phone_number: ele.phone_number,
          country_code: ele.country_code,
        });
        setSelectedId(ele._id);
      });
      setEditMode(true);
    }
  };

  const handleSettingsUpdate = (newSettings) => {
    setMessage(newSettings.message);
    setIconPosition(newSettings.position);
    setButtonStyle(newSettings.button_style);
    setCustomIcon(newSettings.custom_icon);
    setSnackbar({
      open: true,
      message: "WhatsApp settings updated successfully.",
      severity: "success",
    });
  };

  const handleSettingsError = (errorMessage) => {
    setSnackbar({
      open: true,
      message: errorMessage,
      severity: "error",
    });
  };

  // const handleDelete = async () => {
  //   setDeleteLoading(true);
  //   try {
  //     const response = await deletePhone(data.data[0]._id);
  //     if (response) {
  //       setSnackbar({
  //         open: true,
  //         message: response.message,
  //         severity: "success",
  //       });
  //       queryClient.invalidateQueries({ queryKey: ["phone"] });
  //       setEditMode(false);
  //       setForm(initialForm);
  //       setSelectedId("");
  //     }
  //   } catch (error) {
  //     const errorMessages = error.response?.data;
  //     let message = "Failed to delete phone";

  //     if (Array.isArray(errorMessages) && errorMessages.length > 0) {
  //       message = errorMessages.join(" | ");
  //     } else if (errorMessages?.message) {
  //       message = errorMessages.message;
  //     } else if (error.message) {
  //       message = error.message;
  //     }

  //     setSnackbar({
  //       open: true,
  //       message,
  //       severity: "error",
  //     });
  //   } finally {
  //     setDeleteLoading(false);
  //   }
  // };

  const hasPhone = data?.data && data.data.length > 0;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h5"
          color="primary"
          fontWeight={700}
          mb={3}
          textAlign="center"
        >
          Phone Number
        </Typography>

        {!appEmbedEnabled && (
          <Box
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              bgcolor: "error.lighter",
              border: "1px solid",
              borderColor: "error.light",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Typography variant="body2" color="error.dark" fontWeight={600}>
              ⚠️ WhatsApp Widget is disabled
            </Typography>
            <Typography variant="body2" color="text.secondary">
              To show the WhatsApp button on your store, you must enable the App
              Embed in your theme editor.
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="small"
              fullWidth
              onClick={() => {
                const currentShop =
                  session?.shop ||
                  sessionData?.session?.shop ||
                  new URLSearchParams(window.location.search).get("shop") ||
                  window.location.hostname;
                // Redirect to the general apps context in the theme editor
                // This will open the 'App embeds' tab directly
                const url = `https://${currentShop}/admin/themes/current/editor?context=apps`;
                window.open(url, "_blank");
              }}
              sx={{ textTransform: "none" }}
            >
              Enable in Theme Editor
            </Button>
          </Box>
        )}

        {hasPhone && !editMode ? (
          <Stack spacing={3}>
            <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
              <FormLabel
                component="legend"
                sx={{ fontSize: "1rem", fontWeight: 600, mb: '0.25rem' }}
              >
                Saved Phone Number:
              </FormLabel>
              <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                {data.data[0].country_code} {data.data[0].phone_number}
              </Typography>
            </Paper>

            <Box display="flex" gap={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
                disabled={saveLoading} //|| deleteLoading
                sx={{ textTransform: "none" }}
              >
                Edit
              </Button>
              {/* <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                disabled={saveLoading || deleteLoading}
                startIcon={
                  deleteLoading ? <CircularProgress size={20} /> : null
                }
              >
                Delete
              </Button> */}
            </Box>
          </Stack>
        ) : (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Country Code"
              value={form.country_code}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, country_code: e.target.value }))
              }
              placeholder="e.g. +1, +91, +44"
            />

            <TextField
              fullWidth
              label="Phone Number"
              value={form.phone_number}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phone_number: e.target.value }))
              }
              placeholder="Enter phone number"
              type="tel"
            />

            <Box display="flex" gap={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={editMode ? handleSave : handleSave}
                disabled={
                  !form.phone_number.trim() ||
                  !form.country_code.trim() ||
                  saveLoading
                  // || deleteLoading
                }
                startIcon={saveLoading ? <CircularProgress size={20} /> : null}
                sx={{ textTransform: "none" }}
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
                  disabled={saveLoading} // || deleteLoading
                  sx={{ textTransform: "none" }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Stack>
        )}
      </Paper>

      {/* WhatsApp Settings */}
      {hasPhone && !editMode && appEmbedEnabled && (
        <WhatsAppSettings
          phoneData={data.data}
          initialSettings={{
            position: iconPosition,
            message: message,
            button_style: buttonStyle,
            custom_icon: customIcon,
          }}
          onSettingsUpdate={handleSettingsUpdate}
          onError={handleSettingsError}
        />
      )}

      {/* WhatsApp Floating Icon */}
      <WhatsAppIcon
        phoneData={hasPhone ? data.data : null}
        message={message}
        iconPosition={iconPosition}
        buttonStyle={buttonStyle}
        customIcon={customIcon}
        appEmbedEnabled={appEmbedEnabled}
      />

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
