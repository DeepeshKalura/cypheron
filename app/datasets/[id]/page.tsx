"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function DatasetDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const [dataset, setDataset] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchDataset = async () => {
            try {
                const res = await fetch(`/api/datasets/${id}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch dataset");
                }
                const data = await res.json();
                setDataset(data.data);
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to load dataset",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchDataset();
    }, [id]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!dataset) {
        return <div className="p-8">Dataset not found.</div>;
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <button
                onClick={() => router.back()}
                className="mb-4 text-primary underline"
            >
                ← Back
            </button>
            <h1 className="text-3xl font-bold mb-4">{dataset.title}</h1>
            <p className="text-foreground/70 mb-2">{dataset.description}</p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                    <strong>Category:</strong> {dataset.category}
                </div>
                <div>
                    <strong>Price (USD):</strong> ${dataset.price}
                </div>
                <div>
                    <strong>License:</strong> {dataset.license || "single-use"}
                </div>
                <div>
                    <strong>Status:</strong> {dataset.status || "active"}
                </div>
            </div>
        </div>
    );
}
