"use client"

import { useWallet } from "@mysten/wallet-kit"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Wallet } from "lucide-react"
import { useState } from "react"

export function WalletConnectButton() {
  const { currentAccount, connect, disconnect } = useWallet()
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connect()

      // Link wallet to user account if authenticated
      if (session?.user?.email && currentAccount?.address) {
        const response = await fetch("/api/wallet/link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress: currentAccount.address,
          }),
        })

        if (response.ok) {
          toast({
            title: "Wallet connected",
            description: "Your wallet is now linked to your account",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  if (currentAccount) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground/70">
          {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
        </span>
        <Button onClick={handleDisconnect} variant="outline" size="sm" className="border-border bg-transparent">
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={handleConnect} disabled={isConnecting} variant="outline" className="border-border bg-transparent">
      <Wallet className="h-4 w-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
