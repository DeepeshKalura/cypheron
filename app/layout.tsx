import type React from "react"
import type { Metadata } from "next"
import { Providers } from "@/components/providers"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { DM_Sans as V0_Font_DM_Sans, Space_Mono as V0_Font_Space_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

const _dmSans = V0_Font_DM_Sans({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900", "1000"], variable: '--font-dm-sans' })
const _spaceMono = V0_Font_Space_Mono({ subsets: ['latin'], weight: ["400", "700"], variable: '--font-space-mono' })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200", "300", "400", "500", "600", "700", "800", "900"], variable: '--font-source-serif-4' })

export const metadata: Metadata = {
  title: "Cypheron - Decentralized Data Marketplace",
  description: "Trade encrypted data on the blockchain with zero-knowledge proofs. Secure, trustless, and verifiable data marketplace powered by Sui.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logo.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body className={`font-sans antialiased bg-background text-foreground ${_dmSans.variable} ${_spaceMono.variable} ${_sourceSerif_4.variable}`}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
