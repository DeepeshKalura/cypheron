"use client"

import * as React from "react"
import { SessionProvider } from "next-auth/react"
import { WalletProvider } from "@/lib/wallet-provider"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <WalletProvider>
                {children}
                <Toaster />
            </WalletProvider>
        </SessionProvider>
    )
}
