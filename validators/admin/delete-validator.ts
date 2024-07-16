import { z } from "zod";

export const deleteValidator = z.object({
  id: z
    .string({ required_error: "ID is required" })
    .trim()
    .min(1, { message: "ID is required" }),
  token: z
    .string({ required_error: "Unauthorized" })
    .trim()
    .min(1, { message: "Unauthorized" }),
});
