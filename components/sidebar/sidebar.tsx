"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { LogoSmall } from "@/components/Logo";
import { useSidebarStore } from "@/store/sidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsClient, useMediaQuery } from "usehooks-ts";
import { useEffect } from "react";
import { BoardList } from "@/components/sidebar/board-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { IconEye } from "@/icons/icon-eye";

function SidebarContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="p-6 pt-0 lg:px-8">
        <Link href="/dashboard" className="inline-flex items-center">
          <LogoSmall />
          <span className="ml-4 text-2xl leading-none text-foreground">
            Flowboard
          </span>
        </Link>
      </div>

      <BoardList />

      <ThemeToggle variant="sidebar" />

      <button
        onClick={onClose}
        className="relative z-10 mr-5 flex items-center gap-4 rounded-r-full px-6 py-4 text-[15px] font-bold transition-colors after:absolute after:left-0 after:top-0 after:-z-10 after:h-full after:w-0 after:rounded-r-full after:bg-secondary after:transition-all after:duration-300 hover:text-secondary-foreground hover:after:w-full lg:mr-6 lg:px-8"
      >
        <IconEye />
        Hide Sidebar
      </button>
    </div>
  );
}

export function Sidebar() {
  const { isOpen, close, isSheetOpen, closeSheet } = useSidebarStore();
  const isClient = useIsClient();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isDesktop) closeSheet();
  }, [isDesktop, closeSheet]);

  const variants = {
    open: { marginLeft: 0 },
    closed: { marginLeft: "calc(var(--sidebar-width) * -1)" },
  };

  if (!isClient) {
    return (
      <motion.div
        initial={false}
        animate="open"
        variants={variants}
        transition={{ duration: 0.5 }}
        className="hidden shrink-0 basis-(--sidebar-width) flex-col gap-5 overflow-hidden border-r bg-muted py-8 text-muted-foreground md:flex"
      >
        <SidebarContent onClose={close} />
      </motion.div>
    );
  }

  if (!isDesktop) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={open => !open && closeSheet()}>
        <SheetContent
          side="left"
          className="w-full! max-w-[400px] bg-muted py-6 pb-4"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onClose={closeSheet} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={variants}
      transition={{ duration: 0.5 }}
      className="flex shrink-0 basis-(--sidebar-width) flex-col gap-5 overflow-hidden border-r bg-muted py-8 text-muted-foreground"
    >
      <SidebarContent onClose={close} />
    </motion.div>
  );
}
