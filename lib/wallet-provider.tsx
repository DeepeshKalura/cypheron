"use client"

import { WalletProvider as SuiWalletProvider } from "@mysten/wallet-kit"
import type React from "react"

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return <SuiWalletProvider>{children}</SuiWalletProvider>
}
