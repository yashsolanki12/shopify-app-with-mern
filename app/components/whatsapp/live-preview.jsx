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
        position: "relative",
        top: 0,
        borderRadius: 3,
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Header with title and info */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          py: { xs: 1, sm: 1.5 },
          px: { xs: 1.5, sm: 2 },
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "13px", sm: "14px" } }}
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
            display: { xs: "none", sm: "block" },
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
        <InfoOutlined
          sx={{
            color: "white",
            fontSize: 20,
            display: { xs: "none", sm: "block" },
          }}
        />
      </Box>

      {/* Info text */}
      <Box
        sx={{
          px: { xs: 1.5, sm: 2 },
        }}
      >
        <Typography
          sx={{
            color: "#666",
            fontSize: "11px",
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
          variant={window.innerWidth < 600 ? "fullWidth" : "standard"}
          centered={window.innerWidth >= 600}
          sx={{
            minHeight: { xs: 32, sm: 36 },
            "& .MuiTab-root": {
              minHeight: { xs: 32, sm: 36 },
              py: 0.5,
              fontSize: "12px",
              px: { xs: 1, sm: 2 },
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
          py: { xs: 1.5, sm: 2 },
          px: { xs: 1.5, sm: 3 },
          bgcolor: "#f5f5f5",
          minHeight:
            viewMode === "desktop"
              ? { xs: 250, sm: 300 }
              : { xs: 350, sm: 400 },
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
                bottom: { xs: 4, sm: 8 },
                [isLeft ? "left" : "right"]: { xs: 4, sm: 8 },
              }}
            >
              <Box
                sx={{
                  width: isIconWithText
                    ? { xs: "auto", sm: "auto" }
                    : { xs: 46, sm: 46 },
                  height: { xs: 46, sm: 46 },
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
                  marginBottom: { xs: "10px", sm: "15px" },
                }}
                title={getWhatsAppUrl()}
              >
                <img
                  src={getIconSrc(customIcon)}
                  alt="WhatsApp"
                  style={{
                    width: isIconWithText ? "30px" : "30px",
                    height: isIconWithText ? "32px" : "30px",
                    objectFit: "contain",
                  }}
                />
                {isIconWithText && (
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: { xs: "13px", sm: "12px" },
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
              marginLeft: { md: "10px" },
              marginRight: {
                md: "10px",
              },
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
                bottom: { xs: 4, sm: 8 },
                [isLeft ? "left" : "right"]: { xs: 4, sm: 8 },
              }}
            >
              <Box
                sx={{
                  width: isIconWithText
                    ? { xs: "auto", sm: "auto" }
                    : { xs: 46, sm: 46 },
                  height: { xs: 46, sm: 46 },
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
                  marginBottom: { xs: "10px", sm: "15px" },
                }}
                title={getWhatsAppUrl()}
              >
                <img
                  src={getIconSrc(customIcon)}
                  alt="WhatsApp"
                  style={{
                    width: isIconWithText ? "30px" : "30px",
                    height: isIconWithText ? "32px" : "30px",
                    objectFit: "contain",
                  }}
                />
                {isIconWithText && (
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: { xs: "13px", sm: "12px" },
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
