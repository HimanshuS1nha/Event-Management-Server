import { z } from "zod";

export const editScannerValidator = z.object({
  oldEmail: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please enter a valid email" }),
  newEmail: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please enter a valid email" }),
  token: z
    .string({ required_error: "Unauthorized" })
    .trim()
    .min(1, { message: "Unauthorized" }),
});
