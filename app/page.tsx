import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { ArrowRight, Lock, Zap, Shield, TrendingUp, Database, Cpu } from "lucide-react"

export default function HomePage() {
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

  const stats = [
    { label: "Datasets", value: "2,847" },
    { label: "Active Traders", value: "5,234" },
    { label: "Volume (USD)", value: "$14.2M" },
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-bold text-balance leading-tight">
                    Trade Encrypted Data on the <span className="text-primary">Blockchain</span>
                  </h1>
                  <p className="text-lg text-foreground/70 text-balance leading-relaxed">
                    CryptoVault is the world's first decentralized data marketplace with zero-knowledge verification.
                    Sell your insights, verify authenticity, settle instantly.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/marketplace">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                    >
                      Explore Marketplace <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/upload">
                    <Button size="lg" variant="outline" className="border-border w-full sm:w-auto bg-transparent">
                      List Your Data
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-primary">{stat.value}</p>
                      <p className="text-sm text-foreground/50">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-3xl" />
                <div className="relative bg-card border border-border rounded-2xl p-8 space-y-4">
                  <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                    <Database className="w-12 h-12 text-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-border rounded w-3/4" />
                    <div className="h-3 bg-border rounded w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why CryptoVault?</h2>
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
                    className="bg-card border-border hover:border-border/80 hover:bg-card/80 transition p-6"
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

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-t border-border">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">Ready to revolutionize data trading?</h2>
              <p className="text-foreground/70 text-lg">
                Join thousands of data sellers and buyers earning from encrypted insights.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                  Start Selling <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="border-border w-full sm:w-auto bg-transparent">
                  Browse Datasets
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <p className="font-bold text-primary mb-4">CryptoVault</p>
                <p className="text-sm text-foreground/50">Decentralized data marketplace on Sui blockchain.</p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-4">Product</p>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>
                    <Link href="/marketplace" className="hover:text-foreground transition">
                      Marketplace
                    </Link>
                  </li>
                  <li>
                    <Link href="/upload" className="hover:text-foreground transition">
                      Upload
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="hover:text-foreground transition">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-sm mb-4">Resources</p>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>
                    <a href="#" className="hover:text-foreground transition">
                      Docs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition">
                      API
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition">
                      Support
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-sm mb-4">Legal</p>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>
                    <a href="#" className="hover:text-foreground transition">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 flex justify-between items-center text-sm text-foreground/50">
              <p>&copy; 2025 CryptoVault. All rights reserved.</p>
              <p>Built on Sui Blockchain</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
