import Link from "next/link"
import { LogoFull } from "@/components/Logo"

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 py-10 sm:flex-row sm:justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <LogoFull />
          </Link>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </a>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-foreground transition-colors">
              Get started
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Flowboard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
