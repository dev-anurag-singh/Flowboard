"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoardIcon } from "@/icons/board-icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { boardsQueryOptions } from "@/features/boards/queries";
import { CreateBoardModal } from "@/features/boards/components/create-board";

export function BoardList() {
  const { data: boards = [] } = useQuery(boardsQueryOptions);
  const pathname = usePathname();

  return (
    <>
      <h4 className="ml-6 text-xs font-bold uppercase lg:ml-8">
        All Boards ({boards.length})
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
            <CreateBoardModal />
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
