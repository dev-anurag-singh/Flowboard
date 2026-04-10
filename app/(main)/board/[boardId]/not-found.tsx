import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <Image
        src="/404-error.svg"
        alt="404 - Page not found"
        width={400}
        height={400}
        priority
      />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Board not found</h1>
        <p className="text-sm text-muted-foreground">
          This board doesn&apos;t exist or you don&apos;t have access to it.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    </div>
  );
}
