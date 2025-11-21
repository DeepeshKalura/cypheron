"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-primary hover:text-primary/80 transition"
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground">CV</span>
            </div>
            CryptoVault
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-sm text-foreground/70 hover:text-foreground transition">
              Marketplace
            </Link>
            <Link href="/upload" className="text-sm text-foreground/70 hover:text-foreground transition">
              Upload Data
            </Link>
            <Link href="/dashboard" className="text-sm text-foreground/70 hover:text-foreground transition">
              Dashboard
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="sm" className="border-border bg-transparent">
              Sign In
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Connect Wallet
            </Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-4">
            <Link href="/marketplace" className="text-sm text-foreground/70 hover:text-foreground transition">
              Marketplace
            </Link>
            <Link href="/upload" className="text-sm text-foreground/70 hover:text-foreground transition">
              Upload Data
            </Link>
            <Link href="/dashboard" className="text-sm text-foreground/70 hover:text-foreground transition">
              Dashboard
            </Link>
            <Button variant="outline" size="sm" className="w-full border-border bg-transparent">
              Sign In
            </Button>
            <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Connect Wallet
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
