"use client"

import { motion } from "motion/react"

const steps = [
  {
    number: "01",
    title: "Create a board",
    description:
      "Set up a board for your project in seconds. Add columns that match how your team works — To Do, In Progress, Done, or anything you like.",
  },
  {
    number: "02",
    title: "Add & organise tasks",
    description:
      "Create tasks, break them into subtasks, and add notes with all the context your team needs. Assign priorities and keep everything in one place.",
  },
  {
    number: "03",
    title: "Track & ship",
    description:
      "Move tasks across columns as work progresses. See the full picture at a glance and know exactly where every piece of work stands.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
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
            How it works
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Up and running in minutes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            No lengthy onboarding, no complicated setup. Just create a board and
            start moving work forward.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid gap-8 sm:grid-cols-3">
          {/* Connector line (desktop) */}
          <div className="absolute top-6 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] hidden h-px bg-border sm:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary">
                {step.number}
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
