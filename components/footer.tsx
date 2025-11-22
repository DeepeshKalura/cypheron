import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <p className="font-bold text-primary mb-4">Cypheron</p>
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
                    <p>&copy; 2025 Cypheron. All rights reserved.</p>
                    <p>Built on Sui Blockchain</p>
                </div>
            </div>
        </footer>
    )
}
