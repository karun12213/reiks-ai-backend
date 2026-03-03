'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useGoldPrice } from '@/hooks/useGoldPrice'
import { calculatePrice, formatINR, metalLabel, karatLabel, formatWeight } from '@/lib/utils'
import { SEED_PRODUCTS } from '@/lib/seed-products'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Lock, ShoppingBag, Sparkles, ArrowLeft, Minus, Plus, Info, ChevronDown } from 'lucide-react'
import type { Karat } from '@/lib/types'

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.id as string
    const { price } = useGoldPrice()
    const product = SEED_PRODUCTS.find(p => p.slug === slug)

    const [selectedKarat, setSelectedKarat] = useState<Karat>(product?.default_karat ?? 22)
    const [weightMultiplier, setWeightMultiplier] = useState(1)
    const [isRush, setIsRush] = useState(false)
    const [showBreakdown, setShowBreakdown] = useState(false)

    const weight = (product?.base_weight_grams ?? 5) * weightMultiplier

    const breakdown = useMemo(() => {
        if (!price || !product) return null
        return calculatePrice(price.gold_24k_gram, weight, selectedKarat, product.making_charges_per_gram, isRush)
    }, [price, product, weight, selectedKarat, isRush])

    if (!product) {
        return (
            <>
                <Header />
                <main className="flex-1 flex items-center justify-center py-32">
                    <div className="text-center">
                        <p className="text-aureum-dim text-lg">Product not found</p>
                        <Link href="/collection" className="mt-4 inline-flex items-center gap-2 text-gold text-sm hover:text-gold-light">
                            <ArrowLeft size={14} /> Back to Collection
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    const relatedProducts = SEED_PRODUCTS
        .filter(p => p.category === product.category && p.slug !== product.slug)
        .slice(0, 4)

    return (
        <>
            <Header />
            <main className="flex-1 pb-20 md:pb-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Breadcrumb */}
                    <nav className="mb-6 flex items-center gap-2 text-xs text-aureum-dim">
                        <Link href="/collection" className="hover:text-gold transition-colors">Collection</Link>
                        <span>→</span>
                        <span className="capitalize">{product.category}</span>
                        <span>→</span>
                        <span className="text-aureum-mid">{product.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left: Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="aspect-square rounded-2xl bg-gradient-to-br from-aureum-card to-aureum-dark border border-aureum-border flex items-center justify-center relative overflow-hidden"
                        >
                            {product.images?.[0] ? (
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-8xl opacity-20">
                                    {product.category === 'rings' ? '💍' : product.category === 'chains' ? '🔗' : product.category === 'pendants' ? '📿' : product.category === 'bracelets' ? '⌚' : product.category === 'earrings' ? '✨' : product.category === 'bangles' ? '⭕' : '👑'}
                                </div>
                            )}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className="text-[10px] font-mono text-gold bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm border border-gold/20">
                                    {product.default_karat}K · {metalLabel(product.metal)}
                                </span>
                            </div>
                            {product.is_featured && (
                                <div className="absolute top-4 right-4">
                                    <span className="text-[10px] font-mono text-aureum-black bg-gold px-2 py-1 rounded-md font-bold">
                                        FEATURED
                                    </span>
                                </div>
                            )}
                        </motion.div>

                        {/* Right: Details + Calculator */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col"
                        >
                            <h1 className="text-2xl md:text-3xl font-heading font-bold text-aureum-white mb-2">
                                {product.name}
                            </h1>
                            <p className="text-sm text-aureum-mid leading-relaxed mb-6">{product.description}</p>

                            {/* Price Display */}
                            <div className="p-5 bg-aureum-card rounded-xl border border-aureum-border gold-border-glow mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs text-aureum-dim font-mono uppercase">Total Price</span>
                                    <span className="text-[10px] font-mono text-aureum-dim">
                                        {price?.isLive ? '🟢 LIVE' : '🟡 SIMULATED'}
                                    </span>
                                </div>
                                {breakdown ? (
                                    <div className="text-3xl font-mono font-bold text-gold">
                                        {formatINR(breakdown.total)}
                                    </div>
                                ) : (
                                    <div className="h-9 w-40 bg-aureum-border rounded animate-pulse" />
                                )}
                                <div className="mt-1 text-xs text-aureum-dim">
                                    incl. 3% GST · {karatLabel(selectedKarat)} · {formatWeight(weight)}
                                </div>

                                {/* Breakdown toggle */}
                                <button
                                    onClick={() => setShowBreakdown(!showBreakdown)}
                                    className="mt-3 flex items-center gap-1 text-xs text-gold hover:text-gold-light transition-colors"
                                >
                                    <Info size={12} />
                                    {showBreakdown ? 'Hide' : 'Show'} price breakdown
                                    <ChevronDown size={12} className={`transition-transform ${showBreakdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showBreakdown && breakdown && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-3 pt-3 border-t border-aureum-border space-y-1.5"
                                    >
                                        <div className="flex justify-between text-xs">
                                            <span className="text-aureum-dim">Gold (₹{breakdown.goldPricePerGram.toFixed(0)}/g × {formatWeight(weight)} × {(breakdown.purity * 100).toFixed(1)}%)</span>
                                            <span className="text-aureum-mid font-mono">{formatINR(breakdown.goldCost)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-aureum-dim">Making Charges (₹{product.making_charges_per_gram}/g{isRush ? ' × 1.25 rush' : ''})</span>
                                            <span className="text-aureum-mid font-mono">{formatINR(breakdown.makingCharges)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs pt-1 border-t border-aureum-border/50">
                                            <span className="text-aureum-dim">GST (3%)</span>
                                            <span className="text-aureum-mid font-mono">{formatINR(breakdown.gst)}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="space-y-4 mb-6">
                                {/* Karat */}
                                <div>
                                    <label className="text-xs text-aureum-dim font-semibold uppercase tracking-wider mb-2 block">Karat</label>
                                    <div className="flex gap-2">
                                        {product.available_karats.map(k => (
                                            <button
                                                key={k}
                                                onClick={() => setSelectedKarat(k)}
                                                className={`px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-all ${selectedKarat === k
                                                    ? 'bg-gold text-aureum-black'
                                                    : 'bg-aureum-dark border border-aureum-border text-aureum-mid hover:border-gold/30 hover:text-gold'
                                                    }`}
                                            >
                                                {k}K
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Weight Multiplier */}
                                <div>
                                    <label className="text-xs text-aureum-dim font-semibold uppercase tracking-wider mb-2 block">
                                        Weight: {formatWeight(weight)}
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setWeightMultiplier(prev => Math.max(0.5, prev - 0.25))}
                                            className="w-10 h-10 rounded-lg bg-aureum-dark border border-aureum-border text-aureum-mid hover:text-gold hover:border-gold/30 flex items-center justify-center transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <input
                                            type="range"
                                            min={0.5}
                                            max={3}
                                            step={0.25}
                                            value={weightMultiplier}
                                            onChange={e => setWeightMultiplier(parseFloat(e.target.value))}
                                            className="flex-1 accent-gold"
                                        />
                                        <button
                                            onClick={() => setWeightMultiplier(prev => Math.min(3, prev + 0.25))}
                                            className="w-10 h-10 rounded-lg bg-aureum-dark border border-aureum-border text-aureum-mid hover:text-gold hover:border-gold/30 flex items-center justify-center transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Rush */}
                                <label className="flex items-center gap-3 p-3 bg-aureum-dark rounded-lg border border-aureum-border cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isRush}
                                        onChange={e => setIsRush(e.target.checked)}
                                        className="accent-gold w-4 h-4"
                                    />
                                    <div>
                                        <span className="text-sm text-aureum-white font-medium">Rush Manufacturing</span>
                                        <span className="text-xs text-aureum-dim block">3-day delivery · +25% making charges</span>
                                    </div>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 mt-auto">
                                <button
                                    onClick={() => router.push(`/checkout?mode=buy&name=${encodeURIComponent(product.name)}&weight=${weight}&karat=${selectedKarat}&price=${breakdown?.total || 0}`)}
                                    className="btn-gold w-full py-3.5 rounded-lg text-sm tracking-wider flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag size={16} />
                                    Buy Now — {breakdown ? formatINR(breakdown.total) : '...'}
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => router.push(`/checkout?mode=lock&name=${encodeURIComponent(product.name)}&weight=${weight}&karat=${selectedKarat}&price=${breakdown?.total || 0}`)}
                                        className="btn-outline-gold py-3 rounded-lg text-sm tracking-wider flex items-center justify-center gap-2"
                                    >
                                        <Lock size={14} />
                                        Lock Price
                                    </button>
                                    <Link
                                        href={`/forge?prompt=${encodeURIComponent(`A customised version of the ${product.name}.`)}&weight=${weight}&karat=${selectedKarat}&metal=${product.metal}&category=${product.category}`}
                                        className="border border-aureum-border text-aureum-mid hover:text-gold hover:border-gold/30 py-3 rounded-lg text-sm tracking-wider flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Sparkles size={14} />
                                        Customize
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <section className="mt-16">
                            <h2 className="text-xl font-heading font-bold text-aureum-white mb-6">
                                More in <span className="text-gold capitalize">{product.category}</span>
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {relatedProducts.map(rp => {
                                    const rpPrice = price
                                        ? calculatePrice(price.gold_24k_gram, rp.base_weight_grams, rp.default_karat, rp.making_charges_per_gram)
                                        : null
                                    return (
                                        <Link
                                            key={rp.slug}
                                            href={`/product/${rp.slug}`}
                                            className="block bg-aureum-card rounded-xl border border-aureum-border card-hover overflow-hidden group"
                                        >
                                            <div className="aspect-square bg-gradient-to-br from-aureum-card to-aureum-dark flex items-center justify-center">
                                                <div className="text-3xl opacity-20 group-hover:opacity-30 transition-opacity">
                                                    {rp.category === 'rings' ? '💍' : rp.category === 'chains' ? '🔗' : '📿'}
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <h3 className="text-xs font-semibold text-aureum-white group-hover:text-gold transition-colors truncate">
                                                    {rp.name}
                                                </h3>
                                                {rpPrice && (
                                                    <div className="text-sm font-mono font-bold text-gold mt-1">
                                                        {formatINR(rpPrice.total)}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </section>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
