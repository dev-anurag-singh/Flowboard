import { z } from "zod";

export const CreateTaskSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().min(1, "Task title is required").max(255),
  description: z.string().max(2000).optional(),
  columnId: z.uuid("Invalid column").optional(),
  boardId: z.uuid("Invalid board"),
  subtasks: z
    .array(z.object({ title: z.string().min(1, "Subtask title is required").max(255) }))
    .optional(),
  parentId: z.uuid().optional(),
});

export type TCreateTaskSchema = z.infer<typeof CreateTaskSchema>;
