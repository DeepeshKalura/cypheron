"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { DatasetCard } from "@/components/dataset-card"
import { MarketplaceFilters } from "@/components/marketplace-filters"

// Mock datasets
const mockDatasets = [
  {
    id: "1",
    title: "Real-Time Stock Market Data",
    description: "Live stock prices, volumes, and technical indicators for major exchanges.",
    category: "Financial",
    price: 499,
    volume: 2847,
    rating: 4.8,
    downloads: 1204,
    verified: true,
  },
  {
    id: "2",
    title: "Social Media Sentiment Analysis",
    description: "Daily sentiment scores from Twitter, Reddit, and Discord about cryptocurrencies.",
    category: "Social Sentiment",
    price: 299,
    volume: 1523,
    rating: 4.6,
    downloads: 893,
    verified: true,
  },
  {
    id: "3",
    title: "Weather Forecast Accuracy Data",
    description: "Historical weather data with prediction accuracy metrics and anomalies.",
    category: "Weather",
    price: 199,
    volume: 1847,
    rating: 4.5,
    downloads: 656,
    verified: true,
  },
  {
    id: "4",
    title: "Supply Chain Transparency Records",
    description: "End-to-end supply chain tracking data with verified timestamps.",
    category: "Supply Chain",
    price: 349,
    volume: 912,
    rating: 4.7,
    downloads: 421,
    verified: true,
  },
  {
    id: "5",
    title: "Health & Wellness Metrics",
    description: "Aggregated anonymized health data from wearable devices and apps.",
    category: "Health",
    price: 249,
    volume: 1654,
    rating: 4.4,
    downloads: 734,
    verified: false,
  },
  {
    id: "6",
    title: "Real Estate Price Index",
    description: "Comprehensive real estate pricing data with market trends and forecasts.",
    category: "Real Estate",
    price: 399,
    volume: 2134,
    rating: 4.9,
    downloads: 1087,
    verified: true,
  },
  {
    id: "7",
    title: "Crypto Market Intelligence",
    description: "Institutional-grade cryptocurrency trading data and analysis.",
    category: "Financial",
    price: 599,
    volume: 3421,
    rating: 4.8,
    downloads: 1523,
    verified: true,
  },
  {
    id: "8",
    title: "IoT Sensor Network Data",
    description: "Distributed sensor readings from urban IoT networks.",
    category: "Supply Chain",
    price: 179,
    volume: 987,
    rating: 4.3,
    downloads: 543,
    verified: false,
  },
]

export default function MarketplacePage() {
  const [filters, setFilters] = useState({
    category: "All",
    priceRange: [0, 10000],
    searchQuery: "",
  })
  const [sortBy, setSortBy] = useState("popular")

  const filteredDatasets = mockDatasets.filter((dataset) => {
    const matchesCategory = filters.category === "All" || dataset.category === filters.category
    const matchesPrice = dataset.price >= filters.priceRange[0] && dataset.price <= filters.priceRange[1]
    const matchesSearch = dataset.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
    return matchesCategory && matchesPrice && matchesSearch
  })

  const sortedDatasets = [...filteredDatasets].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return b.volume - a.volume
    }
  })

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
                {/* Sort Bar */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-foreground/70">Showing {sortedDatasets.length} datasets</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground/50">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-xs bg-card border border-border rounded px-3 py-2 text-foreground"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>

                {/* Datasets Grid */}
                {sortedDatasets.length > 0 ? (
                  <div className="grid gap-6">
                    {sortedDatasets.map((dataset) => (
                      <DatasetCard key={dataset.id} {...dataset} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-foreground/50">No datasets found matching your filters.</p>
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
