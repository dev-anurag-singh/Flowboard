import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(255),
  description: z.string().max(2000).optional(),
  columnId: z.string().uuid("Invalid column"),
  boardId: z.string().uuid("Invalid board"),
  subtasks: z
    .array(z.object({ title: z.string().min(1, "Subtask title is required").max(255) }))
    .optional(),
});

export type TCreateTaskSchema = z.infer<typeof CreateTaskSchema>;
