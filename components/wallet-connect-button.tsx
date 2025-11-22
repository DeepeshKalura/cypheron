"use client"

import { ConnectButton, useCurrentAccount, useDisconnectWallet, useSignPersonalMessage } from "@mysten/dapp-kit"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"

export function WalletConnectButton() {
  const currentAccount = useCurrentAccount()
  const { mutate: disconnect } = useDisconnectWallet()
  const { data: session } = useSession()
  const { toast } = useToast()
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage()

  useEffect(() => {
    const linkWallet = async () => {
      if (session?.user?.email && currentAccount?.address) {
        // Optional: You might want to sign a message to prove ownership before linking
        // const message = new TextEncoder().encode(`Link wallet ${currentAccount.address} to ${session.user.email}`)
        // const signature = await signPersonalMessage({ message })

        const response = await fetch("/api/wallet/link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress: currentAccount.address,
            // signature: signature.signature,
          }),
        })

        if (response.ok) {
          toast({
            title: "Wallet connected",
            description: "Your wallet is now linked to your account",
          })
        }
      }
    }

    linkWallet()
  }, [currentAccount, session, toast])

  // Using the default ConnectButton from dapp-kit for simplicity and better UX
  // It handles the modal, connection state, etc.
  return (
    <ConnectButton
      className="!bg-black dark:!bg-white !text-white dark:!text-black !border-2 !border-black dark:!border-white !h-9 !px-4 !py-2 !text-sm !font-medium hover:!opacity-80 !transition-opacity"
    />
  )
}
