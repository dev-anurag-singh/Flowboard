"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoardIcon } from "@/icons/board-icon";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { useSuspenseQuery } from "@tanstack/react-query";
// import { boardOptions } from "@/services/boards";
// import { useCreateBoardState } from "@/store/board";

type Board = { id: string; name: string };

const DUMMY_BOARDS: Board[] = [
  { id: "1", name: "Platform Launch" },
  { id: "2", name: "Marketing Plan" },
  { id: "3", name: "Roadmap" },
  { id: "4", name: "Product Backlog" },
  { id: "5", name: "Design System" },
  { id: "6", name: "Engineering" },
  { id: "7", name: "Customer Research" },
  { id: "8", name: "OKRs Q1 2026" },
  { id: "9", name: "Bug Tracker" },
  { id: "10", name: "Onboarding Flow" },
];

export function BoardList() {
  // const { data: boards } = useSuspenseQuery(boardOptions);
  // const { open } = useCreateBoardState();
  const boards = DUMMY_BOARDS;

  const pathname = usePathname();
  const boardsCount = boards.length || 0;

  return (
    <>
      <h4 className="ml-6 text-xs font-bold uppercase lg:ml-8">
        All Boards ({boardsCount})
      </h4>
      <ScrollArea className="min-h-48 basis-full">
        <div className="mb-auto">
          {boards.map(({ name, id }) => (
            <Link
              className={cn(
                "relative mr-5 flex h-12 items-center gap-3 overflow-hidden rounded-r-full px-6 py-4 capitalize transition-colors after:absolute after:left-0 after:top-0 after:h-full after:w-0 after:bg-secondary after:transition-all after:duration-300 hover:text-secondary-foreground hover:after:w-full lg:mr-6 lg:px-8",
                {
                  "pointer-events-none text-primary-foreground after:w-full after:bg-primary":
                    pathname === `/board/${id}`,
                },
              )}
              key={id}
              href={`/board/${id}`}
            >
              <span className="z-10">
                <BoardIcon />
              </span>
              <span className="z-10 overflow-hidden text-ellipsis whitespace-nowrap wrap-break-word text-[15px] font-bold">
                {name}
              </span>
            </Link>
          ))}
          <div className="px-6 lg:px-8">
            {/* <Button onClick={open} variant="link" className="gap-3 p-0"> */}
            <Button variant="link" className="gap-3 p-0">
              <BoardIcon />
              <div className="inline-flex items-center gap-0.5">
                <PlusIcon size={16} className="mt-px" />
                <span className="text-[15px] font-bold">Add New Board</span>
              </div>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
