import type React from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, DollarSign, Download, Eye } from "lucide-react"

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  change?: string
  changeType?: "positive" | "negative"
}

function StatCard({ icon, label, value, change, changeType }: StatCardProps) {
  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-foreground/70 mb-1">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p className={`text-xs mt-2 ${changeType === "positive" ? "text-green-500" : "text-red-500"}`}>
              {changeType === "positive" ? "+" : ""}
              {change}
            </p>
          )}
        </div>
        <div className="text-primary/50">{icon}</div>
      </div>
    </Card>
  )
}

export function DashboardStats() {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <StatCard
        icon={<DollarSign className="w-6 h-6" />}
        label="Total Earnings"
        value="$14,250"
        change="$2,150"
        changeType="positive"
      />
      <StatCard
        icon={<Download className="w-6 h-6" />}
        label="Total Sales"
        value="287"
        change="42"
        changeType="positive"
      />
      <StatCard
        icon={<Eye className="w-6 h-6" />}
        label="Total Views"
        value="12,845"
        change="1,250"
        changeType="positive"
      />
      <StatCard
        icon={<TrendingUp className="w-6 h-6" />}
        label="Avg Rating"
        value="4.7/5"
        change="0.2"
        changeType="positive"
      />
    </div>
  )
}
