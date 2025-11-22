"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { DatasetCard } from "@/components/dataset-card"
import { MarketplaceFilters } from "@/components/marketplace-filters"

// Mock datasets
const mockDatasets = [
  {
    id: "1",
    title: "BTC Whale Alert Feed (Real-time)",
    description: "Live feed of Bitcoin transactions > 100 BTC. Includes wallet labeling (Exchange vs Cold Storage) and historical movement patterns. Essential for high-frequency trading algorithms.",
    category: "Financial",
    price: 250,
    volume: 12450,
    rating: 4.9,
    downloads: 842,
    verified: true,
    seller: "0x71...9a2",
    objectId: "0x1"
  },
  {
    id: "2",
    title: "Global Cancer Research Dataset v2.1",
    description: "Anonymized clinical trial data from 50+ research institutions. Includes genetic markers, treatment protocols, and 5-year survival rates. HIPAA compliant and ZK-verified for privacy.",
    category: "Health",
    price: 5000,
    volume: 8500,
    rating: 5.0,
    downloads: 124,
    verified: true,
    seller: "0x8a...b12",
    objectId: "0x2"
  },
  {
    id: "3",
    title: "SpaceX Starlink Latency Map (Global)",
    description: "Comprehensive latency and throughput data for Starlink nodes worldwide. Scraped and verified from 10,000+ ground stations. Perfect for ISP competitive analysis.",
    category: "Technology",
    price: 150,
    volume: 3200,
    rating: 4.7,
    downloads: 456,
    verified: true,
    seller: "0x3c...d45",
    objectId: "0x3"
  },
  {
    id: "4",
    title: "Retail Foot Traffic: NYC & London",
    description: "High-resolution foot traffic heatmaps for prime retail locations in New York and London. Updated weekly. Derived from aggregated mobile signal data.",
    category: "Real Estate",
    price: 899,
    volume: 5600,
    rating: 4.8,
    downloads: 210,
    verified: true,
    seller: "0x9e...f78",
    objectId: "0x4"
  },
  {
    id: "5",
    title: "DeFi Liquidity Sniper Alpha",
    description: "Predictive model output for liquidity pool drains and rug pulls on Solana and Sui. 85% accuracy rate in backtesting. ZK-proof of model performance included.",
    category: "Financial",
    price: 1200,
    volume: 15000,
    rating: 4.6,
    downloads: 89,
    verified: false,
    seller: "0x2b...c34",
    objectId: "0x5"
  },
  {
    id: "6",
    title: "AgriTech: Soil Sensor Array (Midwest)",
    description: "IoT sensor data from 500+ farms across the US Midwest. Moisture levels, nutrient content, and crop yield correlations over 3 seasons.",
    category: "Supply Chain",
    price: 350,
    volume: 2100,
    rating: 4.5,
    downloads: 167,
    verified: true,
    seller: "0x5d...e67",
    objectId: "0x6"
  }
]


import { useSuiClient } from "@mysten/dapp-kit"
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit"
import { Transaction } from "@mysten/sui/transactions"
import { CRYPTOVAULT_MODULE, MARKETPLACE_ID, type Dataset } from "@/lib/contracts"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function MarketplacePage() {
  const [filters, setFilters] = useState({
    category: "All",
    priceRange: [0, 10000],
    searchQuery: "",
  })
  const [sortBy, setSortBy] = useState("popular")
  const [datasets, setDatasets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const suiClient = useSuiClient()
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  const currentAccount = useCurrentAccount()
  const { toast } = useToast()

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setIsLoading(true)
        // In a real app, we would query the Marketplace object's dynamic fields or events
        // For this hackathon demo, we'll fetch specific objects if we had their IDs, 
        // or fallback to mock data if the contract is empty/placeholder.

        // Mocking the fetch for now but simulating network delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // TODO: Replace with real Sui Object fetch
        // const objects = await suiClient.getOwnedObjects({ owner: MARKETPLACE_ID })

        // Using mock data structure but preparing for real integration
        // Using mock data structure but preparing for real integration
        setDatasets(mockDatasets)
      } catch (error) {
        console.error("Failed to fetch datasets", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDatasets()
  }, [suiClient])

  const [purchasedDatasets, setPurchasedDatasets] = useState<string[]>([])

  // ... (existing code)

  const handlePurchase = async (dataset: any) => {
    if (!currentAccount) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase datasets.",
        variant: "destructive",
      })
      return
    }

    try {
      toast({
        title: "Processing Purchase",
        description: "Please sign the transaction in your wallet...",
      })

      const tx = new Transaction()
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(dataset.price * 1_000_000_000)])

      tx.moveCall({
        target: `${CRYPTOVAULT_MODULE}::purchase_dataset`,
        arguments: [
          tx.object(MARKETPLACE_ID),
          tx.object(dataset.objectId), // The Dataset Object ID
          coin,
        ],
      })

      await signAndExecuteTransaction({
        transaction: tx as any,
      })

      setPurchasedDatasets((prev) => [...prev, dataset.id])

      toast({
        title: "Purchase Successful!",
        description: "The dataset decryption key has been transferred to your wallet.",
      })

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

              {/* Datasets */}
              <div className="md:col-span-3 space-y-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {datasets.map((dataset) => (
                      <div key={dataset.id} className="relative">
                        <DatasetCard {...dataset} />
                        {/* Overlay Buy Button for Hackathon Demo */}
                        <div className="absolute bottom-4 right-4">
                          {purchasedDatasets.includes(dataset.id) ? (
                            <button
                              className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2 shadow-lg shadow-green-500/20"
                              onClick={() => {
                                toast({
                                  title: "Downloading...",
                                  description: "Decrypted file is being downloaded to your device.",
                                })
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                              Download Decrypted
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePurchase(dataset)}
                              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg"
                            >
                              Buy for {dataset.price} SUI
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
