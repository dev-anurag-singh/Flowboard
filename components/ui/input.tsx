import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  error,
  ...props
}: React.ComponentProps<"input"> & { error?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "h-10 w-full min-w-0 rounded-md border border-input/25 bg-transparent px-3 py-2 text-base font-medium file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:border-destructive",
          className
        )}
        {...props}
      />
      {error && (
        <div aria-live="polite" className="text-sm leading-4 text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}

export { Input };
