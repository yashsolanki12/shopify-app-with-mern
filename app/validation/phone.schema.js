import { z } from "zod";

export const phoneSchema = z.object({
  phone_number: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^\d+$/, { message: "Only digits are allowed in phone number" }),

  country_code: z
    .string()
    .min(1, { message: "Country code is required." })
    .regex(/^\+\d{1,4}$/, {
      message:
        "Country code must start with '+' followed by 1 to 4 digits (e.g., +91).",
    }),
});
