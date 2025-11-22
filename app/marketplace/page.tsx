"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { DatasetCard } from "@/components/dataset-card"
import { MarketplaceFilters } from "@/components/marketplace-filters"
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit"
import { Transaction } from "@mysten/sui/transactions"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function MarketplacePage() {
  const [filters, setFilters] = useState({
    category: "All",
    priceRange: [0, 10000],
    searchQuery: "",
  })
  const [datasets, setDatasets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [purchasedDatasets, setPurchasedDatasets] = useState<string[]>([])

  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  const currentAccount = useCurrentAccount()
  const { toast } = useToast()

  // 1. Fetch Real Data from your API (which reads from DB)
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setIsLoading(true)

        // Build query string from filters
        const params = new URLSearchParams()
        if (filters.category && filters.category !== "All") {
          params.append("category", filters.category)
        }
        // Add more filters here if needed

        const response = await fetch(`/api/datasets?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch")

        const data = await response.json()
        setDatasets(data.datasets || [])

      } catch (error) {
        console.error("Failed to fetch datasets", error)
        toast({
          title: "Error",
          description: "Could not load marketplace data",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDatasets()
  }, [filters]) // Refetch when filters change

  // 2. Handle Real On-Chain Purchase
  const handlePurchase = async (dataset: any) => {
    if (!currentAccount) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase datasets.",
        variant: "destructive",
      })
      return
    }

    // Guard: Can't buy if it's not on-chain
    if (!dataset.suiObjectId) {
      toast({
        title: "Not available for purchase",
        description: "This dataset hasn't been fully indexed on-chain yet.",
        variant: "destructive"
      })
      return
    }

    try {
      toast({
        title: "Processing Purchase",
        description: "Please sign the transaction in your wallet...",
      })

      const tx = new Transaction()

      // Calculate amount in MIST (1 SUI = 1,000,000,000 MIST)
      const priceInMist = Math.floor(Number(dataset.price) * 1_000_000_000)

      // Split gas coin to pay
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(priceInMist)])

      const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID
      const MARKETPLACE_ID = process.env.NEXT_PUBLIC_MARKETPLACE_ID
      const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME || "marketplace"

      if (!PACKAGE_ID || !MARKETPLACE_ID) {
        throw new Error("Contract configuration missing")
      }

      // Call Smart Contract: purchase_dataset
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::purchase_dataset`,
        arguments: [
          tx.object(MARKETPLACE_ID),
          tx.object(dataset.suiObjectId), // The specific dataset object on-chain
          coin,
        ],
      })

      // Execute
      const response = await signAndExecuteTransaction({
        transaction: tx as any,
      })

      console.log("Purchase TX Digest:", response.digest)

      // Success UI Update
      setPurchasedDatasets((prev) => [...prev, dataset.id])

      toast({
        title: "Purchase Successful!",
        description: "You now have access to this dataset.",
      })

      // Optional: Notify backend of purchase
      // await fetch('/api/transactions/create', ...)

    } catch (error) {
      console.error(error)
      toast({
        title: "Purchase Failed",
        description: "Transaction was cancelled or failed.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="border-b border-border bg-card py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Data Marketplace</h1>
            <p className="text-foreground/70">
              Discover and purchase encrypted datasets verified with zero-knowledge proofs.
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Filters */}
              <div className="md:col-span-1">
                <MarketplaceFilters onFilterChange={setFilters} />
              </div>

              {/* Datasets Grid */}
              <div className="md:col-span-3 space-y-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : datasets.length === 0 ? (
                  <div className="text-center py-12 text-foreground/50">
                    No datasets found. Be the first to upload one!
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {datasets.map((dataset) => (
                      <div key={dataset.id} className="relative">
                        {/* Map DB fields to Card Props */}
                        <DatasetCard
                          id={dataset.id}
                          title={dataset.title}
                          description={dataset.description || "No description provided"}
                          category={dataset.category || "Uncategorized"}
                          price={Number(dataset.price)}
                          // Fallbacks for fields not yet in DB
                          volume={dataset.viewCount || 0}
                          rating={4.5}
                          downloads={dataset.purchaseCount || 0}
                          verified={dataset.verified}
                        />

                        {/* Overlay Buy Button */}
                        <div className="absolute bottom-4 right-4">
                          {purchasedDatasets.includes(dataset.id) ? (
                            <button
                              className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2 shadow-lg shadow-green-500/20"
                              onClick={() => {
                                // Simulate Download
                                const blobId = dataset.fileHash || "blob_missing"
                                // In real app: fetch decrypted blob from Walrus
                                window.open(`/uploads/${blobId}`, '_blank')
                                toast({
                                  title: "Downloading...",
                                  description: "Decrypted file is being downloaded.",
                                })
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                              Download
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePurchase(dataset)}
                              disabled={!dataset.suiObjectId}
                              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {dataset.suiObjectId ? `Buy for ${dataset.price} SUI` : "Not on Chain"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}