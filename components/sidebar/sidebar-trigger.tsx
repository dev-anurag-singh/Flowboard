"use client"

import { motion } from "motion/react"
import { useSidebarStore } from "@/store/sidebar"
import { IconEyeOpen } from "@/icons/icon-eye-open"

export function SidebarTrigger() {
  const { isOpen, open } = useSidebarStore()

  if (isOpen) return null

  return (
    <motion.button
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      onClick={open}
      className="absolute bottom-8 left-0 z-10 hidden h-12 w-14 place-content-center rounded-r-full bg-primary text-primary-foreground transition-colors hover:bg-primary/70 md:grid"
    >
      <IconEyeOpen />
    </motion.button>
  )
}
