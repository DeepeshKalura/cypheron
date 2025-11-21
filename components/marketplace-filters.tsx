"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, X } from "lucide-react"

const categories = [
  "All",
  "Market Data",
  "Weather",
  "Social Sentiment",
  "Health",
  "Financial",
  "Real Estate",
  "Supply Chain",
]

const priceRanges = [
  { label: "Any Price", value: [0, 10000] },
  { label: "Under $100", value: [0, 100] },
  { label: "$100 - $500", value: [100, 500] },
  { label: "$500 - $1,000", value: [500, 1000] },
  { label: "$1,000+", value: [1000, 10000] },
]

interface FiltersProps {
  onFilterChange: (filters: any) => void
}

export function MarketplaceFilters({ onFilterChange }: FiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPrice, setSelectedPrice] = useState([0, 10000])
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(true)

  const handleFilterChange = () => {
    onFilterChange({
      category: selectedCategory,
      priceRange: selectedPrice,
      searchQuery,
    })
  }

  return (
    <div>
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          className="w-full border-border justify-between bg-transparent"
          onClick={() => setIsOpen(!isOpen)}
        >
          Filters {isOpen ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {(isOpen || window.innerWidth >= 768) && (
        <Card className="bg-card border-border p-6 space-y-6">
          {/* Search */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Search</Label>
            <Input
              placeholder="Dataset name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                handleFilterChange()
              }}
              className="bg-background border-border"
            />
          </div>

          {/* Category */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Category</Label>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat)
                    handleFilterChange()
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    selectedCategory === cat
                      ? "bg-primary/20 text-primary font-semibold"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Price Range</Label>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    setSelectedPrice(range.value)
                    handleFilterChange()
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    selectedPrice === range.value
                      ? "bg-primary/20 text-primary font-semibold"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <Button
            variant="outline"
            className="w-full border-border bg-transparent"
            onClick={() => {
              setSelectedCategory("All")
              setSelectedPrice([0, 10000])
              setSearchQuery("")
              handleFilterChange()
            }}
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  )
}
