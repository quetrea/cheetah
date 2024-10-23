import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Required"),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.string().email(),
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
  email: z.string().email(),
});

export const updatePasswordRecovery = z.object({
  password: z.string().min(8, "Minimum of 8 characters required"),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(8, "Minimum of 8 characters required"),
  password: z.string().min(8, "Minimum of 8 characters required"),
});