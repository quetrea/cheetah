import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .refine(
      (email) => {
        // List of valid email providers
        const validDomains = [
          "gmail.com",
          "hotmail.com",
          "yahoo.com",
          "outlook.com",
        ];
        const domain = email.split("@")[1];
        return validDomains.includes(domain);
      },
      {
        message: "Please use a valid email provider",
      }
    ),
  password: z.string().min(1, "Required"),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .refine(
      (email) => {
        // List of valid email providers
        const validDomains = [
          "gmail.com",
          "hotmail.com",
          "yahoo.com",
          "outlook.com",
        ];
        const domain = email.split("@")[1];
        return validDomains.includes(domain);
      },
      {
        message: "Please use a valid email provider",
      }
    ),
  password: z.string().min(8, "Minimum of 8 characters required"),
});

export const updateAccountName = z.object({
  name: z.string().trim().min(1, "Required"),
});

export const updateAccountEmailAndPassword = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Minimum of 8 characters required"),
});

export const passwordRecovery = z.object({
  email: z.string().email("Please enter a valid email address"),
  url: z.string().url().optional(),
});

export const updatePasswordRecovery = z.object({
  userId: z.string().min(1, "Required"),
  password: z.string().min(8, "Minimum of 8 characters required"),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(8, "Minimum of 8 characters required"),
  password: z.string().min(8, "Minimum of 8 characters required"),
});
