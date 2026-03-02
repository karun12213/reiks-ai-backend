'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useGoldPrice } from '@/hooks/useGoldPrice'
import { formatINR } from '@/lib/utils'
import { User, Package, Lock, Heart, Settings, LogIn, Sparkles, TrendingUp, ShoppingBag, ArrowRight, X } from 'lucide-react'
import { SEED_PRODUCTS } from '@/lib/seed-products'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

type Tab = 'overview' | 'orders' | 'locks' | 'designs' | 'settings'

export default function AccountPage() {
    const router = useRouter()
    const { price } = useGoldPrice()
    const [tab, setTab] = useState<Tab>('overview')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [orders, setOrders] = useState<any[]>([])
    const [locks, setLocks] = useState<any[]>([])
    const [fetchedSip, setFetchedSip] = useState<any>(null)
    const [designs, setDesigns] = useState<any[]>([])
    const [wishlist, setWishlist] = useState<any[]>([])
    const [sipModal, setSipModal] = useState(false)
    const [sipAmount, setSipAmount] = useState(5000)
    const [selectedOrder, setSelectedOrder] = useState<any>(null)

    useEffect(() => {
        const mockOrders = [
            { id: 'AUR-4921', product: '22K Classic Chain', amount: 45000, status: 'manufacturing', date: 'Oct 12' },
            { id: 'AUR-3810', product: '18K Rose Ring', amount: 28500, status: 'delivered', date: 'Sep 05' },
        ]
        const localOrders = JSON.parse(localStorage.getItem('aureum_orders') || '[]')
        setOrders(localOrders.length > 0 ? localOrders : mockOrders)

        const mockLocks = [
            { id: 'LK-082', product: '24K Coin (10g)', locked: 7150, current: 7210, expires: 'In 2 days', duration: '7d' },
        ]
        const localLocks = JSON.parse(localStorage.getItem('aureum_locks') || '[]')
        setLocks(localLocks.length > 0 ? localLocks : mockLocks)

        const localSip = JSON.parse(localStorage.getItem('aureum_sip') || 'null')
        if (localSip) {
            localSip.currentValue = localSip.goldAccumulated * (price?.gold_24k_gram || 7200)
            setFetchedSip(localSip)
        }

        const localDesigns = JSON.parse(localStorage.getItem('aureum_designs') || '[]')
        setDesigns(localDesigns)

        const savedIds = JSON.parse(localStorage.getItem('aureum_wishlist') || '[]')
        const savedProducts = SEED_PRODUCTS.filter(p => savedIds.includes(p.slug))
        setWishlist(savedProducts)

    }, [price?.gold_24k_gram])

    const activeSip = fetchedSip || {
        amount: 5000,
        frequency: 'monthly',
        nextDate: 'Oct 15, 2026',
        totalInvested: 45000,
        goldAccumulated: 6.25,
        currentValue: 6.25 * (price?.gold_24k_gram || 7200),
    }

    // sync initial slider when opening modal
    useEffect(() => {
        if (sipModal) setSipAmount(activeSip.amount)
    }, [sipModal, activeSip.amount])

    if (!isLoggedIn) {
        return (
            <>
                <Header />
                <main className="flex-1 flex items-center justify-center py-20 pb-32 md:pb-20">
                    <div className="max-w-sm w-full mx-auto px-4">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <User size={28} className="text-gold" />
                            </div>
                            <h1 className="text-2xl font-heading font-bold text-aureum-white mb-2">Welcome to AUREUM</h1>
                            <p className="text-sm text-aureum-dim">Sign in to track orders, save designs, and manage locks.</p>
                        </div>

                        <div className="space-y-3">
                            <button onClick={() => setIsLoggedIn(true)} className="btn-gold w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2">
                                <LogIn size={16} /> Sign in with Google
                            </button>
                            <button onClick={() => setIsLoggedIn(true)} className="btn-outline-gold w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2">
                                📱 Sign in with Phone
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-aureum-border" /></div>
                                <div className="relative flex justify-center"><span className="bg-aureum-black px-3 text-[10px] text-aureum-dim">OR</span></div>
                            </div>

                            <div className="space-y-2">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full px-4 py-3 bg-aureum-card border border-aureum-border rounded-lg text-sm text-aureum-white placeholder:text-aureum-dim focus:outline-none focus:border-gold/40"
                                />
                                <button onClick={() => setIsLoggedIn(true)} className="btn-gold w-full py-3 rounded-lg text-sm">
                                    Send Magic Link
                                </button>
                            </div>
                        </div>

                        {/* Preview Stats */}
                        <div className="mt-10 grid grid-cols-3 gap-3">
                            {[
                                { icon: Sparkles, label: 'AI Designs', value: '∞' },
                                { icon: Lock, label: 'Active Locks', value: '3' },
                                { icon: ShoppingBag, label: 'Total Orders', value: '12' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center p-3 rounded-xl border border-aureum-border bg-aureum-card/50">
                                    <stat.icon size={16} className="mx-auto text-gold mb-2" />
                                    <p className="text-sm font-mono text-aureum-white font-bold">{stat.value}</p>
                                    <p className="text-[9px] uppercase tracking-wider text-aureum-dim mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="flex-1 py-8 pb-24 md:pb-12 border-t border-aureum-border/50">
                <div className="max-w-6xl w-full mx-auto px-4 md:px-8">
                    {/* Header Profile */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-aureum-card p-6 rounded-2xl border border-aureum-border">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center">
                                <User size={28} className="text-gold" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-heading font-bold text-aureum-white">Alex Sterling</h1>
                                <p className="text-sm text-aureum-dim mt-1 flex items-center gap-2">alex@sterling.com <span className="w-1 h-1 rounded-full bg-aureum-dim" /> +91 98765 43210</p>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="flex-1 md:flex-none bg-aureum-dark px-4 py-3 rounded-xl border border-aureum-border text-center">
                                <p className="text-[10px] uppercase tracking-wider text-aureum-dim mb-1">Total Vault Gold</p>
                                <p className="font-mono text-lg text-gold font-bold">{activeSip.goldAccumulated.toFixed(4)}g</p>
                            </div>
                            <div className="flex-1 md:flex-none bg-aureum-dark px-4 py-3 rounded-xl border border-aureum-border text-center">
                                <p className="text-[10px] uppercase tracking-wider text-aureum-dim mb-1">AUREUM Tier</p>
                                <p className="font-mono text-lg text-aureum-white font-bold">Platinum</p>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-1">
                            <div className="flex overflow-x-auto lg:flex-col gap-2 lg:gap-1 pb-2 lg:pb-0 hide-scroll">
                                <button onClick={() => setTab('overview')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === 'overview' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-aureum-dim hover:text-aureum-white hover:bg-aureum-card'}`}>
                                    <TrendingUp size={18} /> Overview
                                </button>
                                <button onClick={() => setTab('orders')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === 'orders' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-aureum-dim hover:text-aureum-white hover:bg-aureum-card'}`}>
                                    <Package size={18} /> Order History
                                    <span className="ml-auto bg-aureum-dark px-2 py-0.5 rounded text-[10px]">{orders.length}</span>
                                </button>
                                <button onClick={() => setTab('locks')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === 'locks' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-aureum-dim hover:text-aureum-white hover:bg-aureum-card'}`}>
                                    <Lock size={18} /> Price Locks
                                    <span className="ml-auto bg-aureum-dark px-2 py-0.5 rounded text-[10px]">{locks.length}</span>
                                </button>
                                <button onClick={() => setTab('designs')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === 'designs' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-aureum-dim hover:text-aureum-white hover:bg-aureum-card'}`}>
                                    <Heart size={18} /> Wishlist
                                    {wishlist.length > 0 && <span className="ml-auto bg-aureum-dark px-2 py-0.5 rounded text-[10px] text-error">{wishlist.length}</span>}
                                </button>
                                <button onClick={() => setTab('settings')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === 'settings' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-aureum-dim hover:text-aureum-white hover:bg-aureum-card'}`}>
                                    <Settings size={18} /> Settings
                                </button>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-3">
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={tab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {tab === 'overview' && (
                                        <div className="space-y-6">
                                            {/* Active SIP Card */}
                                            <div className="bg-gradient-to-br from-[#1a1205] to-aureum-black border border-gold/30 rounded-2xl p-6 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[100px] rounded-full pointer-events-none" />
                                                <div className="flex items-center justify-between mb-6 relative">
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles size={20} className="text-gold" />
                                                        <h3 className="font-heading font-bold text-lg text-aureum-white">Active VaultTrade SIP</h3>
                                                    </div>
                                                    <span className="text-xs uppercase tracking-wider font-semibold text-gold bg-gold/10 px-3 py-1 rounded-full">{activeSip.frequency}</span>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider text-aureum-dim mb-1">Monthly Auto-Buy</p>
                                                        <p className="font-mono text-base text-aureum-white mb-0.5">{formatINR(activeSip.amount)}</p>
                                                        <p className="text-[10px] text-aureum-dim">Next: {activeSip.nextDate}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider text-aureum-dim mb-1">Gold Accumulated</p>
                                                        <p className="font-mono text-base text-gold font-bold mb-0.5">{activeSip.goldAccumulated.toFixed(4)}g</p>
                                                        <p className="text-[10px] text-aureum-dim">24K 99.9% Purity</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider text-aureum-dim mb-1">Total Invested</p>
                                                        <p className="font-mono text-base text-aureum-white mb-0.5">{formatINR(activeSip.totalInvested)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider text-aureum-dim mb-1">Current Value</p>
                                                        <p className="font-mono text-base text-success mb-0.5">{formatINR(activeSip.currentValue)}</p>
                                                        <p className="text-[10px] text-success">+{((activeSip.currentValue - activeSip.totalInvested) / activeSip.totalInvested * 100).toFixed(1)}% Yield</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-6 relative">
                                                    <button onClick={() => setSipModal(true)} className="flex-1 flex items-center justify-center gap-2 text-xs font-medium text-gold py-2.5 hover:bg-gold/10 rounded-lg transition-colors border border-gold/20">
                                                        Manage Settings
                                                    </button>
                                                    <button onClick={() => router.push('/forge')} className="flex-1 flex items-center justify-center gap-2 text-xs font-medium text-aureum-black bg-gold py-2.5 hover:bg-gold-light rounded-lg transition-colors shadow-[0_0_15px_rgba(212,168,83,0.3)]">
                                                        Convert to Jewellery <ArrowRight size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Recent Orders */}
                                                <div className="bg-aureum-card border border-aureum-border rounded-xl p-5">
                                                    <h4 className="font-semibold text-aureum-white mb-4 flex items-center gap-2"><Package size={16} className="text-gold" /> Recent Orders</h4>
                                                    <div className="space-y-4">
                                                        {orders.slice(0, 3).map((o: any) => (
                                                            <div key={o.id} onClick={() => setSelectedOrder(o)} className="flex justify-between items-center pb-4 border-b border-aureum-border/50 last:border-0 last:pb-0 cursor-pointer hover:bg-aureum-dark/30 p-2 -mx-2 rounded transition-colors group">
                                                                <div>
                                                                    <p className="text-sm font-medium text-aureum-mid group-hover:text-gold transition-colors">{o.product}</p>
                                                                    <p className="text-[10px] text-aureum-dim mt-0.5">{o.id} • {o.date || o.placed}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-sm font-mono text-aureum-white mb-1 group-hover:text-gold transition-colors">{formatINR(o.amount)}</p>
                                                                    <span className={`text-[9px] px-2 py-0.5 rounded uppercase tracking-wider ${o.status === 'delivered' ? 'bg-success/10 text-success' : 'bg-gold/10 text-gold'}`}>{o.status}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button onClick={() => setTab('orders')} className="w-full mt-5 pt-4 border-t border-aureum-border text-xs tracking-wider uppercase text-gold hover:text-gold-light transition-colors">View All Orders</button>
                                                </div>
                                                {/* Active Locks */}
                                                <div className="bg-aureum-card border border-aureum-border rounded-xl p-5">
                                                    <h4 className="font-semibold text-aureum-white mb-4 flex items-center gap-2"><Lock size={16} className="text-gold" /> Active Price Locks</h4>
                                                    <div className="space-y-4">
                                                        {locks.slice(0, 3).map((l: any) => (
                                                            <div key={l.id} className="flex justify-between items-center pb-4 border-b border-aureum-border/50 last:border-0 last:pb-0">
                                                                <div>
                                                                    <p className="text-sm font-medium text-aureum-mid">{l.product}</p>
                                                                    <p className="text-[10px] text-aureum-dim mt-0.5">{l.id} • Locked {formatINR(l.locked)}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className={`text-sm font-mono mb-1 ${(l.current || price?.gold_24k_gram || l.locked) > l.locked ? 'text-success' : 'text-error'}`}>
                                                                        {(l.current || price?.gold_24k_gram || l.locked) > l.locked ? '+' : ''}{formatINR((l.current || price?.gold_24k_gram || l.locked) - l.locked)}
                                                                    </p>
                                                                    <span className="text-[10px] text-aureum-dim">{l.expires || l.duration}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button onClick={() => setTab('locks')} className="w-full mt-5 pt-4 border-t border-aureum-border text-xs tracking-wider uppercase text-gold hover:text-gold-light transition-colors">Manage Locks</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {tab === 'orders' && (
                                        <div className="space-y-4">
                                            {orders.map((o: any) => (
                                                <div key={o.id} onClick={() => setSelectedOrder(o)} className="bg-aureum-card border border-aureum-border hover:border-gold/30 rounded-xl p-5 cursor-pointer transition-colors group">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className="text-base font-medium text-aureum-white group-hover:text-gold transition-colors">{o.product}</h4>
                                                            <p className="text-xs font-mono text-aureum-dim mt-1">{o.id} • Ordered {o.date || o.placed}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-mono text-aureum-white font-bold mb-1">{formatINR(o.amount)}</p>
                                                            <span className={`text-[10px] px-2.5 py-1 rounded-sm uppercase tracking-wider font-medium ${o.status === 'delivered' ? 'bg-success/10 text-success' : o.status === 'manufacturing' ? 'bg-warning/10 text-warning' : 'bg-gold/10 text-gold'}`}>
                                                                {o.status.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {o.status !== 'delivered' && (
                                                        <div className="w-full bg-aureum-dark h-1.5 rounded-full overflow-hidden mt-4">
                                                            <div className={`h-full bg-gold rounded-full w-[50%]`} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {orders.length === 0 && (
                                                <div className="text-center py-20 bg-aureum-card rounded-xl border border-aureum-border border-dashed">
                                                    <Package className="mx-auto text-aureum-dim mb-4" size={32} />
                                                    <p className="text-aureum-white font-medium mb-1">No orders yet</p>
                                                    <p className="text-aureum-dim text-sm">Explore our collection to place your first order.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {tab === 'locks' && (
                                        <div className="space-y-4">
                                            {locks.length === 0 ? (
                                                <div className="text-center py-20 bg-aureum-card rounded-xl border border-aureum-border border-dashed">
                                                    <Lock className="mx-auto text-aureum-dim mb-4" size={32} />
                                                    <p className="text-aureum-white font-medium mb-1">No active price locks</p>
                                                    <p className="text-aureum-dim text-sm flex items-center justify-center gap-1">Lock today's price of <span className="font-mono text-gold">{formatINR(price?.gold_24k_gram || 0)}</span> per gram.</p>
                                                </div>
                                            ) : (
                                                locks.map((l: any) => {
                                                    const isProfitable = (l.current || price?.gold_24k_gram || l.locked) > l.locked
                                                    return (
                                                        <div key={l.id} className="bg-aureum-card border border-aureum-border rounded-xl p-5">
                                                            <div className="flex justify-between items-start mb-6">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <h4 className="text-base font-medium text-aureum-white">{l.product}</h4>
                                                                        <span className="text-[9px] uppercase tracking-wider bg-warning/10 text-warning px-1.5 py-0.5 rounded font-bold">Active</span>
                                                                    </div>
                                                                    <p className="text-xs font-mono text-aureum-dim">{l.id} • Expires {l.expires}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-[10px] uppercase tracking-wider text-aureum-dim mb-0.5">Value Gained</p>
                                                                    <p className={`text-lg font-mono font-bold ${isProfitable ? 'text-success' : 'text-error'}`}>
                                                                        {isProfitable ? '+' : ''}{formatINR((l.current || price?.gold_24k_gram || l.locked) - l.locked)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 p-4 bg-aureum-dark rounded-lg mb-4 border border-aureum-border/50">
                                                                <div>
                                                                    <p className="text-[10px] uppercase tracking-wider text-aureum-dim mb-1">Locked Price</p>
                                                                    <p className="text-sm font-mono text-aureum-white">{formatINR(l.locked)} <span className="text-[10px] text-aureum-dim normal-case">/gram</span></p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] uppercase tracking-wider text-aureum-dim mb-1">Current Price</p>
                                                                    <p className="text-sm font-mono text-aureum-white">{formatINR(l.current || price?.gold_24k_gram || l.locked)} <span className="text-[10px] text-aureum-dim normal-case">/gram</span></p>
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-aureum-border/50">
                                                                <button className="text-xs font-semibold text-aureum-dim hover:text-error transition-colors px-3 py-2">Abandon Lock</button>
                                                                <button onClick={() => {
                                                                    const karat = l.product.includes('22K') ? 22 : l.product.includes('18K') ? 18 : l.product.includes('14K') ? 14 : 24
                                                                    const name = l.product.replace(/(\d+K\s*)/, '')
                                                                    router.push(`/checkout?mode=buy&name=${encodeURIComponent(name)}&price=${l.locked}&karat=${karat}&weight=10`) // default weight for locks in demo
                                                                }} className="text-xs font-semibold text-aureum-black bg-gold hover:bg-gold-light transition-colors px-4 py-2 rounded-lg">Exercise Lock (Buy)</button>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                    )}

                                    {tab === 'designs' && (
                                        <div className="space-y-8">
                                            {/* Saved Wishlist Items */}
                                            <div>
                                                <h4 className="font-heading font-bold text-lg text-aureum-white mb-4 flex items-center gap-2">
                                                    <Heart size={18} className="text-error fill-error" /> Saved Collection
                                                    <span className="text-xs bg-aureum-dark px-2 py-0.5 rounded text-aureum-dim font-mono ml-2">{wishlist.length}</span>
                                                </h4>

                                                {wishlist.length === 0 ? (
                                                    <div className="text-center py-10 bg-aureum-card rounded-xl border border-aureum-border/50 border-dashed">
                                                        <Heart size={24} className="mx-auto text-aureum-dim mb-3" />
                                                        <p className="text-sm text-aureum-dim font-medium">Your wishlist is empty</p>
                                                        <button onClick={() => router.push('/collection')} className="mt-4 text-xs font-semibold text-gold hover:text-gold-light transition-colors">Browse Collection →</button>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                        {wishlist.map(w => (
                                                            <Link key={w.slug} href={`/product/${w.slug}`} className="bg-aureum-card border border-aureum-border rounded-xl overflow-hidden group card-hover block">
                                                                <div className="aspect-square bg-gradient-to-br from-aureum-card to-aureum-dark flex items-center justify-center relative">
                                                                    <div className="text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                                                                        {w.category === 'rings' ? '💍' : w.category === 'chains' ? '🔗' : w.category === 'pendants' ? '📿' : w.category === 'bracelets' ? '⌚' : w.category === 'earrings' ? '✨' : w.category === 'bangles' ? '⭕' : '👑'}
                                                                    </div>
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.preventDefault()
                                                                            const newWishlist = wishlist.filter(p => p.slug !== w.slug)
                                                                            setWishlist(newWishlist)
                                                                            localStorage.setItem('aureum_wishlist', JSON.stringify(newWishlist.map(i => i.slug)))
                                                                        }}
                                                                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-all z-10"
                                                                    >
                                                                        <Heart size={14} className="fill-error text-error scale-110" />
                                                                    </button>
                                                                    <div className="absolute bottom-2 left-2"><span className="text-[10px] font-mono text-gold bg-black/60 px-1.5 py-0.5 rounded">{w.base_weight_grams}g</span></div>
                                                                </div>
                                                                <div className="p-3">
                                                                    <p className="text-xs font-medium text-aureum-white truncate">{w.name}</p>
                                                                    <p className="text-[10px] text-aureum-dim mt-0.5">{w.default_karat}K {w.metal}</p>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Custom AI Designs */}
                                            <div className="pt-6 border-t border-aureum-border/30">
                                                <h4 className="font-heading font-bold text-lg text-aureum-white mb-4 flex items-center gap-2">
                                                    <Sparkles size={18} className="text-gold" /> AI Forge Creations
                                                    <span className="text-xs bg-aureum-dark px-2 py-0.5 rounded text-aureum-dim font-mono ml-2">{designs.length}</span>
                                                </h4>

                                                {designs.length === 0 ? (
                                                    <div className="text-center py-10 bg-aureum-card rounded-xl border border-aureum-border/50 border-dashed">
                                                        <Sparkles size={24} className="mx-auto text-aureum-dim mb-3" />
                                                        <p className="text-sm text-aureum-dim font-medium">No custom designs yet</p>
                                                        <button onClick={() => router.push('/forge')} className="mt-4 text-xs font-semibold text-gold hover:text-gold-light transition-colors">Open Forge AI →</button>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                        {designs.map((d: any, index: number) => (
                                                            <div key={index} className="bg-aureum-card border border-aureum-border rounded-xl overflow-hidden group">
                                                                <div className="aspect-square bg-aureum-dark relative">
                                                                    <img src={d.imageUrl} alt={d.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-aureum-black/80 via-transparent to-transparent" />
                                                                    <div className="absolute bottom-3 left-3 right-3">
                                                                        <p className="text-[10px] text-aureum-dim line-clamp-2 leading-tight">{d.prompt}</p>
                                                                        <div className="flex justify-between items-center mt-2">
                                                                            <span className="text-xs font-mono text-gold font-bold">{formatINR(d.estimatedPrice)}</span>
                                                                            <button onClick={() => router.push('/forge')} className="text-[10px] uppercase tracking-wider text-aureum-white hover:text-gold transition-colors">Re-forge</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {tab === 'settings' && (
                                        <div className="bg-aureum-card rounded-2xl border border-aureum-border p-10 min-h-[300px] flex items-center justify-center text-center">
                                            <div>
                                                <Settings className="mx-auto text-aureum-dim mb-4" size={32} />
                                                <h3 className="text-aureum-white font-medium mb-1 capitalize">Settings</h3>
                                                <p className="text-aureum-dim text-sm">This section is currently in development.</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {/* SIP Management Modal */}
            <AnimatePresence>
                {sipModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aureum-black/80 backdrop-blur-sm"
                        onClick={() => setSipModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-sm bg-aureum-card border border-aureum-border rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={18} className="text-gold" />
                                    <h3 className="text-lg font-heading font-bold text-aureum-white">Adjust Gold SIP</h3>
                                </div>
                                <button onClick={() => setSipModal(false)} className="p-1 text-aureum-dim hover:text-gold"><X size={16} /></button>
                            </div>

                            <div className="p-3 bg-aureum-dark rounded-lg mb-6 border border-aureum-border/50">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-aureum-dim">Current Plan</span>
                                    <span className="text-aureum-white font-mono">₹5,000/mo</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-aureum-dim">Frequency</span>
                                    <span className="text-aureum-white capitalize">{activeSip.frequency}</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-end mb-4">
                                    <label className="text-sm font-medium text-aureum-white">New Monthly Deposit</label>
                                    <span className="text-lg font-mono font-bold text-gold">{formatINR(sipAmount)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1000"
                                    max="50000"
                                    step="1000"
                                    value={sipAmount}
                                    onChange={(e) => setSipAmount(Number(e.target.value))}
                                    className="w-full accent-gold h-1 bg-aureum-dark rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-aureum-dim mt-2 font-mono">
                                    <span>₹1k</span>
                                    <span>₹50k</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setFetchedSip({ ...activeSip, amount: sipAmount })
                                    setSipModal(false)
                                    // in real app this updates via API
                                }}
                                className="w-full py-3 bg-gold hover:bg-gold-light text-aureum-black font-semibold rounded-lg transition-colors"
                            >
                                Confirm Changes
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aureum-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedOrder(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-md bg-aureum-card border border-aureum-border rounded-2xl p-6"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-heading font-bold text-aureum-white mb-1">{selectedOrder.product}</h3>
                                    <p className="text-xs font-mono text-aureum-dim">ID: {selectedOrder.id}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-1 text-aureum-dim hover:text-gold"><X size={16} /></button>
                            </div>

                            <div className="space-y-6">
                                {/* Status timeline */}
                                <div className="p-4 bg-aureum-dark rounded-xl border border-aureum-border/50">
                                    <h4 className="text-xs uppercase tracking-wider text-aureum-dim mb-3">Order Status</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30 text-gold">
                                            {selectedOrder.status === 'delivered' ? <Package size={14} /> : <Settings size={14} className={selectedOrder.status === 'processing' ? 'animate-spin-slow' : ''} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold capitalize text-aureum-white">{selectedOrder.status}</p>
                                            <p className="text-[10px] text-aureum-dim">Updated: {selectedOrder.date || selectedOrder.placed}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Specs */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-aureum-dim mb-1">Date</p>
                                        <p className="text-sm font-mono text-aureum-white">{selectedOrder.date || selectedOrder.placed}</p>
                                    </div>
                                    {selectedOrder.weight && (
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-aureum-dim mb-1">Specifications</p>
                                            <p className="text-sm font-mono text-aureum-white">{selectedOrder.weight}, {selectedOrder.karat}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Payment details */}
                                <div className="pt-4 border-t border-aureum-border/50">
                                    <h4 className="text-xs uppercase tracking-wider text-aureum-dim mb-3">Payment Summary</h4>
                                    <div className="space-y-2 mb-3">
                                        {selectedOrder.basePrice && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-aureum-dim">Base Price</span>
                                                <span className="font-mono text-aureum-white">{formatINR(selectedOrder.basePrice)}</span>
                                            </div>
                                        )}
                                        {selectedOrder.sipApplied && selectedOrder.sipApplied > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-success flex justify-between gap-1 items-center"><Sparkles size={12} /> Vault SIP Applied</span>
                                                <span className="font-mono text-success">- {formatINR(selectedOrder.sipApplied)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-t border-aureum-border border-dashed mt-2">
                                        <span className="font-medium text-aureum-white">Total Paid</span>
                                        <span className="text-lg font-bold font-mono text-gold">{formatINR(selectedOrder.amount)}</span>
                                    </div>
                                </div>

                                <button onClick={() => setSelectedOrder(null)} className="w-full py-3 bg-aureum-dark hover:bg-aureum-border transition-colors rounded-lg text-sm text-center border border-aureum-border font-medium">
                                    Download Electronic Invoice
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
