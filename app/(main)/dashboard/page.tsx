"use client";

import { useSidebarStore } from "@/store/sidebar";

export default function DashboardPage() {
  const { openSheet } = useSidebarStore();

  return (
    <div>
      <button onClick={openSheet}>Open Sidebar</button>
    </div>
  );
}
