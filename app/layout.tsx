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
});

export const metadata: Metadata = {
  title: "Flowboard",
  description: "Organize your work, your way.",
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
      <body className="min-h-screen antialiased h-full">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
