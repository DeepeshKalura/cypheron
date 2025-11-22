"use client";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { WalletConnectButton } from "@/components/wallet-connect-button";

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
            <WalletConnectButton />
          </div>
        </div>
      </NavBody>
    </ResizableNavbar>
  );
}
