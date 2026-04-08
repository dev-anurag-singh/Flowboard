import { db } from "./index"
import { boards, columns, tasks } from "./schema"

type SubtaskSeed = { title: string; order: number }
type TaskSeed = { title: string; order: number; description?: string; subtasks?: SubtaskSeed[] }
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
            {
              title: "Review project brief",
              order: 1,
              description: "Go through the full project brief and make sure all requirements are understood before the kickoff meeting.",
              subtasks: [
                { title: "Read through requirements doc", order: 1 },
                { title: "Clarify open questions with stakeholders", order: 2 },
              ],
            },
            {
              title: "Schedule team sync",
              order: 2,
              description: "Set up a recurring weekly sync with the team to align on progress and blockers.",
            },
          ],
        },
        {
          name: "In Progress",
          order: 2,
          tasks: [
            {
              title: "Respond to design feedback",
              order: 1,
              description: "Address the feedback from the last design review session and update the Figma file accordingly.",
              subtasks: [
                { title: "Update button styles", order: 1 },
                { title: "Fix spacing on mobile", order: 2 },
              ],
            },
          ],
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
            {
              title: "Build UI for onboarding flow",
              order: 1,
              description: "Implement the full onboarding UI based on the approved Figma designs, including all steps and transitions.",
              subtasks: [
                { title: "Design welcome screen", order: 1 },
                { title: "Build step indicators", order: 2 },
                { title: "Add skip option", order: 3 },
              ],
            },
            { title: "Build UI for search", order: 2 },
            { title: "Build settings UI", order: 3 },
            { title: "QA and test all major user journeys", order: 4, description: "Run end-to-end tests across all critical user flows — signup, onboarding, core features, and edge cases." },
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
              description: "Analyse at least 5 competitors across pricing tiers, features, and positioning to inform our own pricing strategy.",
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
        const [createdTask] = await db
          .insert(tasks)
          .values({
            title: t.title,
            description: t.description ?? null,
            order: t.order,
            userId,
            columnId: createdColumn.id,
            boardId: createdBoard.id,
            parentId: null,
          })
          .returning()

        if (t.subtasks?.length) {
          await db.insert(tasks).values(
            t.subtasks.map((s) => ({
              title: s.title,
              order: s.order,
              userId,
              boardId: createdBoard.id,
              parentId: createdTask.id,
            })),
          )
        }
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
