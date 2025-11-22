import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </main>
    </>
  )
}
