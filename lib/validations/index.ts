import * as z from "zod"

// Workshop validations
export const workshopCreateSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  type: z.string().min(1, "Workshop type is required"),
  date: z.date().min(new Date(), "Workshop date must be in the future"),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  maxParticipants: z.number().min(2).max(100),
}).refine((data) => {
  const [startHour, startMinute] = data.startTime.split(":").map(Number)
  const [endHour, endMinute] = data.endTime.split(":").map(Number)
  const startTotal = startHour * 60 + startMinute
  const endTotal = endHour * 60 + endMinute
  return endTotal > startTotal
}, "End time must be after start time")

// Poem validations
export const poemCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(10000, "Content must not exceed 10000 characters"),
  tags: z.array(z.string()).max(5, "Maximum 5 tags allowed"),
  form: z.string().optional(),
  isPublished: z.boolean().default(false),
})

// Comment validations
export const commentCreateSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must not exceed 1000 characters"),
})

// Profile validations
export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
  location: z.string().max(100, "Location must not exceed 100 characters").optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  socialLinks: z
    .object({
      twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
      instagram: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
      facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
    })
    .optional(),
})

// Search validations
export const searchQuerySchema = z.object({
  q: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(["recent", "likes", "comments"]).default("recent"),
  theme: z.string().optional(),
  form: z.string().optional(),
  minLength: z.number().min(0).optional(),
  maxLength: z.number().optional(),
}) 