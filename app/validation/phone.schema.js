import { z } from "zod";

export const phoneSchema = z.object({
  phone_number: z.string().min(1, { message: "Phone number is required" }),

  // .max(15, { message: "Phone number cannot be more then 15 characters" }),
  country_code: z.string().min(1, { message: "Country code is required." }),
  // .max(5, { message: "Country code cannot be more then 4 characters" }),
});
