"use client"

import { motion } from "motion/react"
import { LayoutGrid, ListChecks, FileText, Kanban } from "lucide-react"

const features = [
  {
    icon: LayoutGrid,
    title: "Smart Boards",
    description:
      "Create separate boards for every project. Keep your work contexts clean and organized with custom columns.",
  },
  {
    icon: ListChecks,
    title: "Tasks & Subtasks",
    description:
      "Break any task into subtasks. Track granular progress and never lose sight of what still needs doing.",
  },
  {
    icon: FileText,
    title: "Notes & Context",
    description:
      "Attach rich notes to any task. All the context you need lives right next to the work, not in a separate doc.",
  },
  {
    icon: Kanban,
    title: "Visual Workflow",
    description:
      "See your entire project at a glance. Drag tasks across columns as work progresses from idea to done.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Flowboard keeps it simple — powerful enough for complex projects,
            clean enough that your team will actually use it.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
