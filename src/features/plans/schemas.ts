import { z } from "zod";
import { PlanType } from "./types";

export const createPlanSchema = z.object({
  userId: z.string(),
  planType: z.nativeEnum(PlanType, { required_error: "Required" }),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
});

export const updatePlanSchema = z.object({
  planType: z.nativeEnum(PlanType, { required_error: "Required" }),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
});
