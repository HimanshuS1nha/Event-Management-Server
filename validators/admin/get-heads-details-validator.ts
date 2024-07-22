import { z } from "zod";

export const getHeadsDetailsValidator = z.object({
  token: z
    .string({ required_error: "Unauthorized" })
    .trim()
    .min(1, { message: "Unauthorized" }),
  heads: z.array(z.string()),
});
