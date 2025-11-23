import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, TrendingUp } from "lucide-react"
import Link from "next/link"

interface DatasetCardProps {
  id: string
  title: string
  description: string
  category: string
  price: number
  volume: number
  rating: number
  downloads: number
  verified: boolean
}

export function DatasetCard({
  id,
  title,
  description,
  category,
  price,
  volume,
  rating,
  downloads,
  verified,
}: DatasetCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-all group overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg line-clamp-1">{title}</h3>
            <p className="text-sm text-foreground/50 mt-1">{category}</p>
          </div>
          {verified && <Badge className="bg-primary/20 text-primary border-0">Verified</Badge>}
        </div>

        <p className="text-sm text-foreground/70 line-clamp-2 mb-4">{description}</p>

        <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-border">
          <div>
            <p className="text-xs text-foreground/50 mb-1">Rating</p>
            <p className="font-semibold text-primary">{rating.toFixed(1)}/5</p>
          </div>
          <div>
            <p className="text-xs text-foreground/50 mb-1">Downloads</p>
            <p className="font-semibold flex items-center gap-1">
              <Download className="w-3 h-3" /> {downloads}
            </p>
          </div>
          <div>
            <p className="text-xs text-foreground/50 mb-1">Volume</p>
            <p className="font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {volume}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-foreground/50">Price</p>
            <p className="text-xl font-bold text-primary">${price}</p>
          </div>
          <Link href={`/datasets/${id}`}>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}