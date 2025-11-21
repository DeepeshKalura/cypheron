"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { Navigation } from "@/components/navigation"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function PurchasePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const params = useParams()
  const datasetId = params.id as string

  const [dataset, setDataset] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaseStatus, setPurchaseStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else {
      loadDataset()
    }
  }, [status, router, datasetId])

  const loadDataset = async () => {
    try {
      const response = await fetch(`/api/datasets/${datasetId}`)
      if (response.ok) {
        const data = await response.json()
        setDataset(data.dataset)
      } else {
        toast({
          title: "Error",
          description: "Dataset not found",
          variant: "destructive",
        })
        router.push("/marketplace")
      }
    } catch (error) {
      console.error("Failed to load dataset:", error)
      router.push("/marketplace")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePurchase = async () => {
    setIsPurchasing(true)
    setPurchaseStatus("processing")

    try {
      const response = await fetch("/api/transactions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datasetId }),
      })

      if (!response.ok) throw new Error("Purchase failed")

      const data = await response.json()
      setPurchaseStatus("success")

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      setPurchaseStatus("error")
      toast({
        title: "Purchase failed",
        description: "An error occurred during purchase. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      </div>
    )
  }

  if (!dataset) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Purchase Dataset</CardTitle>
            <CardDescription>Complete your purchase securely using Sui blockchain</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Dataset Summary */}
            <div className="bg-background p-6 rounded-lg border border-border space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">{dataset.title}</h3>
                <p className="text-foreground/70 text-sm">{dataset.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-foreground/50 mb-1">Category</p>
                  <p className="font-semibold">{dataset.category}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/50 mb-1">Purchases</p>
                  <p className="font-semibold">{dataset.purchaseCount}</p>
                </div>
              </div>
            </div>

            {/* ZK Proof Info */}
            <div className="bg-blue-900/10 border border-blue-700/30 p-4 rounded-lg">
              <p className="text-sm text-blue-200 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>This dataset is verified with zero-knowledge proofs. Your privacy is protected.</span>
              </p>
            </div>

            {/* Price Summary */}
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between">
                <p className="text-foreground/70">Dataset Price</p>
                <p className="font-semibold">{dataset.price} SUI</p>
              </div>
              <div className="flex justify-between">
                <p className="text-foreground/70">Platform Fee (0%)</p>
                <p className="font-semibold">0 SUI</p>
              </div>
              <div className="flex justify-between text-lg pt-3 border-t border-border">
                <p className="font-bold">Total</p>
                <p className="font-bold text-primary">{dataset.price} SUI</p>
              </div>
            </div>

            {/* Status Messages */}
            {purchaseStatus === "processing" && (
              <div className="bg-background p-4 rounded-lg text-center space-y-2">
                <Spinner className="mx-auto" />
                <p className="text-sm text-foreground/70">Processing your purchase...</p>
              </div>
            )}

            {purchaseStatus === "success" && (
              <div className="bg-green-900/10 border border-green-700/30 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="font-semibold">Purchase successful!</p>
                </div>
                <p className="text-sm text-foreground/70">Redirecting to your dashboard...</p>
              </div>
            )}

            {purchaseStatus === "error" && (
              <div className="bg-red-900/10 border border-red-700/30 p-4 rounded-lg">
                <p className="text-sm text-red-300">Purchase failed. Please try again or contact support.</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={() => router.back()} variant="outline" className="flex-1 border-border">
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={isPurchasing || purchaseStatus === "success"}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isPurchasing ? "Processing..." : "Confirm Purchase"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
