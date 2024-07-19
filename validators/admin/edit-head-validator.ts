import { z } from "zod";

export const editHeadValidator = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Please fill in the name field" }),
  image: z
    .string({ required_error: "Image is required" })
    .trim()
    .min(1, { message: "Please select an image" }),
  phoneNumber: z
    .string({ required_error: "Phone Number is required" })
    .trim()
    .length(10, { message: "Phone Number must be 10 digits long" }),
  token: z
    .string({ required_error: "Unauthorized" })
    .trim()
    .min(1, { message: "Unauthorized" }),
  id: z
    .string({ required_error: "ID is required" })
    .trim()
    .min(1, { message: "ID is required" }),
});
