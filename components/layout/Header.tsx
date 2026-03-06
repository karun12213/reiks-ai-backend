'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useGoldPrice } from '@/hooks/useGoldPrice'
import { getSessionInfo, formatINR } from '@/lib/utils'
import { Menu, X, Home, Wand2, Grid3X3, Lock, MessageCircle, User } from 'lucide-react'

export default function Header() {
    const { price } = useGoldPrice()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const sessionInfo = price ? getSessionInfo(price.session) : null

    return (
        <>
            {/* Gold Ticker Strip */}
            <div className="h-8 bg-reiks-dark border-b border-reiks-border flex items-center overflow-hidden relative z-50">
                <div className="flex items-center gap-6 px-4 text-xs font-mono whitespace-nowrap animate-ticker">
                    {price && (
                        <>
                            <span className="text-gold font-semibold">
                                XAU ₹{price.gold_24k_gram.toFixed(0)}/g
                            </span>
                            <span className="text-reiks-mid">
                                22K ₹{price.gold_22k_gram.toFixed(0)}
                            </span>
                            <span className="text-reiks-mid">
                                18K ₹{price.gold_18k_gram.toFixed(0)}
                            </span>
                            <span className="text-reiks-dim">•</span>
                            {sessionInfo && (
                                <span style={{ color: sessionInfo.color }}>
                                    ● {price.session} {sessionInfo.emoji}
                                </span>
                            )}
                            <span className="text-reiks-dim">•</span>
                            <span className="text-reiks-dim">
                                Silver ₹{price.silver_inr_gram.toFixed(0)}/g
                            </span>
                            {!price.isLive && (
                                <>
                                    <span className="text-reiks-dim">•</span>
                                    <span className="text-warning text-[10px]">SIMULATED</span>
                                </>
                            )}
                            {/* Duplicate for seamless ticker scroll */}
                            <span className="text-reiks-dim">•</span>
                            <span className="text-gold font-semibold">
                                XAU ₹{price.gold_24k_gram.toFixed(0)}/g
                            </span>
                            <span className="text-reiks-mid">
                                22K ₹{price.gold_22k_gram.toFixed(0)}
                            </span>
                            <span className="text-reiks-mid">
                                18K ₹{price.gold_18k_gram.toFixed(0)}
                            </span>
                        </>
                    )}
                    {!price && (
                        <span className="text-reiks-dim">Loading gold prices...</span>
                    )}
                </div>
            </div>

            {/* Main Nav */}
            <header
                className={`sticky top-0 z-40 transition-all duration-300 ${scrolled
                        ? 'bg-reiks-black/95 backdrop-blur-md border-b border-reiks-border'
                        : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="text-2xl font-heading font-extrabold text-gold tracking-widest group-hover:text-gold-light transition-colors">
                                REIKS
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {[
                                { href: '/forge', label: 'Forge', icon: Wand2 },
                                { href: '/collection', label: 'Collection', icon: Grid3X3 },
                                { href: '/vault', label: 'Vault', icon: Lock },
                                { href: '/concierge', label: 'Concierge', icon: MessageCircle },
                            ].map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-1.5 text-sm text-reiks-mid hover:text-gold transition-colors font-medium"
                                >
                                    <item.icon size={14} />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {price && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-reiks-card rounded-lg border border-reiks-border">
                                    <span className="text-xs font-mono text-reiks-mid">24K</span>
                                    <span className="text-sm font-mono font-bold text-gold">
                                        ₹{price.gold_24k_gram.toFixed(0)}
                                    </span>
                                </div>
                            )}
                            <Link
                                href="/account"
                                className="p-2 rounded-lg hover:bg-reiks-card transition-colors text-reiks-mid hover:text-gold"
                            >
                                <User size={18} />
                            </Link>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-reiks-mid hover:text-gold transition-colors"
                        >
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-reiks-dark border-t border-reiks-border animate-fade-in">
                        <nav className="px-4 py-3 flex flex-col gap-1">
                            {[
                                { href: '/', label: 'Home', icon: Home },
                                { href: '/forge', label: 'AI Design Studio', icon: Wand2 },
                                { href: '/collection', label: 'Collection', icon: Grid3X3 },
                                { href: '/vault', label: 'VaultTrade', icon: Lock },
                                { href: '/concierge', label: 'AI Concierge', icon: MessageCircle },
                                { href: '/account', label: 'Account', icon: User },
                            ].map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-reiks-mid hover:text-gold hover:bg-reiks-card transition-colors"
                                >
                                    <item.icon size={18} />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* Mobile Bottom Tab Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-reiks-dark/95 backdrop-blur-md border-t border-reiks-border">
                <nav className="flex items-center justify-around h-14 px-2">
                    {[
                        { href: '/', label: 'Home', icon: Home },
                        { href: '/forge', label: 'Forge', icon: Wand2 },
                        { href: '/vault', label: 'Vault', icon: Lock },
                        { href: '/concierge', label: 'Chat', icon: MessageCircle },
                        { href: '/account', label: 'Account', icon: User },
                    ].map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center gap-0.5 text-reiks-dim hover:text-gold transition-colors"
                        >
                            <item.icon size={18} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    )
}
