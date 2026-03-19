import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { editPhone, getAllPhone, getCurrentSession } from "../../api/phone";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useQuery } from "@tanstack/react-query";
import MessageInput from "./message-input";
import IconPositionSelect from "./icon-position-select";
import CustomIconSelect from "./custom-icon-select";
import IconStyleSelect from "./icon-style-select";
import LivePreview from "./live-preview";
import { Container } from "@mui/material";
import Loader from "../../components/skeleton/loader";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CountryCodeSelect from "../phone/CountryCodeSelect";
import { phoneSchema } from "../../validation/phone.schema";
import { createPhone } from "../../api/phone";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";

export default function WhatsAppSettingsDesign({
  initialSettings = {},
  appEmbedEnabled = false,
  apiKey = "",
  foundBlockType = "",
  session = null,
  onSettingsUpdate,
  onError,
}) {
  const queryClient = useQueryClient();
  const [settingsLoading, setSettingsLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
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

  // Fetch phone data - same as phone-list-page.jsx
  const { data: phoneResponse, isLoading: phoneLoading } = useQuery({
    queryKey: ["phone"],
    queryFn: () => getAllPhone(),
    staleTime: Infinity, // Never refetch automatically
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on mount
    retry: 3,
    retryDelay: 1000,
  });

  const phoneData = phoneResponse?.data || [];

  const initialForm = { phone_number: "", country_code: "" };
  const [form, setForm] = React.useState(initialForm);
  const [formErrors, setFormErrors] = React.useState(initialForm);
  const [selectedId, setSelectedId] = React.useState("");

  const [tempIconPosition, setTempIconPosition] = React.useState(
    initialSettings?.position || "right",
  );
  const [tempMessage, setTempMessage] = React.useState(
    initialSettings?.message || "",
  );
  const [tempButtonStyle, setTempButtonStyle] = React.useState(
    initialSettings?.button_style || "icon_only",
  );
  const [tempCustomIcon, setTempCustomIcon] = React.useState(
    initialSettings?.custom_icon || "whatsapp",
  );
  const [tempPageDisplay, setTempPageDisplay] = React.useState(
    initialSettings?.page_display || ["all"],
  );

  React.useEffect(() => {
    if (phoneData?.length > 0) {
      const firstPhone = phoneData[0];
      if (firstPhone.position) setTempIconPosition(firstPhone.position);
      if (firstPhone.button_style) setTempButtonStyle(firstPhone.button_style);
      if (firstPhone.custom_icon) setTempCustomIcon(firstPhone.custom_icon);
      if (firstPhone.page_display) {
        // Handle both string and array formats for backwards compatibility
        const pageDisplay = firstPhone.page_display;
        if (Array.isArray(pageDisplay)) {
          setTempPageDisplay(pageDisplay);
        } else if (typeof pageDisplay === "string") {
          setTempPageDisplay([pageDisplay]);
        }
      }
      if (firstPhone.message !== undefined) setTempMessage(firstPhone.message);

      setForm({
        phone_number: firstPhone.phone_number || "",
        country_code: firstPhone.country_code || "",
      });
      setSelectedId(firstPhone._id);
    }
  }, [phoneData]);

  const handleUpdateSettings = async () => {
    // Zod validation for phone
    const result = phoneSchema.safeParse(form);
    if (!result.success) {
      // Initialize errors with empty strings for both fields
      const errors = {
        phone_number: "",
        country_code: "",
      };

      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (typeof fieldName === "string" && fieldName in errors) {
          errors[fieldName] = issue.message;
        }
      });

      setFormErrors(errors);
      return;
    }

    // Clear form errors when validation passes
    setFormErrors({ phone_number: "", country_code: "" });

    setSettingsLoading(true);
    try {
      let response;
      const payload = {
        phone_number: form.phone_number,
        country_code: form.country_code,
        message: tempMessage,
        position: tempIconPosition,
        button_style: tempButtonStyle,
        custom_icon: tempCustomIcon,
        page_display: tempPageDisplay,
      };

      if (selectedId) {
        response = await editPhone(selectedId, payload);
      } else {
        payload.shopify_session_id = sessionData?.session?._id;
        response = await createPhone(payload);
      }

      if (response) {
        setSnackbar({
          open: true,
          message: "Settings saved successfully!",
          severity: "success",
        });
        onSettingsUpdate?.({
          message: tempMessage,
          position: tempIconPosition,
          button_style: tempButtonStyle,
          custom_icon: tempCustomIcon,
          page_display: tempPageDisplay,
        });
        queryClient.invalidateQueries({ queryKey: ["phone"] });
      }
    } catch (error) {
      const errorMessages = error.response?.data;
      let message = "Failed to save settings";

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
      onError?.(message);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Live Preview Component - moved outside to prevent re-creation on every render
  const getIconSrc = (icon) => {
    switch (icon) {
      case "chat1":
        return "/chat-icon-1.svg";
      case "chat2":
        return "/chat-icon-2.svg";
      case "chat3":
        return "/chat-icon-3.svg";
      default:
        return "/whatsapp.png";
    }
  };

  if (phoneLoading) {
    return <Loader />;
  }

  if (!appEmbedEnabled) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
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
            maxWidth: 500,
            gap: 1.5,
          }}
        >
          <Typography variant="body2" color="error.dark" fontWeight={600}>
            ⚠️ WhatsApp Widget is Currently Inactive
          </Typography>
          <Typography variant="body2" color="text.secondary">
            To display WhatsApp widget on your storefront, please enable the App
            Embed & complete the configuration below and in your theme editor.
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
      </Container>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: "1200px" },
          mx: "auto",
          // px: { xs: 2, sm: 3 },
          // py: { xs: 2, md: 3 },
        }}
      >
        {/* Header Section */}
        <Box mb={{ xs: 3, md: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: "18px", sm: "20px" } }}
            fontWeight={650}
            mb={1}
          >
            Settings
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: { xs: "12px", sm: "13px" } }}
            color="textSecondary"
            mb={3}
            fontWeight={450}
          >
            Configure your WhatsApp chat button to match your store's needs.
          </Typography>
        </Box>

        {/* Settings Layout - Side by Side */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, md: 4 },
            flexDirection: { xs: "column-reverse", md: "row" },
          }}
        >
          {/* Settings Column */}
          <Box
            sx={{ flex: 1, marginTop: { xs: "5px", md: "5px" }, minWidth: 0 }}
          >
            {/* Phone Number Section */}
            <Box mb={{ xs: 3, md: 4 }}>
              <Typography
                variant="h2"
                sx={{ fontSize: "14px" }}
                fontWeight={600}
                mb={0.5}
              >
                Phone Number
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: "13px" }}
                fontWeight={450}
                color="textSecondary"
                mb={3}
              >
                <p>Configure the WhatsApp number for your button.</p>
              </Typography>

              <Card sx={{ mb: 3, borderRadius: "10px" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "flex-start",
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: "100%", sm: "fit-content" },
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        variant="h2"
                        sx={{ fontSize: "14px", paddingBottom: "5px" }}
                        fontWeight={600}
                        mb={1}
                      >
                        Country Code
                      </Typography>
                      <CountryCodeSelect
                        value={form.country_code}
                        onChange={(code) => {
                          setForm((prev) => ({ ...prev, country_code: code }));
                          if (formErrors.country_code) {
                            setFormErrors((prev) => ({
                              ...prev,
                              country_code: "",
                            }));
                          }
                        }}
                        error={!!formErrors.country_code}
                      />
                      {formErrors.country_code && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, display: "block", fontSize: "10px" }}
                        >
                          {formErrors.country_code}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ flex: 1, width: "100%" }}>
                      <Typography
                        variant="h2"
                        sx={{ fontSize: "14px", paddingBottom: "5px" }}
                        fontWeight={600}
                        mb={1}
                      >
                        Your Number
                      </Typography>
                      <TextField
                        fullWidth
                        value={form.phone_number}
                        onChange={(e) => {
                          setForm((prev) => ({
                            ...prev,
                            phone_number: e.target.value,
                          }));
                          if (formErrors.phone_number) {
                            setFormErrors((prev) => ({
                              ...prev,
                              phone_number: "",
                            }));
                          }
                        }}
                        placeholder="e.g. 8265683421"
                        type="text"
                        error={!!formErrors.phone_number}
                        helperText={
                          formErrors.phone_number
                            ? formErrors.phone_number
                            : 'No leading "+", for example: 1234567890.'
                        }
                        inputProps={{ maxLength: 15 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                {form.phone_number?.length || 0}/15
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          height: "56px",
                          "& .MuiOutlinedInput-root": {
                            fontSize: { xs: "14px", sm: "inherit" },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* General Section */}
            <Box mb={{ xs: 3, md: 4 }}>
              <Typography
                variant="h2"
                sx={{ fontSize: "14px" }}
                fontWeight={600}
                mb={0.5}
              >
                General
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: "13px" }}
                fontWeight={450}
                color="textSecondary"
                mb={3}
              >
                <p>Basic settings for your WhatsApp Button.</p>
              </Typography>
              <MessageInput value={tempMessage} onChange={setTempMessage} />
            </Box>

            {/* Appearance Section */}
            <Box mb={{ xs: 3, md: 4 }} mt={{ xs: 4, md: 6 }}>
              <Typography
                variant="h2"
                sx={{ fontSize: "14px" }}
                fontWeight={600}
                mb={0.5}
              >
                Appearance
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: "13px" }}
                fontWeight={450}
                color="textSecondary"
                mb={3}
              >
                <p>Customize how your button looks and where it appears.</p>
              </Typography>
              <IconPositionSelect
                value={tempIconPosition}
                onChange={setTempIconPosition}
              />
              <CustomIconSelect
                value={tempCustomIcon}
                onChange={setTempCustomIcon}
                icons={[
                  {
                    value: "whatsapp",
                    label: "WhatsApp",
                    src: "/whatsapp.png",
                  },
                  {
                    value: "chat1",
                    label: "Chat Bubble",
                    src: "/chat-icon-1.svg",
                  },
                  {
                    value: "chat2",
                    label: "Message Icon",
                    src: "/chat-icon-2.svg",
                  },
                  {
                    value: "chat3",
                    label: "Chat Circle",
                    src: "/chat-icon-3.svg",
                  },
                ]}
              />
              <IconStyleSelect
                value={tempButtonStyle}
                onChange={setTempButtonStyle}
                getIconSrc={getIconSrc}
              />

              {/* Page Display Selection */}
              <Card sx={{ mb: 3, borderRadius: "10px" }}>
                <CardContent>
                  <Box>
                    <Typography
                      variant="h2"
                      sx={{ fontSize: "14px" }}
                      fontWeight={600}
                      mb={1}
                    >
                      Display On Pages
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: "13px" }}
                      fontWeight={450}
                      color="textSecondary"
                      mb={2}
                    >
                      Select which pages to display the WhatsApp widget on.
                    </Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel id="page-display-label">
                        Display On
                      </InputLabel>
                      <Select
                        labelId="page-display-label"
                        id="page-display-select"
                        multiple
                        value={tempPageDisplay}
                        label="Display On"
                        onChange={(e) => {
                          const value = e.target.value;
                          // If "all" is selected, replace everything with just "all"
                          if (value.includes("all")) {
                            setTempPageDisplay(["all"]);
                          } else {
                            setTempPageDisplay(
                              typeof value === "string"
                                ? value.split(",")
                                : value,
                            );
                          }
                        }}
                        input={<OutlinedInput label="Display On" />}
                        renderValue={(selected) => {
                          if (selected.includes("all")) {
                            return "All Pages";
                          }
                          return selected.join(", ");
                        }}
                      >
                        <MenuItem value="all">
                          <Checkbox checked={tempPageDisplay.includes("all")} />
                          <ListItemText primary="All Pages" />
                        </MenuItem>
                        <MenuItem value="home">
                          <Checkbox
                            checked={tempPageDisplay.includes("home")}
                          />
                          <ListItemText primary="Home Page" />
                        </MenuItem>
                        <MenuItem value="products">
                          <Checkbox
                            checked={tempPageDisplay.includes("products")}
                          />
                          <ListItemText primary="Product Page" />
                        </MenuItem>
                        <MenuItem value="catalog">
                          <Checkbox
                            checked={tempPageDisplay.includes("catalog")}
                          />
                          <ListItemText primary="Collection Page" />
                        </MenuItem>
                        <MenuItem value="contact">
                          <Checkbox
                            checked={tempPageDisplay.includes("contact")}
                          />
                          <ListItemText primary="Contact Page" />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box display="flex" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateSettings}
                disabled={settingsLoading}
                startIcon={
                  settingsLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
                sx={{
                  textTransform: "none",
                  px: 2,
                  py: 1,
                  fontSize: "0.85rem",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>

          {/* Live Preview Column */}
          <Box
            sx={{
              width: { xs: "100%", md: "350px" },
              flexShrink: 0,
              position: { xs: "relative", md: "sticky" },
              top: { xs: 0, md: 20 },
              mb: { xs: 2, md: 0 },
            }}
          >
            <LivePreview
              iconPosition={tempIconPosition}
              buttonStyle={tempButtonStyle}
              customIcon={tempCustomIcon}
              phoneData={phoneData}
            />
          </Box>
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
