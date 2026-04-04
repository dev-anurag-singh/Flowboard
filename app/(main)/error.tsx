"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid h-full place-items-center">
      <div className="max-w-[21rem] space-y-6 text-center">
        <p className="text-[15px] font-bold text-muted-foreground">
          {error.message}
        </p>
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
