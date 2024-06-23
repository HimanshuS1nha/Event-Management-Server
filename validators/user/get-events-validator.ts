import { z } from "zod";

export const getEventsValidator = z.object({
  category: z.string({ required_error: "Category is required" }),
});
