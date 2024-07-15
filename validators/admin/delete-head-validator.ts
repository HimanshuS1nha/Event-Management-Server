import { z } from "zod";

export const deleteHeadValidator = z.object({
  id: z
    .string({ required_error: "ID is required" })
    .trim()
    .min(1, { message: "ID is required" }),
  token: z
    .string({ required_error: "Unauthorized" })
    .trim()
    .min(1, { message: "Unauthorized" }),
});
