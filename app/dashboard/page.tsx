"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { DashboardStats } from "@/components/dashboard-stats"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, LogOut, Plus } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [filter, setFilter] = useState<"all" | "active" | "draft">("all")
  const [selectedTab, setSelectedTab] = useState<"datasets" | "earnings" | "activity">("datasets")
  const [datasets, setDatasets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      loadDatasets()
    }
  }, [status, router])

  const loadDatasets = async () => {
    try {
      const response = await fetch("/api/datasets")
      if (response.ok) {
        const data = await response.json()
        setDatasets(data.datasets || [])
      }
    } catch (error) {
      console.error("Failed to load datasets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  const filteredDatasets = datasets.filter((dataset) => {
    if (filter === "all") return true
    return dataset.status === filter
  })

  const totalEarnings = datasets.reduce((sum, d) => sum + (d.earnings || 0), 0)
  const thisMonthEarnings = datasets.reduce((sum, d) => sum + (d.monthlyEarnings || 0), 0)

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="border-b border-border bg-card py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Dashboard</h1>
              <p className="text-foreground/70 mt-2">Welcome, {session?.user?.name}</p>
            </div>
            <div className="flex gap-3">
              {session?.user?.role !== "BUYER" && (
                <Button
                  onClick={() => router.push("/upload")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Dataset
                </Button>
              )}
              <Button onClick={() => signOut()} variant="outline" className="border-border bg-transparent">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats */}
            <DashboardStats />

            {/* Tabs */}
            <div className="border-b border-border flex gap-8">
              <button
                onClick={() => setSelectedTab("datasets")}
                className={`pb-4 font-semibold transition ${
                  selectedTab === "datasets"
                    ? "text-primary border-b-2 border-primary"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                My Datasets
              </button>
              <button
                onClick={() => setSelectedTab("earnings")}
                className={`pb-4 font-semibold transition ${
                  selectedTab === "earnings"
                    ? "text-primary border-b-2 border-primary"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Earnings
              </button>
              <button
                onClick={() => setSelectedTab("activity")}
                className={`pb-4 font-semibold transition ${
                  selectedTab === "activity"
                    ? "text-primary border-b-2 border-primary"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Activity
              </button>
            </div>

            {/* Datasets Tab */}
            {selectedTab === "datasets" && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {(["all", "active", "draft"] as const).map((status) => (
                    <Button
                      key={status}
                      variant={filter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter(status)}
                      className={`capitalize ${filter === status ? "bg-primary hover:bg-primary/90" : "border-border"}`}
                    >
                      {status}
                    </Button>
                  ))}
                </div>

                {filteredDatasets.length === 0 ? (
                  <Card className="bg-card border-border p-8 text-center">
                    <p className="text-foreground/70 mb-4">No datasets yet</p>
                    {session?.user?.role !== "BUYER" && (
                      <Button onClick={() => router.push("/upload")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Your First Dataset
                      </Button>
                    )}
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredDatasets.map((dataset) => (
                      <Card key={dataset.id} className="bg-card border-border p-6 hover:border-border/80 transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-lg">{dataset.title}</h3>
                              <Badge
                                className={`${
                                  dataset.status === "active"
                                    ? "bg-green-500/20 text-green-500 border-0"
                                    : "bg-yellow-500/20 text-yellow-500 border-0"
                                }`}
                              >
                                {dataset.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground/50 mb-4">{dataset.category}</p>

                            <div className="grid md:grid-cols-4 gap-6">
                              <div>
                                <p className="text-xs text-foreground/50 mb-1">Price</p>
                                <p className="font-semibold">${dataset.price}</p>
                              </div>
                              <div>
                                <p className="text-xs text-foreground/50 mb-1">Sales</p>
                                <p className="font-semibold">{dataset.purchaseCount || 0}</p>
                              </div>
                              <div>
                                <p className="text-xs text-foreground/50 mb-1">Earnings</p>
                                <p className="font-semibold text-primary">
                                  ${(dataset.price * (dataset.purchaseCount || 0)).toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-foreground/50 mb-1">Views</p>
                                <p className="font-semibold">{dataset.viewCount || 0}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="outline" className="border-border bg-transparent">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-border bg-transparent">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-border bg-transparent">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Earnings Tab */}
            {selectedTab === "earnings" && (
              <Card className="bg-card border-border p-8">
                <h2 className="text-2xl font-bold mb-6">Earnings & Payouts</h2>
                <div className="space-y-4">
                  <div className="flex justify-between pb-4 border-b border-border">
                    <div>
                      <p className="text-sm text-foreground/70">Total Earnings</p>
                      <p className="text-3xl font-bold text-primary">${totalEarnings.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70">This Month</p>
                      <p className="text-3xl font-bold">${thisMonthEarnings.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70">Pending Payout</p>
                      <p className="text-3xl font-bold text-accent">$0.00</p>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                    Request Payout
                  </Button>
                </div>
              </Card>
            )}

            {/* Activity Tab */}
            {selectedTab === "activity" && (
              <Card className="bg-card border-border p-8">
                <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {[
                    {
                      action: "Dataset purchased",
                      dataset: "Stock Market Data",
                      buyer: "0x1234...",
                      time: "2 hours ago",
                    },
                    { action: "New review", dataset: "Crypto Intelligence", rating: "5.0", time: "5 hours ago" },
                    { action: "Earnings received", amount: "$2,456", time: "1 day ago" },
                    { action: "Dataset published", dataset: "Weather Forecast", time: "2 days ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between pb-4 border-b border-border last:border-0">
                      <div>
                        <p className="font-semibold">{item.action}</p>
                        <p className="text-xs text-foreground/50">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
