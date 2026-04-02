import { db } from "./index"
import { boards, columns, tasks } from "./schema"

type TaskSeed = { title: string; order: number; description?: string }
type ColumnSeed = { name: string; order: number; tasks: TaskSeed[] }
type BoardSeed = { name: string; order: number; columns: ColumnSeed[] }

async function main() {
  // Replace with your real user's uuid from the db
  const userId = "cmf88evsg0002uh6h2c407buf"

  // Wipe existing data (order matters because of FKs)
  await db.delete(tasks)
  await db.delete(columns)
  await db.delete(boards)

  const boardsData: BoardSeed[] = [
    {
      name: "Project Alpha",
      order: 1,
      columns: [
        {
          name: "To Do",
          order: 1,
          tasks: [
            { title: "Setup repo", order: 1 },
            { title: "Install dependencies", order: 2 },
          ],
        },
        {
          name: "In Progress",
          order: 2,
          tasks: [{ title: "Build authentication", order: 1 }],
        },
        {
          name: "Done",
          order: 3,
          tasks: [{ title: "Write documentation", order: 1 }],
        },
      ],
    },
    {
      name: "Marketing Campaign",
      order: 2,
      columns: [
        {
          name: "Ideas",
          order: 1,
          tasks: [
            { title: "Brainstorm slogans", order: 1 },
            { title: "Research competitors", order: 2 },
          ],
        },
        {
          name: "Ongoing",
          order: 2,
          tasks: [{ title: "Design social media posts", order: 1 }],
        },
        {
          name: "Completed",
          order: 3,
          tasks: [{ title: "Email campaign draft", order: 1 }],
        },
      ],
    },
    {
      name: "Personal Tasks",
      order: 3,
      columns: [
        {
          name: "Backlog",
          order: 1,
          tasks: [
            { title: "Buy groceries", order: 1 },
            { title: "Book dentist appointment", order: 2 },
          ],
        },
        {
          name: "In Progress",
          order: 2,
          tasks: [{ title: "Read Drizzle docs", order: 1 }],
        },
        {
          name: "Done",
          order: 3,
          tasks: [{ title: "Morning workout", order: 1 }],
        },
      ],
    },
  ]

  for (const b of boardsData) {
    const [createdBoard] = await db
      .insert(boards)
      .values({ name: b.name, order: b.order, userId })
      .returning()

    for (const c of b.columns) {
      const [createdColumn] = await db
        .insert(columns)
        .values({ name: c.name, order: c.order, userId, boardId: createdBoard.id })
        .returning()

      for (const t of c.tasks) {
        await db.insert(tasks).values({
          title: t.title,
          description: t.description ?? null,
          order: t.order,
          userId,
          columnId: createdColumn.id,
          boardId: createdBoard.id,
        })
      }
    }
  }

  console.log("Seed complete")
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
