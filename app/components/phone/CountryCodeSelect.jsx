import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  ListItemText,
  Box,
} from "@mui/material";
import ReactCountryFlag from "react-country-flag";
import { COUNTRIES } from "../../utils/helper";

// Filter countries that have dial codes
const COUNTRIES_WITH_CODES = COUNTRIES.filter(
  (country) => country.dialCodes && country.dialCodes.length > 0,
);

// Default to India
const DEFAULT_COUNTRY =
  COUNTRIES_WITH_CODES.find((c) => c.code === "IN") || COUNTRIES_WITH_CODES[0];

export default function CountryCodeSelect({ value, onChange, error }) {
  // Get the dial code from the value (e.g., "+91")
  const getCountryFromValue = (val) => {
    // Handle undefined, null, or non-string values
    if (val == null || typeof val !== "string") {
      return DEFAULT_COUNTRY;
    }

    // If value is empty, return default but signal to use it
    if (val === "") {
      return DEFAULT_COUNTRY;
    }

    // If value starts with +, find country by dial code
    if (val.startsWith("+")) {
      const country = COUNTRIES_WITH_CODES.find(
        (c) => c.dialCodes && c.dialCodes.includes(val),
      );
      return country || DEFAULT_COUNTRY;
    }

    // Otherwise try to find by country code
    const countryByCode = COUNTRIES_WITH_CODES.find((c) => c.code === val);
    return countryByCode || DEFAULT_COUNTRY;
  };

  const selectedCountry = getCountryFromValue(value);

  // If value is empty but we have a default, use the default
  React.useEffect(() => {
    if (
      (!value || value === "") &&
      onChange &&
      selectedCountry?.dialCodes?.[0]
    ) {
      onChange(selectedCountry.dialCodes[0]);
    }
  }, []);

  const handleChange = (event) => {
    const countryCode = event.target.value;
    const country = COUNTRIES_WITH_CODES.find((c) => c.code === countryCode);
    if (
      country &&
      country.dialCodes &&
      country.dialCodes.length > 0 &&
      onChange
    ) {
      // Get the first dial code
      onChange(country.dialCodes[0]);
    }
  };

  return (
    <FormControl fullWidth error={!!error} sx={{ width: "fit-content" }}>
      <Select
        value={selectedCountry?.code || "IN"}
        onChange={handleChange}
        displayEmpty
        sx={{
          height: "56px",
          fontSize: "16px",
          // maxWidth: "130px",
          width: "fit-content",
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            gap: 1,
            py: 1.5,
          },
        }}
        renderValue={() => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "fit-content",
            }}
          >
            <ReactCountryFlag
              countryCode={selectedCountry?.code || "IN"}
              svg
              style={{
                width: "24px",
                height: "18px",
                borderRadius: "2px",
              }}
            />
            <Box component="span" sx={{ fontWeight: 500 }}>
              {selectedCountry?.dialCodes?.[0] || "+91"}
            </Box>
            {/* <Box
              component="span"
              sx={{ color: "text.secondary", fontSize: "14px" }}
            >
              ({selectedCountry?.name || "India"})
            </Box> */}
          </Box>
        )}
      >
        {COUNTRIES_WITH_CODES.map((country) => (
          <MenuItem
            key={country.code}
            value={country.code}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              py: 1.5,
              width: "fit-content",
            }}
          >
            <ReactCountryFlag
              countryCode={country.code}
              svg
              style={{
                width: "24px",
                height: "18px",
                borderRadius: "2px",
              }}
            />
            <ListItemText
              primary={`${country.name} (${country.dialCodes?.[0] || ""})`}
              primaryTypographyProps={{
                fontSize: "14px",
              }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
