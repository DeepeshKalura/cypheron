"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface ZKVisualizerProps {
    isGenerating: boolean
    onComplete?: () => void
    className?: string
}

export function ZKVisualizer({ isGenerating, onComplete, className }: ZKVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState("Initializing ZK-SNARK circuit...")

    useEffect(() => {
        if (!isGenerating) {
            setProgress(0)
            return
        }

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Matrix effect setup
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+"
        const fontSize = 10
        const columns = canvas.width / fontSize
        const drops: number[] = []

        for (let x = 0; x < columns; x++) {
            drops[x] = 1
        }

        let animationFrameId: number

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.fillStyle = "#0F0" // Green text
            ctx.font = `${fontSize}px monospace`

            for (let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length))
                ctx.fillText(text, i * fontSize, drops[i] * fontSize)

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0
                }
                drops[i]++
            }

            animationFrameId = requestAnimationFrame(draw)
        }

        draw()

        // Progress simulation
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    cancelAnimationFrame(animationFrameId)
                    if (onComplete) onComplete()
                    return 100
                }

                // Update status text based on progress
                if (prev < 30) setStatus("Constructing arithmetic circuit...")
                else if (prev < 60) setStatus("Generating witness...")
                else if (prev < 80) setStatus("Computing polynomial commitments...")
                else setStatus("Finalizing ZK-SNARK proof...")

                return prev + 1
            })
        }, 50) // 5 seconds total duration (100 * 50ms)

        return () => {
            clearInterval(interval)
            cancelAnimationFrame(animationFrameId)
        }
    }, [isGenerating, onComplete])

    if (!isGenerating && progress === 0) return null

    return (
        <div className={cn("relative w-full overflow-hidden rounded-lg border border-primary/50 bg-black", className)}>
            {/* Canvas for Matrix Effect */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-30"
            />

            {/* Overlay Content */}
            <div className="relative z-10 flex flex-col items-center justify-center p-8 space-y-6">
                <div className="w-full max-w-md space-y-2">
                    <div className="flex justify-between text-xs font-mono text-primary">
                        <span>{status}</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary shadow-[0_0_10px_#0F0] transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono text-primary/70">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${progress > 20 ? "bg-primary shadow-[0_0_5px_#0F0]" : "bg-primary/20"}`} />
                        <span>R1CS Constraints</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${progress > 50 ? "bg-primary shadow-[0_0_5px_#0F0]" : "bg-primary/20"}`} />
                        <span>Witness Generation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${progress > 75 ? "bg-primary shadow-[0_0_5px_#0F0]" : "bg-primary/20"}`} />
                        <span>FFT Computation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${progress >= 99 ? "bg-primary shadow-[0_0_5px_#0F0]" : "bg-primary/20"}`} />
                        <span>Proof Serialized</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
