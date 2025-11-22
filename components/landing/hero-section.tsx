import { Button } from "@/components/ui/button"
import { ArrowRight, Lock, Zap } from "lucide-react"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { Safari } from "@/components/ui/safari"
import Link from "next/link"

export function HeroSection() {
    return (
        <section className="relative overflow-hidden min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
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

            <div className="max-w-6xl mx-auto relative z-10 py-20">
                <div className="flex flex-col items-center text-center space-y-12">
                    {/* Hero Content */}
                    <div className="space-y-8 max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-background/50 backdrop-blur-sm">
                            <Lock className="w-4 h-4 text-primary" />
                            <span className="text-sm">Powered by Zero-Knowledge Proofs on Sui</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl tracking-tight">
                            Monetize Your Data.{" "}
                            <span className="text-primary">Privately. Instantly.</span>
                        </h1>

                        <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                            The world's first decentralized data marketplace. Verify authenticity without revealing secrets. Get paid in seconds.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link href={"/marketplace"}>
                                <Button
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all w-full sm:w-auto"
                                >
                                    Explore Marketplace <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href={"/upload"}>
                                <Button
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all w-full sm:w-auto"
                                >
                                    List Your Data <Zap className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Safari Browser Mockup */}
                    <div className="w-full max-w-5xl pt-8">
                        <div className="border-4 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <Safari
                                url="https://cypheron.io"
                                imageSrc="https://images.unsplash.com/photo-1644343262170-e40d72e19a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwY3J5cHRvY3VycmVuY3klMjBuZXR3b3JrfGVufDF8fHx8MTc2Mzc5MzQxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                                mode="default"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}