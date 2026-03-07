import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { Divider } from "@mui/material";

export default function LivePreview({
  iconPosition,
  buttonStyle,
  customIcon,
  phoneData,
}) {
  const [viewMode, setViewMode] = useState("desktop");

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

  const isIconWithText = buttonStyle === "icon_with_text";

  // Generate the WhatsApp URL for display
  const getWhatsAppUrl = () => {
    if (!phoneData || phoneData.length === 0) return "";
    const firstPhone = phoneData[0];
    const fullNumber =
      String(firstPhone.country_code || "") +
      " " +
      String(firstPhone.phone_number || "")
        .replace(/(\+)(?=\d)/g, "")
        .replace(/\D/g, "");
    return `https://wa.me/${fullNumber}`;
  };

  // Determine horizontal position
  const isLeft = iconPosition === "left";

  return (
    <Paper
      elevation={3}
      sx={{
        position: "sticky",
        top: 20,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header with title and info */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          py: 1.5,
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontSize: "14px" }}
          fontWeight={650}
          color="black"
        >
          Live Preview
        </Typography>
        <Box
          sx={{
            px: 1,
            py: 0.2,
            backgroundColor: "#d5ebff",
            borderRadius: "5rem",
          }}
        >
          <Typography
            sx={{
              color: "#42718d",
              fontSize: "12px",
              fontWeight: 450,
            }}
          >
            Updates in real-time
          </Typography>
        </Box>
        <InfoOutlined sx={{ color: "white", fontSize: 20 }} />
      </Box>

      {/* Info text */}
      <Box
        sx={{
          px: 2,
        }}
      >
        <Typography
          sx={{
            color: "#666",
            fontSize: "12px",
          }}
        >
          See how your button will appear on your store
        </Typography>
      </Box>
      <Divider sx={{ mt: 2, mx: 2 }} />

      {/* View Mode Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#fafafa" }}>
        <Tabs
          value={viewMode}
          onChange={(e, newValue) => setViewMode(newValue)}
          centered
          sx={{
            minHeight: 36,
            "& .MuiTab-root": {
              minHeight: 36,
              py: 0.5,
              fontSize: "12px",
            },
          }}
        >
          <Tab label="Desktop" value="desktop" />
          <Tab label="Mobile" value="mobile" />
        </Tabs>
      </Box>

      {/* Preview Area */}
      <Box
        sx={{
          py: 2,
          px: 3,
          bgcolor: "#f5f5f5",
          minHeight: viewMode === "desktop" ? 300 : 400,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {viewMode === "desktop" ? (
          // Desktop View
          <Box
            sx={{
              flex: 1,
              bgcolor: "white",
              borderRadius: 1,
              border: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Desktop Header */}
            <Box
              sx={{
                bgcolor: "#fafafa",
                borderBottom: "1px solid #e0e0e0",
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{ width: 60, height: 8, bgcolor: "#ddd", borderRadius: 1 }}
              />
              <Box
                sx={{
                  width: 40,
                  height: 8,
                  bgcolor: "#ddd",
                  borderRadius: 1,
                  ml: "auto",
                }}
              />
            </Box>
            {/* Desktop Content */}
            <Box
              sx={{
                flex: 1,
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: "80%",
                  height: 20,
                  bgcolor: "#f0f0f0",
                  borderRadius: 1,
                }}
              />
              <Box
                sx={{
                  width: "60%",
                  height: 20,
                  bgcolor: "#f0f0f0",
                  borderRadius: 1,
                }}
              />
              <Box
                sx={{
                  width: "70%",
                  height: 20,
                  bgcolor: "#f0f0f0",
                  borderRadius: 1,
                }}
              />
            </Box>
            {/* WhatsApp Widget - Position based on iconPosition */}
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                [isLeft ? "left" : "right"]: 8,
              }}
            >
              <Box
                sx={{
                  width: isIconWithText ? "auto" : 50,
                  height: 50,
                  bgcolor: "#25D366",
                  borderRadius: isIconWithText ? "25px" : "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: isIconWithText ? 1 : 0,
                  mx: isIconWithText ? "0.50rem" : 1,
                  boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
                  px: isIconWithText ? 1.5 : 0,
                  cursor: "pointer",
                  marginBottom: "15px",
                }}
                title={getWhatsAppUrl()}
              >
                <img
                  src={getIconSrc(customIcon)}
                  alt="WhatsApp"
                  style={{
                    width: isIconWithText ? 35 : 28,
                    height: isIconWithText ? 40 : 28,
                    objectFit: "contain",
                  }}
                />
                {isIconWithText && (
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      pr: 0.5,
                    }}
                  >
                    WhatsApp us
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          // Mobile View
          <Box
            sx={{
              flex: 1,
              bgcolor: "white",
              borderRadius: 1,
              border: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
              marginLeft: "10px",
            }}
          >
            {/* Mobile Header */}
            <Box
              sx={{
                bgcolor: "#fafafa",
                borderBottom: "1px solid #e0e0e0",
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{ width: 60, height: 8, bgcolor: "#ddd", borderRadius: 1 }}
              />
              <Box
                sx={{
                  width: 40,
                  height: 8,
                  bgcolor: "#ddd",
                  borderRadius: 1,
                  ml: "auto",
                }}
              />
            </Box>
            {/* Mobile Content */}
            <Box
              sx={{
                flex: 1,
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: "80%",
                  height: 20,
                  bgcolor: "#f0f0f0",
                  borderRadius: 1,
                }}
              />
              <Box
                sx={{
                  width: "60%",
                  height: 20,
                  bgcolor: "#f0f0f0",
                  borderRadius: 1,
                }}
              />
              <Box
                sx={{
                  width: "70%",
                  height: 20,
                  bgcolor: "#f0f0f0",
                  borderRadius: 1,
                }}
              />
            </Box>
            {/* WhatsApp Widget - Position based on iconPosition */}
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                [isLeft ? "left" : "right"]: 8,
              }}
            >
              <Box
                sx={{
                  width: isIconWithText ? "auto" : 50,
                  height: 50,
                  bgcolor: "#25D366",
                  borderRadius: isIconWithText ? "25px" : "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: isIconWithText ? 1 : 0,
                  boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
                  px: isIconWithText ? 1.5 : 0,
                  mx: isIconWithText ? "0.50rem" : 1,
                  cursor: "pointer",
                  marginBottom: "15px",
                }}
                title={getWhatsAppUrl()}
              >
                <img
                  src={getIconSrc(customIcon)}
                  alt="WhatsApp"
                  style={{
                    width: isIconWithText ? 35 : 28,
                    height: isIconWithText ? 40 : 28,
                    objectFit: "contain",
                  }}
                />
                {isIconWithText && (
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      pr: 0.5,
                    }}
                  >
                    WhatsApp us
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
