import { z } from 'zod';

export const PoemContentSchema = z.object({
  content: z
    .string()
    .min(1, 'Poem content cannot be empty')
    .max(2000, 'Poem content cannot exceed 2000 characters')
    .refine((content) => {
      // Check for minimum meaningful content (e.g., at least 10 characters excluding whitespace)
      return content.trim().length >= 10;
    }, 'Poem content must be at least 10 characters long'),
});

export const CursorPositionSchema = z.object({
  position: z.number().int().min(0),
  userId: z.string().uuid(),
  userName: z.string().min(1).max(50),
});

export const SelectionSchema = z.object({
  start: z.number().int().min(0),
  end: z.number().int().min(0),
  userId: z.string().uuid(),
  userName: z.string().min(1).max(50),
});

export const CollaborationMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('edit'),
    content: z.string(),
  }),
  z.object({
    type: z.literal('cursor'),
    cursor: CursorPositionSchema,
  }),
  z.object({
    type: z.literal('selection'),
    selection: SelectionSchema,
  }),
  z.object({
    type: z.literal('join'),
    poemId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
  z.object({
    type: z.literal('leave'),
    poemId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
]);

export type PoemContent = z.infer<typeof PoemContentSchema>;
export type CursorPosition = z.infer<typeof CursorPositionSchema>;
export type Selection = z.infer<typeof SelectionSchema>;
export type CollaborationMessage = z.infer<typeof CollaborationMessageSchema>; 