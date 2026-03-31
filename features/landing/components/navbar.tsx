"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoFull } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-border bg-background/95 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-3 py-3 md:h-16 md:py-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <LogoFull />
          </Link>

          {/* In-page nav */}
          <div className="hidden items-center gap-3 sm:flex md:gap-6">
            {navLinks.map(link => (
              <Button key={link.href} variant="link" asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle variant="navbar" />
            <Button variant="ghost" asChild className="hidden md:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
