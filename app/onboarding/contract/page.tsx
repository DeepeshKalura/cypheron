"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export default function ContractOnboarding() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [toast, setToast] = useState<{ title: string, description: string, variant?: string } | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployStatus, setDeployStatus] = useState<"idle" | "deploying" | "success" | "error">("idle")
  const [contractAddress, setContractAddress] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "unauthenticated") {
    return null
  }

  const handleDeployContract = async () => {
    setIsDeploying(true)
    setDeployStatus("deploying")

    try {
      const response = await fetch("/api/contracts/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) throw new Error("Failed to deploy contract")

      const data = await response.json()
      setContractAddress(data.contractAddress)
      setDeployStatus("success")

      setToast({
        title: "Smart contract deployed!",
        description: "Your marketplace contract is now ready to use.",
      })

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      setDeployStatus("error")
      setToast({
        title: "Deployment failed",
        description: "Could not deploy smart contract. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const handleSkip = () => {
    router.push("/dashboard")
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

        {/* Contract Card */}
        <div className="border-4 border-border bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <div className="mb-6">
            <h1 className="mb-2">Deploy Smart Contract</h1>
            <p className="text-muted-foreground text-sm">
              Create your marketplace contract on Sui testnet
            </p>
          </div>

          <div className="space-y-4">
            {deployStatus === "idle" && (
              <div className="border-2 border-accent bg-accent/10 p-4 flex gap-3">
                <AlertCircle className="size-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">
                    We'll deploy a smart contract to the Sui testnet under your account. This allows you to list and sell datasets securely.
                  </p>
                </div>
              </div>
            )}

            {deployStatus === "deploying" && (
              <div className="flex flex-col items-center justify-center space-y-3 py-8">
                <Spinner size="lg" />
                <p className="text-sm text-muted-foreground">Deploying contract to Sui testnet...</p>
                <p className="text-xs text-muted-foreground">This may take a few moments</p>
              </div>
            )}

            {deployStatus === "success" && (
              <div className="border-2 border-[#00cc00] bg-[#00cc00]/10 p-4 flex gap-3">
                <CheckCircle2 className="size-5 text-[#00cc00] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">
                    Contract deployed successfully! Redirecting to dashboard...
                  </p>
                </div>
              </div>
            )}

            {deployStatus === "error" && (
              <div className="border-2 border-destructive bg-destructive/10 p-4 flex gap-3">
                <AlertCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">
                    Failed to deploy contract. Please check your wallet connection and try again.
                  </p>
                </div>
              </div>
            )}

            {contractAddress && (
              <div className="border-2 border-border bg-muted p-4">
                <p className="text-xs mb-2">Contract Address:</p>
                <p className="text-xs break-all font-mono">{contractAddress}</p>
              </div>
            )}

            <div className="flex gap-3">
              {deployStatus !== "success" && (
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isDeploying}
                  className="flex-1 border-2"
                >
                  Skip for now
                </Button>
              )}
              <Button
                onClick={handleDeployContract}
                disabled={isDeploying || deployStatus === "success"}
                className={deployStatus !== "success" ? "flex-1" : "w-full"}
              >
                {deployStatus === "deploying" ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" />
                    Deploying...
                  </span>
                ) : deployStatus === "success" ? (
                  "Deployed!"
                ) : (
                  "Deploy Contract"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a href="/onboarding/profile" className="text-sm hover:underline underline-offset-4">
            ← Back to Profile
          </a>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 border-4 ${toast.variant === 'destructive' ? 'border-destructive' : 'border-border'} bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 max-w-sm`}>
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
