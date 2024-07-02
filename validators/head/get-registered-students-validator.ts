import { z } from "zod";

export const getRegisteredStudentsValidator = z.object({
  token: z
    .string({ required_error: "Unauthorized" })
    .trim()
    .min(1, { message: "Unauthorized" }),
  eventId: z
    .string({ required_error: "Event ID is required" })
    .trim()
    .min(1, { message: "Event ID is required" }),
});
