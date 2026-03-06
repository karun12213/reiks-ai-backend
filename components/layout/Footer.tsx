import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-reiks-dark border-t border-reiks-border mt-auto pb-16 md:pb-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="text-2xl font-heading font-extrabold text-gold tracking-widest">
                            REIKS
                        </Link>
                        <p className="text-xs text-reiks-dim mt-2 leading-relaxed max-w-xs">
                            India&apos;s first AI-native gold jewelry platform. Design with intelligence, invest with confidence.
                        </p>
                        <p className="text-[10px] text-reiks-dim mt-3 font-mono">Forged by Intelligence™</p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="text-xs font-semibold text-gold mb-3 tracking-widest uppercase">Platform</h4>
                        <nav className="flex flex-col gap-2">
                            {[
                                { href: '/forge', label: 'AI Design Studio' },
                                { href: '/collection', label: 'Collection' },
                                { href: '/vault', label: 'VaultTrade' },
                                { href: '/concierge', label: 'AI Concierge' },
                            ].map(link => (
                                <Link key={link.href} href={link.href} className="text-xs text-reiks-mid hover:text-gold transition-colors">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Trust */}
                    <div>
                        <h4 className="text-xs font-semibold text-gold mb-3 tracking-widest uppercase">Trust</h4>
                        <div className="flex flex-col gap-2 text-xs text-reiks-mid">
                            <span>0% Gold Markup</span>
                            <span>Live Market Prices</span>
                            <span>BIS Hallmarked</span>
                            <span>Insured Shipping</span>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs font-semibold text-gold mb-3 tracking-widest uppercase">Contact</h4>
                        <div className="flex flex-col gap-2 text-xs text-reiks-mid">
                            <a href="mailto:hello@reiks.in" className="hover:text-gold transition-colors">hello@reiks.in</a>
                            <a href="tel:+916364078081" className="hover:text-gold transition-colors">+91 6364 078 081</a>
                            <span>Chennai, India</span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-reiks-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] text-reiks-dim">
                        © {new Date().getFullYear()} REIKS. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-reiks-dim">
                        <Link href="/" className="hover:text-gold transition-colors">About</Link>
                        <Link href="/" className="hover:text-gold transition-colors">FAQ</Link>
                        <span>Terms</span>
                        <span>Privacy</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
