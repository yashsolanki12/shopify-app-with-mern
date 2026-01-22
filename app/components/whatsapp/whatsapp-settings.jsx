import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { editPhone } from "../../api/phone";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function WhatsAppSettings({
  phoneData,
  initialSettings = {},
  onSettingsUpdate,
  onError,
}) {
  const queryClient = useQueryClient();
  const [settingsLoading, setSettingsLoading] = React.useState(false);

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
      if (firstPhone.message !== undefined) setTempMessage(firstPhone.message);
      if (firstPhone.button_style) setTempButtonStyle(firstPhone.button_style);
      if (firstPhone.custom_icon) setTempCustomIcon(firstPhone.custom_icon);
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
        onSettingsUpdate?.({
          message: tempMessage,
          position: tempIconPosition,
          button_style: tempButtonStyle,
          custom_icon: tempCustomIcon,
        });
        queryClient.invalidateQueries({ queryKey: ["phone"] });
      }
    } catch (error) {
      onError?.("Failed to update WhatsApp settings");
    } finally {
      setSettingsLoading(false);
    }
  };


  return (
    <Box
      sx={{
        width: "calc(100vw - 56px)",
        ml: "calc(-50vw + 50% + 16px)",
        px: 2,
        mt: "24px",
      }}
    >
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mt: 3 }}>
        <Typography
          variant="h5"
          color="primary"
          fontWeight={700}
          mb={3}
          textAlign="center"
        >
          WhatsApp Settings
        </Typography>

        <Stack spacing={3}>
          <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Your Message"
                value={tempMessage}
                onChange={(e) => setTempMessage(e.target.value)}
                placeholder="Type your message here..."
                multiline
                rows={2}
                inputProps={{ maxLength: 50 }}
              />

              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{ fontSize: "1rem", fontWeight: 600 }}
                >
                  Chat Icon Position
                </FormLabel>
                <RadioGroup
                  row
                  value={tempIconPosition}
                  onChange={(e) => setTempIconPosition(e.target.value)}
                  sx={{ mt: 1 }}
                >
                  <FormControlLabel
                    value="left"
                    control={<Radio />}
                    label={<Typography variant="body1">Left</Typography>}
                  />
                  <FormControlLabel
                    value="right"
                    control={<Radio />}
                    label={<Typography variant="body1">Right</Typography>}
                  />
                </RadioGroup>
              </FormControl>

              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{ fontSize: "1rem", fontWeight: 600 }}
                >
                  Custom Chat Icon
                </FormLabel>
                <RadioGroup
                  row
                  value={tempCustomIcon}
                  onChange={(e) => setTempCustomIcon(e.target.value)}
                  sx={{ mt: 2, gap: 2 }}
                >
                  {[
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
                  ].map((icon) => (
                    <FormControlLabel
                      key={icon.value}
                      value={icon.value}
                      control={<Radio />}
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <img
                            src={icon.src}
                            alt={icon.label}
                            style={{ width: "30px", height: "30px" }}
                          />
                          <Typography variant="caption">
                            {icon.label}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{ fontSize: "1rem", fontWeight: 600 }}
                >
                  Chat Icon Style
                </FormLabel>
                <RadioGroup
                  row
                  value={tempButtonStyle}
                  onChange={(e) => setTempButtonStyle(e.target.value)}
                  sx={{ mt: 2, gap: 4 }}
                >
                  <FormControlLabel
                    value="icon_only"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 45,
                            height: 45,
                            backgroundColor: "#25D366",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(37, 211, 102, 0.2)",
                          }}
                        >
                          <img
                            src={
                              tempCustomIcon === "chat1"
                                ? "/chat-icon-1.svg"
                                : tempCustomIcon === "chat2"
                                  ? "/chat-icon-2.svg"
                                  : tempCustomIcon === "chat3"
                                    ? "/chat-icon-3.svg"
                                    : "/whatsapp.png"
                            }
                            alt="Chat"
                            style={{ width: "24px", height: "24px" }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="icon_with_text"
                    control={<Radio />}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "#25D366",
                          borderRadius: "25px",
                          px: 2,
                          py: 1,
                          gap: 1,
                          boxShadow: "0 2px 8px rgba(37, 211, 102, 0.2)",
                        }}
                      >
                        <img
                          src={
                            tempCustomIcon === "chat1"
                              ? "/chat-icon-1.svg"
                              : tempCustomIcon === "chat2"
                                ? "/chat-icon-2.svg"
                                : tempCustomIcon === "chat3"
                                  ? "/chat-icon-3.svg"
                                  : "/whatsapp.png"
                          }
                          alt="Chat"
                          style={{ width: "20px", height: "20px" }}
                        />
                        <Typography
                          sx={{
                            color: "white",
                            fontWeight: 700,
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          WhatsApp us
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>

              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateSettings}
                  disabled={settingsLoading}
                  startIcon={
                    settingsLoading ? <CircularProgress size={20} /> : null
                  }
                  sx={{ textTransform: "none" }}
                >
                  Save Changes
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Paper>
    </Box>
  );
}
