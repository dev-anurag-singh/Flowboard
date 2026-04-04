import { db } from "./index"
import { boards, columns, tasks } from "./schema"

type TaskSeed = { title: string; order: number; description?: string }
type ColumnSeed = { name: string; order: number; tasks: TaskSeed[] }
type BoardSeed = { name: string; order: number; isDefault?: boolean; columns: ColumnSeed[] }

async function main() {
  const userId = "e3563798-3550-4b2a-a226-59fa34dcce22"

  // Wipe existing data (order matters because of FKs)
  await db.delete(tasks)
  await db.delete(columns)
  await db.delete(boards)

  const boardsData: BoardSeed[] = [
    {
      name: "My Tasks",
      order: 0,
      isDefault: true,
      columns: [
        {
          name: "To Do",
          order: 1,
          tasks: [
            { title: "Review project brief", order: 1 },
            { title: "Schedule team sync", order: 2 },
          ],
        },
        {
          name: "In Progress",
          order: 2,
          tasks: [{ title: "Respond to design feedback", order: 1 }],
        },
        {
          name: "Done",
          order: 3,
          tasks: [{ title: "Set up dev environment", order: 1 }],
        },
      ],
    },
    {
      name: "Platform Launch",
      order: 1,
      columns: [
        {
          name: "To Do",
          order: 1,
          tasks: [
            { title: "Build UI for onboarding flow", order: 1 },
            { title: "Build UI for search", order: 2 },
            { title: "Build settings UI", order: 3 },
            { title: "QA and test all major user journeys", order: 4 },
          ],
        },
        {
          name: "Doing",
          order: 2,
          tasks: [
            { title: "Design settings and search pages", order: 1 },
            { title: "Add account management endpoints", order: 2 },
            { title: "Design onboarding flow", order: 3 },
            { title: "Add search endpoints", order: 4 },
            { title: "Add authentication endpoints", order: 5 },
            {
              title: "Research pricing points of various competitors and trial different business models",
              order: 6,
            },
          ],
        },
        {
          name: "Done",
          order: 3,
          tasks: [
            { title: "Conduct 5 wireframe tests", order: 1 },
            { title: "Create wireframe prototype", order: 2 },
            { title: "Review results of usability tests and iterate", order: 3 },
            {
              title: "Create paper prototypes and conduct 10 usability tests with potential customers",
              order: 4,
            },
            { title: "Market discovery", order: 5 },
            { title: "Competitor analysis", order: 6 },
            { title: "Research the market", order: 7 },
          ],
        },
      ],
    },
    {
      name: "Marketing Plan",
      order: 2,
      columns: [
        {
          name: "To Do",
          order: 1,
          tasks: [
            { title: "Plan product hunt launch", order: 1 },
            { title: "Write launch blog post", order: 2 },
          ],
        },
        {
          name: "Doing",
          order: 2,
          tasks: [{ title: "Design social media assets", order: 1 }],
        },
        {
          name: "Done",
          order: 3,
          tasks: [{ title: "Competitor analysis", order: 1 }],
        },
      ],
    },
    {
      name: "Roadmap",
      order: 3,
      columns: [
        {
          name: "Now",
          order: 1,
          tasks: [
            { title: "Launch MVP", order: 1 },
            { title: "Onboard beta users", order: 2 },
          ],
        },
        {
          name: "Next",
          order: 2,
          tasks: [
            { title: "Mobile app", order: 1 },
            { title: "Integrations", order: 2 },
          ],
        },
        {
          name: "Later",
          order: 3,
          tasks: [{ title: "AI features", order: 1 }],
        },
      ],
    },
  ]

  for (const b of boardsData) {
    const [createdBoard] = await db
      .insert(boards)
      .values({ name: b.name, order: b.order, isDefault: b.isDefault ?? false, userId })
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
