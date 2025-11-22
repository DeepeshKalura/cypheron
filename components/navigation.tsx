"use client";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

export function Navigation() {
  return (
    <ResizableNavbar className="top-4">
      <NavBody>
        <div className="flex w-full items-center justify-between">
          <NavbarLogo />
          <div className="flex items-center gap-4">
            <NavbarButton href="/marketplace" variant="secondary" className="hidden sm:block">
              Marketplace
            </NavbarButton>
            <NavbarButton href="/upload" variant="secondary" className="hidden sm:block">
              Upload
            </NavbarButton>
            <NavbarButton href="/dashboard" variant="secondary" className="hidden sm:block">
              Dashboard
            </NavbarButton>
            <NavbarButton className="bg-black dark:bg-white text-white dark:text-black">
              Connect Wallet
            </NavbarButton>
          </div>
        </div>
      </NavBody>
    </ResizableNavbar>
  );
}
