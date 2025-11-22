"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import {
    ArrowLeft,
    Lock,
    Download,
    Eye,
    ShoppingCart,
    CheckCircle2,
    AlertCircle,
    Tag,
    FileText,
    DollarSign,
    Shield,
    TrendingUp
} from "lucide-react"

export default function DatasetDetailPage({ params }: { params: { id: string } }) {
    const { id } = params
    const [dataset, setDataset] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<{ title: string, description: string, variant?: string } | null>(null)
    const [isPurchasing, setIsPurchasing] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchDataset = async () => {
            try {
                const res = await fetch(`/api/datasets/${id}`)
                if (!res.ok) {
                    throw new Error("Failed to fetch dataset")
                }
                const data = await res.json()
                setDataset(data.data)
            } catch (error) {
                console.error(error)
                setToast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to load dataset",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }
        fetchDataset()
    }, [id])

    const handlePurchase = async () => {
        setIsPurchasing(true)
        try {
            // Mock purchase logic - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            setToast({
                title: "Purchase Successful",
                description: "Dataset has been added to your library",
            })
        } catch (error) {
            setToast({
                title: "Purchase Failed",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsPurchasing(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen relative flex items-center justify-center">
                <div className="absolute inset-0 -z-10">
                    <FlickeringGrid
                        className="z-0 absolute inset-0 size-full"
                        squareSize={4}
                        gridGap={6}
                        color="#FF3333"
                        maxOpacity={0.1}
                        flickerChance={0.1}
                    />
                </div>
                <Spinner size="lg" />
            </div>
        )
    }

    if (!dataset) {
        return (
            <div className="min-h-screen relative p-8">
                <div className="absolute inset-0 -z-10">
                    <FlickeringGrid
                        className="z-0 absolute inset-0 size-full"
                        squareSize={4}
                        gridGap={6}
                        color="#FF3333"
                        maxOpacity={0.1}
                        flickerChance={0.1}
                    />
                </div>
                <div className="max-w-4xl mx-auto">
                    <div className="border-4 border-border bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
                        <AlertCircle className="size-12 mx-auto mb-4 text-destructive" />
                        <h2 className="mb-2">Dataset Not Found</h2>
                        <p className="text-muted-foreground mb-6">The dataset you're looking for doesn't exist.</p>
                        <Button onClick={() => router.push("/datasets")}>
                            Browse Datasets
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative p-4 md:p-8">
            {/* Background Grid */}
            <div className="absolute inset-0 -z-10">
                <FlickeringGrid
                    className="z-0 absolute inset-0 size-full"
                    squareSize={4}
                    gridGap={6}
                    color="#FF3333"
                    maxOpacity={0.1}
                    flickerChance={0.1}
                />
            </div>

            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button variant="outline" onClick={() => router.back()} className="border-2">
                        <ArrowLeft className="size-4 mr-2" />
                        Back
                    </Button>
                    <a href="/" className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground border-2 border-border flex size-10 items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <Lock className="size-5" />
                        </div>
                        <span>Cypheron</span>
                    </a>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title Card */}
                        <div className="border-4 border-border bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="mb-3">{dataset.title}</h1>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {dataset.verified && (
                                            <div className="flex items-center gap-1 text-[#00cc00] text-xs">
                                                <CheckCircle2 className="size-4" />
                                                Verified
                                            </div>
                                        )}
                                        {dataset.isFraudulent && (
                                            <div className="flex items-center gap-1 text-destructive text-xs">
                                                <AlertCircle className="size-4" />
                                                Flagged
                                            </div>
                                        )}
                                        <div className="border-2 border-border bg-muted px-2 py-0.5 text-xs">
                                            {dataset.status || "active"}
                                        </div>
                                        {dataset.category && (
                                            <div className="border-2 border-border bg-muted px-2 py-0.5 text-xs">
                                                {dataset.category}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <p className="text-muted-foreground text-sm">
                                {dataset.description || "No description available."}
                            </p>

                            {/* Tags */}
                            {dataset.tags && dataset.tags.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap mt-4">
                                    <Tag className="size-4 text-muted-foreground" />
                                    {dataset.tags.map((tag: string, idx: number) => (
                                        <span
                                            key={idx}
                                            className="border-2 border-border bg-accent/10 px-2 py-0.5 text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Fraud Warning */}
                            {dataset.isFraudulent && dataset.fraudReason && (
                                <div className="border-2 border-destructive bg-destructive/10 p-4 mt-4 flex gap-3">
                                    <AlertCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="mb-1 text-sm">This dataset has been flagged</p>
                                        <p className="text-xs text-muted-foreground">{dataset.fraudReason}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stats Card */}
                        <div className="border-4 border-border bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                            <h3 className="mb-4">Dataset Statistics</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="border-2 border-border bg-muted p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Eye className="size-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Views</span>
                                    </div>
                                    <p>{dataset.viewCount || 0}</p>
                                </div>
                                <div className="border-2 border-border bg-muted p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ShoppingCart className="size-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Purchases</span>
                                    </div>
                                    <p>{dataset.purchaseCount || 0}</p>
                                </div>
                                <div className="border-2 border-border bg-muted p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="size-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">File Size</span>
                                    </div>
                                    <p className="text-sm">
                                        {dataset.fileSize
                                            ? `${(dataset.fileSize / (1024 * 1024)).toFixed(2)} MB`
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Technical Details */}
                        <div className="border-4 border-border bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                            <h3 className="mb-4">Technical Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Shield className="size-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm mb-1">File Hash</p>
                                        <p className="text-xs text-muted-foreground break-all font-mono">
                                            {dataset.fileHash}
                                        </p>
                                    </div>
                                </div>
                                {dataset.zkProofHash && (
                                    <div className="flex items-start gap-3">
                                        <Lock className="size-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm mb-1">ZK Proof Hash</p>
                                            <p className="text-xs text-muted-foreground break-all font-mono">
                                                {dataset.zkProofHash}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Purchase Info */}
                    <div className="space-y-6">
                        {/* Price Card */}
                        <div className="border-4 border-border bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <DollarSign className="size-5 text-primary" />
                                <h3>Price</h3>
                            </div>
                            <p className="text-3xl mb-4">${dataset.price}</p>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">License</span>
                                    <span>{dataset.license || "single-use"}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Format</span>
                                    <span>Encrypted</span>
                                </div>
                            </div>

                            <Button
                                onClick={handlePurchase}
                                disabled={isPurchasing || dataset.isFraudulent}
                                className="w-full"
                            >
                                {isPurchasing ? (
                                    <span className="flex items-center gap-2">
                                        <Spinner size="sm" />
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        <Download className="size-4 mr-2" />
                                        Purchase Dataset
                                    </>
                                )}
                            </Button>

                            {dataset.isFraudulent && (
                                <p className="text-xs text-destructive mt-3 text-center">
                                    This dataset cannot be purchased
                                </p>
                            )}
                        </div>

                        {/* Info Card */}
                        <div className="border-4 border-border bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                            <h3 className="mb-4">About This Dataset</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-muted-foreground mb-1">Created</p>
                                    <p>{dataset.createdAt ? new Date(dataset.createdAt).toLocaleDateString() : "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground mb-1">Last Updated</p>
                                    <p>{dataset.updatedAt ? new Date(dataset.updatedAt).toLocaleDateString() : "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground mb-1">Dataset ID</p>
                                    <p className="text-xs font-mono break-all">{dataset.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast notification */}
            {toast && (
                <div className={`fixed bottom-4 right-4 border-4 ${toast.variant === 'destructive' ? 'border-destructive' : 'border-border'} bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 max-w-sm z-50`}>
                    <h3 className="mb-1">{toast.title}</h3>
                    <p className="text-sm text-muted-foreground">{toast.description}</p>
                    <button
                        onClick={() => setToast(null)}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    )
}
