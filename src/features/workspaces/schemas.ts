import { z } from "zod";

// Tarayıcı ortamında olup olmadığını kontrol et
const isBrowser = typeof window !== "undefined";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z
    .union([
      isBrowser ? z.instanceof(File) : z.never(),  // Sadece tarayıcıda geçerli
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
  image: z
    .union([
      isBrowser ? z.instanceof(File) : z.never(),  // Sadece tarayıcıda geçerli
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
