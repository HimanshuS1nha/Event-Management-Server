import { z } from "zod";

export const editProfileValidatorUser = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Please fill the name field" }),
  image: z
    .string({ required_error: "Image is required" })
    .trim()
    .min(1, { message: "Image is required" }),
  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .length(10, { message: "Phone number must be 10 digits long" }),
  branch: z
    .string({ required_error: "Branch is required" })
    .min(1, { message: "Please select a branch" }),
  year: z
    .string({ required_error: "Year is required" })
    .min(1, { message: "Please select a year" }),
  rollNo: z
    .string({ required_error: "Roll number is required" })
    .min(1, { message: "Please fill in the roll number field" }),
  token: z
    .string({ required_error: "Unauthorized" })
    .trim()
    .min(1, { message: "Unauthorized" }),
});

export const editProfileValidatorHead = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Name is required" }),
  image: z
    .string({ required_error: "Image is required" })
    .trim()
    .min(1, { message: "Image is required" }),
  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .length(10, { message: "Phone number must be of 10 digits" }),
  token: z
    .string({ required_error: "Unauthorized" })
    .trim()
    .min(1, { message: "Unauthorized" }),
});
