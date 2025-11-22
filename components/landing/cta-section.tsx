import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-t border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
            <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
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
                        <Button size="lg" variant="outline" className="border-border w-full sm:w-auto bg-background/50">
                            Browse Datasets
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
