"use client"

import { useTheme } from "next-themes"
import { motion } from "motion/react"
import { Sun, Moon } from "lucide-react"

type Props = {
  variant?: "navbar" | "sidebar"
}

export function ThemeToggle({ variant = "navbar" }: Props) {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  if (variant === "navbar") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4 dark:hidden" />
        <Moon className="hidden h-4 w-4 dark:block" />
      </button>
    )
  }

  return (
    <div className="grid h-12 place-content-center rounded-md bg-background px-4">
      <div className="flex items-center gap-6">
        <Sun className="h-4 w-4 text-muted-foreground" />
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-5 w-10 cursor-pointer justify-start rounded-xl bg-primary p-[3px] transition-colors hover:bg-primary/80 dark:justify-end"
          aria-label="Toggle theme"
        >
          <motion.div
            layout
            transition={{
              type: "spring",
              stiffness: 700,
              damping: 30,
            }}
            className="h-[14px] w-[14px] rounded-full bg-white"
          />
        </button>
        <Moon className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}
