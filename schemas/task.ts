import { z } from "zod";

export const CreateTaskSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1, "Task title is required").max(255),
  description: z.string().max(2000).optional(),
  boardId: z.uuid("Invalid board"),
  columnId: z.uuid().optional(),
  parentId: z.uuid().optional(),
});

export type CreateTaskItem = z.infer<typeof CreateTaskSchema>;
