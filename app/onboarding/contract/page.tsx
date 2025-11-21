"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

export default function ContractOnboarding() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployStatus, setDeployStatus] = useState<"idle" | "deploying" | "success" | "error">("idle")
  const [contractAddress, setContractAddress] = useState("")

  if (status === "unauthenticated") {
    router.push("/auth/signin")
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

      toast({
        title: "Smart contract deployed!",
        description: "Your marketplace contract is now ready to use.",
      })

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      setDeployStatus("error")
      toast({
        title: "Deployment failed",
        description: "Could not deploy smart contract. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4">
      <div className="max-w-md mx-auto mt-20">
        <Card className="border-slate-700 bg-slate-900">
          <CardHeader>
            <CardTitle>Deploy Smart Contract</CardTitle>
            <CardDescription>Create your marketplace contract on Sui testnet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {deployStatus === "idle" && (
              <Alert className="border-blue-700 bg-blue-900/20">
                <AlertCircle className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-300">
                  We'll deploy a smart contract to the Sui testnet under your account.
                </AlertDescription>
              </Alert>
            )}

            {deployStatus === "deploying" && (
              <div className="flex flex-col items-center justify-center space-y-2 py-4">
                <Spinner />
                <p className="text-sm text-slate-300">Deploying contract...</p>
              </div>
            )}

            {deployStatus === "success" && (
              <Alert className="border-green-700 bg-green-900/20">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">Contract deployed successfully!</AlertDescription>
              </Alert>
            )}

            {deployStatus === "error" && (
              <Alert className="border-red-700 bg-red-900/20" variant="destructive">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  Failed to deploy contract. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {contractAddress && (
              <div className="bg-slate-800 p-3 rounded text-xs break-all text-slate-300">
                <p className="font-semibold mb-1">Contract Address:</p>
                {contractAddress}
              </div>
            )}

            <Button
              onClick={handleDeployContract}
              disabled={isDeploying || deployStatus === "success"}
              className="w-full"
            >
              {deployStatus === "deploying"
                ? "Deploying..."
                : deployStatus === "success"
                  ? "Deployed!"
                  : "Deploy Contract"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
