import { Card } from "@/components/ui/card"
import { Lock, Shield, Zap, TrendingUp, Database, Cpu } from "lucide-react"

export function FeaturesSection() {
    const features = [
        {
            icon: Lock,
            title: "End-to-End Encryption",
            description: "Your data is encrypted using military-grade cryptography. Only authorized buyers can decrypt.",
        },
        {
            icon: Shield,
            title: "Zero-Knowledge Proofs",
            description: "Verify data authenticity without revealing the underlying information.",
        },
        {
            icon: Zap,
            title: "Instant Settlement",
            description: "Transactions settle on Sui blockchain in seconds with minimal fees.",
        },
        {
            icon: TrendingUp,
            title: "Monetize Data",
            description: "Earn passive income by selling your datasets to interested buyers.",
        },
        {
            icon: Database,
            title: "Distributed Storage",
            description: "Data is stored across decentralized networks ensuring maximum availability.",
        },
        {
            icon: Cpu,
            title: "Smart Contracts",
            description: "Automated execution of terms with verifiable, immutable records.",
        },
    ]

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border bg-background/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Cypheron?</h2>
                    <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
                        Built with cutting-edge cryptography and blockchain technology for the modern data economy.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon
                        return (
                            <Card
                                key={feature.title}
                                className="bg-card/50 border-border hover:border-primary/50 hover:bg-card/80 transition p-6 backdrop-blur-sm"
                            >
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                <p className="text-foreground/70 text-sm leading-relaxed">{feature.description}</p>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
