"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const columns = [
  {
    label: "Todo",
    color: "bg-blue-400",
    tasks: [
      { title: "Build onboarding UI", sub: "0 of 2 subtasks" },
      { title: "Design search pages", sub: "0 of 3 subtasks" },
      { title: "Build settings UI", sub: "0 of 1 subtask" },
    ],
  },
  {
    label: "Doing",
    color: "bg-amber-400",
    tasks: [
      { title: "Design settings", sub: "1 of 3 subtasks" },
      { title: "Add account management", sub: "0 of 2 subtasks" },
      { title: "Design onboarding flow", sub: "1 of 2 subtasks" },
    ],
  },
  {
    label: "Done",
    color: "bg-emerald-400",
    tasks: [
      { title: "Conduct wireframe tests", sub: "2 of 2 subtasks" },
      { title: "Create wireframe prototype", sub: "1 of 1 subtask" },
      { title: "Usability review", sub: "3 of 3 subtasks" },
    ],
  },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Text */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:flex-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
            >
              <Sparkles className="h-3 w-3 text-primary" />
              Organize your team effortlessly
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Your work,
              <br />
              <span className="text-primary">beautifully organized</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg"
            >
              Create boards, add tasks, break them into subtasks, attach notes — and
              see everything laid out as a visual kanban board.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild>
                <Link href="/register">
                  Get started for free
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            </motion.div>
          </div>

          {/* Kanban mockup */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:flex-1"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
            >
              {/* Board header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-sm font-semibold text-foreground">
                  Platform Launch
                </span>
                <div className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                  + Add New Task
                </div>
              </div>

              {/* Columns */}
              <div className="grid grid-cols-3 gap-3 p-4">
                {columns.map((col) => (
                  <div key={col.label}>
                    <div className="mb-3 flex items-center gap-1.5">
                      <div className={`h-2 w-2 rounded-full ${col.color}`} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {col.label}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {col.tasks.map((task) => (
                        <div
                          key={task.title}
                          className="rounded-lg border border-border/60 bg-background p-2.5"
                        >
                          <p className="text-xs font-medium leading-snug text-foreground">
                            {task.title}
                          </p>
                          <p className="mt-1.5 text-[10px] text-muted-foreground">
                            {task.sub}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
