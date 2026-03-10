import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function IconPositionSelect({ value, onChange }) {
  const positionOptions = [
    {
      value: "left",
      label: "Left",
      description: "Button appears in bottom left corner",
      icon: (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              border: "2px solid currentColor",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                bgcolor: "currentColor",
                borderRadius: "50%",
              }}
            />
          </Box>
          <Box
            sx={{
              width: 30,
              height: 4,
              bgcolor: "currentColor",
              borderRadius: 2,
            }}
          />
        </Box>
      ),
    },
    {
      value: "right",
      label: "Right",
      description: "Button appears in bottom right corner",
      icon: (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 4,
              bgcolor: "currentColor",
              borderRadius: 2,
            }}
          />
          <Box
            sx={{
              width: 20,
              height: 20,
              border: "2px solid currentColor",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                bgcolor: "currentColor",
                borderRadius: "50%",
              }}
            />
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Card sx={{ mb: 3, borderRadius: "10px" }}>
      <CardContent>
        <Typography
          variant="h2"
          sx={{ fontSize: "14px" }}
          fontWeight={600}
          mb={3.5}
        >
          Position
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
          {positionOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    border: "1px solid #e3e3e3",
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: "10px",
                    backgroundColor:
                      value === option.value ? "#f1f1f1" : "white",
                    minWidth: { xs: "100px", sm: "auto" },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 50, sm: 65 },
                      height: { xs: 35, sm: 40 },
                      borderRadius: 2,
                      bgcolor: "white",
                      border:
                        value === option.value
                          ? "2px solid #25D366"
                          : "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 1,
                      transition: "all 0.2s ease",
                      color: value === option.value ? "#25D366" : "#757575",
                    }}
                  >
                    {option.icon}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: value === option.value ? 600 : 400,
                      color: value === option.value ? "#101412" : "#333",
                      fontSize: "13px",
                    }}
                  >
                    {option.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "11px",
                      color: "#757575",
                      display: { xs: "none", md: "block" },
                      textAlign: "center",
                    }}
                  >
                    {option.description}
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
