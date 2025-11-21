"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, Trash2, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminPanel() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [datasets, setDatasets] = useState<any[]>([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (session?.user?.role !== "ADMIN") {
      router.push("/dashboard")
    } else {
      loadDatasets()
    }
  }, [status, session, router])

  const loadDatasets = async () => {
    try {
      const response = await fetch("/api/admin/datasets")
      if (response.ok) {
        const data = await response.json()
        setDatasets(data.datasets)
      }
    } catch (error) {
      console.error("Failed to load datasets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFlagFraudulent = async (datasetId: string, reason: string) => {
    try {
      const response = await fetch(`/api/admin/datasets/${datasetId}/flag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })

      if (response.ok) {
        toast({
          title: "Dataset flagged",
          description: "Dataset marked as fraudulent",
        })
        loadDatasets()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to flag dataset",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDataset = async (datasetId: string) => {
    if (!confirm("Are you sure you want to permanently delete this dataset?")) return

    try {
      const response = await fetch(`/api/admin/datasets/${datasetId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Dataset deleted",
          description: "Dataset has been permanently removed",
        })
        loadDatasets()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete dataset",
        variant: "destructive",
      })
    }
  }

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <Spinner />
      </div>
    )
  }

  if (session?.user?.role !== "ADMIN") {
    return null
  }

  const fraudulentDatasets = datasets.filter((d) => d.isFraudulent)
  const totalDatasets = datasets.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Shield className="h-6 w-6 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-slate-400">Manage fraud detection and data cleanup</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-slate-700 bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDatasets}</div>
            </CardContent>
          </Card>

          <Card className="border-red-700/30 bg-red-900/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-400">Fraudulent Datasets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{fraudulentDatasets.length}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Legit Datasets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDatasets - fraudulentDatasets.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger value="all">All Datasets ({totalDatasets})</TabsTrigger>
            <TabsTrigger value="fraudulent" className="text-red-400">
              Fraudulent ({fraudulentDatasets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="border-slate-700 bg-slate-900">
              <CardContent className="pt-6">
                {datasets.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No datasets found</p>
                ) : (
                  <div className="space-y-4">
                    {datasets.map((dataset) => (
                      <div
                        key={dataset.id}
                        className="p-4 border border-slate-700 rounded-lg flex items-start justify-between hover:bg-slate-800/50"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{dataset.title}</h3>
                          <p className="text-sm text-slate-400">{dataset.description}</p>
                          {dataset.isFraudulent && (
                            <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              {dataset.fraudReason}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          {!dataset.isFraudulent && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-700 text-red-400 hover:bg-red-900/20 bg-transparent"
                              onClick={() => handleFlagFraudulent(dataset.id, "Suspected fraudulent data")}
                            >
                              Flag
                            </Button>
                          )}
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteDataset(dataset.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fraudulent">
            <Card className="border-red-700/30 bg-red-900/10">
              <CardContent className="pt-6">
                {fraudulentDatasets.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No fraudulent datasets detected</p>
                ) : (
                  <div className="space-y-4">
                    {fraudulentDatasets.map((dataset) => (
                      <div
                        key={dataset.id}
                        className="p-4 border border-red-700/30 rounded-lg bg-red-900/5 flex items-start justify-between"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-red-400">{dataset.title}</h3>
                          <p className="text-sm text-slate-400">{dataset.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            {dataset.fraudReason}
                          </div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteDataset(dataset.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
