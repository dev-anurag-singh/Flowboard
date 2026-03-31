"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { motion } from "motion/react"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  variant?: "inline" | "card"
}

export function ThemeToggle({ variant = "inline" }: Props) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="h-5 w-10" />

  const isDark = theme === "dark"

  const toggle = (
    <div className="flex items-center gap-6">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <div
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="flex h-5 w-10 cursor-pointer items-center rounded-xl bg-primary p-[3px] transition-colors hover:bg-primary/80"
        style={{ justifyContent: isDark ? "flex-end" : "flex-start" }}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className="h-[14px] w-[14px] rounded-full bg-white"
        />
      </div>
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  )

  if (variant === "card") {
    return (
      <div className={cn("grid place-content-center rounded-md bg-background py-4 mx-3 lg:mx-6")}>
        {toggle}
      </div>
    )
  }

  return toggle
}
