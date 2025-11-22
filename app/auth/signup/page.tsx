"use client"

import { Logo } from "@/components/ui/logo"
import { SignupForm } from "@/components/signup-form"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const router = useRouter()
  const [toast, setToast] = useState<{ title: string, description: string } | null>(null)

  const handleGoogleSignUp = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/onboarding/profile",
      })

    } catch (error) {
      console.error("Unexpected error:", error)
      setToast({
        title: "Error",
        description: "An unexpected error occurred",
      })
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10">
        <FlickeringGrid
          className="z-0 absolute inset-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#FF3333"
          maxOpacity={0.1}
          flickerChance={0.1}
        />
      </div>

      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="flex justify-center mb-8">
          <a href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground border-2 border-border flex size-10 items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Logo className="size-6" />
            </div>
            <span>Cypheron</span>
          </a>
        </div>

        {/* Signup Form Card */}
        <div className="border-4 border-border bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <SignupForm
            onGoogleSignUp={handleGoogleSignUp}
            WalletButton={
              <div className="w-full">
                {/* Replace with: <ConnectButton className="w-full" /> */}
                <button className="w-full border-2 border-border bg-background hover:bg-muted px-4 py-2 transition-colors">
                  Connect Wallet
                </button>
              </div>
            }
          />
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm hover:underline underline-offset-4">
            ← Back to Home
          </a>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 border-4 border-border bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 max-w-sm">
          <h3 className="mb-1">{toast.title}</h3>
          <p className="text-sm text-muted-foreground">{toast.description}</p>
          <button
            onClick={() => setToast(null)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
