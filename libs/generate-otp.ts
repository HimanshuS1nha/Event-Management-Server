import { generate } from "otp-generator";

export const generateOtp = async () => {
  const otp = generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    specialChars: false,
    upperCaseAlphabets: false,
  });

  return parseInt(otp);
};
