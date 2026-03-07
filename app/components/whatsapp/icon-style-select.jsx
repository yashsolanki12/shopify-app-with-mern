import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function IconStyleSelect({ value, onChange, getIconSrc }) {
  const isIconWithText = value === "icon_with_text";

  return (
    <Card sx={{ mb: 3, borderRadius: "10px" }}>
      <CardContent>
        <Typography
          variant="h2"
          sx={{ fontSize: "14px" }}
          fontWeight={600}
          mb={3.5}
        >
          Chat Icon Style
        </Typography>
        <RadioGroup
          row
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "flex-start",
          }}
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
                    src={getIconSrc("whatsapp")}
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
                  src={getIconSrc("whatsapp")}
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
      </CardContent>
    </Card>
  );
}
