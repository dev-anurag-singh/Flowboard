"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-xs font-bold peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground dark:text-white",
        className
      )}
      {...props}
    />
  );
}

export { Label };
