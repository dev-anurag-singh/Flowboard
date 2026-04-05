import { z } from "zod";

export const CreateBoardSchema = z.object({
  name: z.string().min(1, "Board name is required").max(100),
  columns: z.array(z.object({ name: z.string().min(1, "Column name is required") })),
});

export type TCreateBoardSchema = z.infer<typeof CreateBoardSchema>;
