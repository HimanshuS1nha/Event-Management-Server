import { z } from "zod";

export const scannerValidator = z.object({
  id: z
    .string({ required_error: "ID is required" })
    .trim()
    .min(8, { message: "ID is required" }),
  token: z
    .string({ required_error: "Unauthorized" })
    .trim()
    .min(8, { message: "Unauthorized" }),
});
