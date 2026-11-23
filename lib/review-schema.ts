import { z } from "zod";

export const reviewSchema = z.object({
  clientName: z.string().trim().min(2).max(80),
  suburb: z.string().trim().max(80).optional().default(""),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(2000),
  published: z.boolean(),
  sortOrder: z.coerce.number().int().min(-10000).max(10000),
});

export const reviewPublishSchema = z.object({
  published: z.boolean(),
});
