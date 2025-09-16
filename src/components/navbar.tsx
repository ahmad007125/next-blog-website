"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-semibold text-lg">
              Blog
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="hover:underline underline-offset-4">
              Home
            </Link>
            <Link href="/categories" className="hover:underline underline-offset-4">
              Categories
            </Link>
            <Link href="/admin" className="hover:underline underline-offset-4">
              Admin
            </Link>
          </nav>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3">
            <Link href="/" onClick={() => setOpen(false)} className={cn("hover:underline underline-offset-4")}>
              Home
            </Link>
            <Link href="/categories" onClick={() => setOpen(false)} className={cn("hover:underline underline-offset-4") }>
              Categories
            </Link>
            <Link href="/admin" onClick={() => setOpen(false)} className={cn("hover:underline underline-offset-4") }>
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}


