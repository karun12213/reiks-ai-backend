'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useGoldPrice } from '@/hooks/useGoldPrice'
import { calculatePrice, formatINR } from '@/lib/utils'
import { SEED_PRODUCTS } from '@/lib/seed-products'
import { CATEGORIES } from '@/lib/constants'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Search, SlidersHorizontal, ArrowUpDown, X, Heart } from 'lucide-react'
import type { Karat, ProductCategory, MetalType } from '@/lib/types'

const SORT_OPTIONS = [
    { value: 'price-low', label: 'Price: Low → High' },
    { value: 'price-high', label: 'Price: High → Low' },
    { value: 'weight-low', label: 'Weight: Light → Heavy' },
    { value: 'weight-high', label: 'Weight: Heavy → Light' },
    { value: 'name', label: 'Name A → Z' },
]

const KARAT_OPTIONS: Karat[] = [14, 18, 22, 24]
const METAL_OPTIONS: { value: MetalType; label: string }[] = [
    { value: 'gold', label: 'Yellow Gold' },
    { value: 'rose_gold', label: 'Rose Gold' },
    { value: 'silver', label: 'Silver' },
    { value: 'platinum', label: 'Platinum' },
]

export default function CollectionPage() {
    const { price } = useGoldPrice()
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState<ProductCategory | ''>('')
    const [metal, setMetal] = useState<MetalType | ''>('')
    const [karat, setKarat] = useState<Karat | 0>(0)
    const [sort, setSort] = useState('price-low')
    const [showFilters, setShowFilters] = useState(false)
    const [wishlist, setWishlist] = useState<string[]>([])

    // Load wishlist on mount
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('aureum_wishlist') || '[]')
        setWishlist(saved)
    }, [])

    const toggleWishlist = (e: React.MouseEvent, productId: string) => {
        e.preventDefault() // prevent navigating to product page
        const newWishlist = wishlist.includes(productId)
            ? wishlist.filter(id => id !== productId)
            : [...wishlist, productId]

        setWishlist(newWishlist)
        localStorage.setItem('aureum_wishlist', JSON.stringify(newWishlist))
    }

    const filtered = useMemo(() => {
        let items = [...SEED_PRODUCTS]

        // Search
        if (search) {
            const q = search.toLowerCase()
            items = items.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.short_description?.toLowerCase().includes(q) ||
                p.tags.some(t => t.includes(q))
            )
        }

        // Filters
        if (category) items = items.filter(p => p.category === category)
        if (metal) items = items.filter(p => p.metal === metal)
        if (karat) items = items.filter(p => p.default_karat === karat || p.available_karats.includes(karat))

        // Sort
        if (price) {
            const getPrice = (p: typeof items[0]) =>
                calculatePrice(price.gold_24k_gram, p.base_weight_grams, p.default_karat, p.making_charges_per_gram).total

            switch (sort) {
                case 'price-low': items.sort((a, b) => getPrice(a) - getPrice(b)); break
                case 'price-high': items.sort((a, b) => getPrice(b) - getPrice(a)); break
                case 'weight-low': items.sort((a, b) => a.base_weight_grams - b.base_weight_grams); break
                case 'weight-high': items.sort((a, b) => b.base_weight_grams - a.base_weight_grams); break
                case 'name': items.sort((a, b) => a.name.localeCompare(b.name)); break
            }
        }

        return items
    }, [search, category, metal, karat, sort, price])

    const activeFilterCount = [category, metal, karat].filter(Boolean).length

    return (
        <>
            <Header />
            <main className="flex-1 pb-20 md:pb-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-aureum-white">
                            Gold <span className="text-gold">Collection</span>
                        </h1>
                        <p className="mt-2 text-sm text-aureum-mid">
                            {filtered.length} pieces · Prices update live with the gold market
                        </p>
                    </div>

                    {/* Search + Filter Bar */}
                    <div className="flex items-center gap-3 mb-6">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-aureum-dim" />
                            <input
                                type="text"
                                placeholder="Search rings, chains, pendants..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-aureum-card border border-aureum-border rounded-lg text-sm text-aureum-white placeholder:text-aureum-dim focus:outline-none focus:border-gold/40 transition-colors"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border transition-colors ${showFilters || activeFilterCount
                                ? 'bg-gold/10 border-gold/30 text-gold'
                                : 'bg-aureum-card border-aureum-border text-aureum-mid hover:text-gold'
                                }`}
                        >
                            <SlidersHorizontal size={14} />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="w-5 h-5 bg-gold text-aureum-black rounded-full text-xs flex items-center justify-center font-bold">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        {/* Sort */}
                        <select
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                            className="hidden sm:block px-4 py-2.5 bg-aureum-card border border-aureum-border rounded-lg text-sm text-aureum-mid focus:outline-none focus:border-gold/40 appearance-none cursor-pointer"
                        >
                            {SORT_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 p-4 bg-aureum-card rounded-xl border border-aureum-border"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Category */}
                                <div>
                                    <label className="text-xs text-aureum-dim font-semibold uppercase tracking-wider mb-2 block">Category</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        <button
                                            onClick={() => setCategory('')}
                                            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${!category ? 'bg-gold text-aureum-black font-bold' : 'bg-aureum-dark text-aureum-mid hover:text-gold'}`}
                                        >
                                            All
                                        </button>
                                        {CATEGORIES.map(c => (
                                            <button
                                                key={c.id}
                                                onClick={() => setCategory(c.id as ProductCategory)}
                                                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${category === c.id ? 'bg-gold text-aureum-black font-bold' : 'bg-aureum-dark text-aureum-mid hover:text-gold'}`}
                                            >
                                                {c.icon} {c.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Metal */}
                                <div>
                                    <label className="text-xs text-aureum-dim font-semibold uppercase tracking-wider mb-2 block">Metal</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        <button
                                            onClick={() => setMetal('')}
                                            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${!metal ? 'bg-gold text-aureum-black font-bold' : 'bg-aureum-dark text-aureum-mid hover:text-gold'}`}
                                        >
                                            All
                                        </button>
                                        {METAL_OPTIONS.map(m => (
                                            <button
                                                key={m.value}
                                                onClick={() => setMetal(m.value)}
                                                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${metal === m.value ? 'bg-gold text-aureum-black font-bold' : 'bg-aureum-dark text-aureum-mid hover:text-gold'}`}
                                            >
                                                {m.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Karat */}
                                <div>
                                    <label className="text-xs text-aureum-dim font-semibold uppercase tracking-wider mb-2 block">Karat</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        <button
                                            onClick={() => setKarat(0)}
                                            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${!karat ? 'bg-gold text-aureum-black font-bold' : 'bg-aureum-dark text-aureum-mid hover:text-gold'}`}
                                        >
                                            All
                                        </button>
                                        {KARAT_OPTIONS.map(k => (
                                            <button
                                                key={k}
                                                onClick={() => setKarat(k)}
                                                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${karat === k ? 'bg-gold text-aureum-black font-bold' : 'bg-aureum-dark text-aureum-mid hover:text-gold'}`}
                                            >
                                                {k}K
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {activeFilterCount > 0 && (
                                <button
                                    onClick={() => { setCategory(''); setMetal(''); setKarat(0) }}
                                    className="mt-3 text-xs text-gold hover:text-gold-light flex items-center gap-1 transition-colors"
                                >
                                    <X size={12} /> Clear all filters
                                </button>
                            )}
                        </motion.div>
                    )}

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtered.map((product, i) => {
                            const livePrice = price
                                ? calculatePrice(price.gold_24k_gram, product.base_weight_grams, product.default_karat, product.making_charges_per_gram)
                                : null

                            return (
                                <motion.div
                                    key={product.slug}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                                >
                                    <Link
                                        href={`/product/${product.slug}`}
                                        className="block bg-aureum-card rounded-xl border border-aureum-border card-hover overflow-hidden group"
                                    >
                                        <div className="aspect-square bg-gradient-to-br from-aureum-card to-aureum-dark flex items-center justify-center relative overflow-hidden">
                                            <div className="text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                                                {product.category === 'rings' ? '💍' : product.category === 'chains' ? '🔗' : product.category === 'pendants' ? '📿' : product.category === 'bracelets' ? '⌚' : product.category === 'earrings' ? '✨' : product.category === 'bangles' ? '⭕' : '👑'}
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                            {/* Wishlist Button */}
                                            <button
                                                onClick={(e) => toggleWishlist(e, product.slug)}
                                                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-all z-10"
                                            >
                                                <Heart
                                                    size={16}
                                                    className={`transition-colors ${wishlist.includes(product.slug) ? 'fill-error text-error scale-110' : 'text-white hover:scale-110'}`}
                                                />
                                            </button>

                                            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                                <span className="text-[10px] font-mono text-gold bg-black/60 px-1.5 py-0.5 rounded">
                                                    {product.default_karat}K · {product.base_weight_grams}g
                                                </span>
                                                {product.is_featured && (
                                                    <span className="text-[9px] font-mono text-aureum-black bg-gold px-1.5 py-0.5 rounded font-bold">
                                                        FEATURED
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-3 sm:p-4">
                                            <h3 className="text-xs sm:text-sm font-semibold text-aureum-white group-hover:text-gold transition-colors truncate">
                                                {product.name}
                                            </h3>
                                            <p className="text-[10px] sm:text-xs text-aureum-dim mt-0.5 truncate">{product.short_description}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                {livePrice ? (
                                                    <span className="text-sm sm:text-base font-mono font-bold text-gold">
                                                        {formatINR(livePrice.total)}
                                                    </span>
                                                ) : (
                                                    <div className="h-5 w-16 bg-aureum-border rounded animate-pulse" />
                                                )}
                                                <span className="text-[9px] font-mono text-aureum-dim">
                                                    {price?.isLive ? 'LIVE' : 'SIM'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-aureum-dim text-sm">No products match your filters.</p>
                            <button
                                onClick={() => { setSearch(''); setCategory(''); setMetal(''); setKarat(0) }}
                                className="mt-3 text-sm text-gold hover:text-gold-light"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
