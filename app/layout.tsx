import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Flowboard",
    default: "Flowboard",
  },
  description:
    "Flowboard is a task management tool that helps you manage your tasks and projects.",
  icons: "/icon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(font.variable, "h-full")}
      suppressHydrationWarning
    >
      <body className="min-h-screen subpixel-antialiased h-full">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
