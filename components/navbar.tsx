"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogoSmall } from "@/components/Logo";

export function Navbar() {
  return (
    <div className="flex border-b bg-muted">
      <div className="flex grow items-center justify-between p-4 md:px-6">
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/">
            <LogoSmall />
          </Link>
        </div>
        <h4 className="hidden text-[20px] leading-tight md:block">Dashboard</h4>
        <Button className="gap-1 text-sm md:h-12 md:px-6">
          <Plus strokeWidth={3} className="h-4 w-4 md:h-[15px] md:w-[15px]" />
          <span className="hidden md:inline">Add New Board</span>
        </Button>
      </div>
    </div>
  );
}
