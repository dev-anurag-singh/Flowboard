"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-48 w-72 rounded-full bg-primary/10 blur-2xl sm:h-80 sm:w-[500px] lg:h-[500px] lg:w-[800px] lg:blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-xl lg:blur-[80px]" />
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
              Create boards, add tasks, break them into subtasks, attach notes —
              and see everything laid out as a visual kanban board.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild>
                <Link href="/signup">
                  Get started for free
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            </motion.div>
          </div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:flex-1"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-xl shadow-2xl overflow-hidden"
            >
              <Image
                src="/hero-light.webp"
                alt="Flowboard kanban board"
                width={2880}
                height={2048}
                priority
                className="w-full h-auto dark:hidden"
              />
              <Image
                src="/hero-dark.webp"
                alt="Flowboard kanban board"
                width={2880}
                height={2048}
                priority
                className="w-full h-auto hidden dark:block"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
