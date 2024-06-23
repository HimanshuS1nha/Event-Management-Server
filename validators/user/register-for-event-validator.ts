import { z } from "zod";

export const registerValidator = z.object({
  eventId: z
    .string({ required_error: "Event is required" })
    .trim()
    .min(1, { message: "Event is required" }),
  token: z
    .string({ required_error: "Unauthorized" })
    .trim()
    .min(1, { message: "Unauthorized" }),
});
