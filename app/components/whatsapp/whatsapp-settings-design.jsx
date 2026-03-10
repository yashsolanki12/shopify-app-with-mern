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

  React.useEffect(() => {
    if (phoneData?.length > 0) {
      const firstPhone = phoneData[0];
      if (firstPhone.position) setTempIconPosition(firstPhone.position);
      if (firstPhone.button_style) setTempButtonStyle(firstPhone.button_style);
      if (firstPhone.custom_icon) setTempCustomIcon(firstPhone.custom_icon);
      if (firstPhone.message !== undefined) setTempMessage(firstPhone.message);
    }
  }, [phoneData]);

  const handleUpdateSettings = async () => {
    if (!phoneData?.length) return;
    setSettingsLoading(true);
    try {
      const promises = phoneData.map(async (ele) => {
        return await editPhone(ele._id, {
          phone_number: ele.phone_number,
          country_code: ele.country_code,
          message: tempMessage,
          position: tempIconPosition,
          button_style: tempButtonStyle,
          custom_icon: tempCustomIcon,
        });
      });

      const responses = await Promise.all(promises);

      if (responses.length > 0) {
        setSnackbar({
          open: true,
          message: "WhatsApp settings updated successfully!",
          severity: "success",
        });
        onSettingsUpdate?.({
          message: tempMessage,
          position: tempIconPosition,
          button_style: tempButtonStyle,
          custom_icon: tempCustomIcon,
        });
        queryClient.invalidateQueries({ queryKey: ["phone"] });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update WhatsApp settings",
        severity: "error",
      });
      onError?.("Failed to update WhatsApp settings");
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

  if (!phoneData || phoneData.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          No Phone Number Configured
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Please add a phone number in the Phone section first to configure
          WhatsApp settings.
        </Typography>
      </Box>
    );
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
            To display WhatsApp widget on your storefront, please complete the
            configuration below and enable the App Embed in your theme editor.
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
            </Box>

            <Box display="flex" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateSettings}
                disabled={settingsLoading}
                startIcon={
                  settingsLoading ? <CircularProgress size={20} /> : null
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
