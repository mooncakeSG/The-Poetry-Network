import { z } from "zod";

export const moodSchema = z.object({
  mood: z.string(),
  notes: z.string().optional(),
  intensity: z.enum(["Positive", "Neutral", "Struggling"]),
});

export const moodQuerySchema = z.object({
  userId: z.string(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().min(1).max(100).default(30),
});

export type MoodInput = z.infer<typeof moodSchema>;
export type MoodQuery = z.infer<typeof moodQuerySchema>; 