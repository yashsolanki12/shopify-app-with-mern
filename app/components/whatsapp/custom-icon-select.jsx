import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function CustomIconSelect({ value, onChange, icons }) {
  return (
    <Card sx={{ mb: 3, borderRadius: "10px" }}>
      <CardContent>
        <Typography
          variant="h2"
          sx={{ fontSize: "14px" }}
          fontWeight={600}
          mb={3.5}
        >
          Custom Chat Icon
        </Typography>
        <RadioGroup
          row
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            display: "flex",
            flexWrap: { xs: "nowrap", sm: "wrap" },
            gap: { xs: 1, sm: 2 },
            justifyContent: "flex-start",
            overflowX: { xs: "auto", sm: "visible" },
            pb: { xs: 1, sm: 0 },
          }}
        >
          {icons.map((icon) => (
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
                    minWidth: { xs: "60px", sm: "auto" },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: "35px", sm: "25px" },
                      height: { xs: "35px", sm: "25px" },
                      borderRadius: "50%",
                      bgcolor: value === icon.value ? "#e8f5e9" : "transparent",
                      border:
                        value === icon.value
                          ? "2px solid #25D366"
                          : "1px solid #ddd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 1,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <img
                      src={icon.src}
                      alt={icon.label}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: { xs: "10px", sm: "12px" } }}
                  >
                    {icon.label}
                  </Typography>
                </Box>
              }
              sx={{
                ml: { xs: 0, sm: 1 },
                mr: { xs: 1, sm: 2 },
              }}
            />
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
