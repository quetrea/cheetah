import { z } from "zod";

// Tarayıcı ortamında olup olmadığını kontrol et
const isBrowser = typeof window !== "undefined";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z
    .union([
      isBrowser ? z.instanceof(File) : z.never(),  // Sadece tarayıcıda geçerli
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Required").optional(),
  image: z
    .union([
      isBrowser ? z.instanceof(File) : z.never(),  // Sadece tarayıcıda geçerli
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
