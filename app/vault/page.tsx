'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGoldPrice } from '@/hooks/useGoldPrice'
import { formatINR, getSessionInfo, calculatePrice } from '@/lib/utils'
import { generatePriceHistory } from '@/lib/gold/fetcher'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Lock, TrendingUp, Clock, Shield, ArrowUp, ArrowDown, Wallet, LineChart as LineChartIcon, Check, X, Sparkles, CheckCircle2 } from 'lucide-react'
import type { Karat, LockDuration } from '@/lib/types'
import { LOCK_PREMIUM_RATES } from '@/lib/constants'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

type TimeRange = '24h' | '7d' | '30d'

export default function VaultPage() {
    const { price } = useGoldPrice()
    const [timeRange, setTimeRange] = useState<TimeRange>('7d')
    const [lockDuration, setLockDuration] = useState<LockDuration>('24h')
    const [lockWeight, setLockWeight] = useState(10)
    const [lockKarat, setLockKarat] = useState<Karat>(22)
    const [lockSuccess, setLockSuccess] = useState(false)
    const [sipModal, setSipModal] = useState(false)
    const [sipSuccess, setSipSuccess] = useState(false)
    const [sipAmount, setSipAmount] = useState(2000)
    const [convertingId, setConvertingId] = useState<string | null>(null)

    const chartData = useMemo(() => {
        const base = price?.gold_24k_gram || 14573
        const points = timeRange === '24h' ? 24 : timeRange === '7d' ? 48 : 60
        return generatePriceHistory(base, points, (i) => {
            if (timeRange === '24h') return `${(i % 24).toString().padStart(2, '0')}:00`
            if (timeRange === '7d') return `Day ${Math.floor(i / 7) + 1}`
            return `Day ${i + 1}`
        })
    }, [price?.gold_24k_gram, timeRange])

    const sessionInfo = price ? getSessionInfo(price.session) : null
    const lockBreakdown = price ? calculatePrice(price.gold_24k_gram, lockWeight, lockKarat) : null
    const lockPremium = lockBreakdown ? Math.round(lockBreakdown.total * LOCK_PREMIUM_RATES[lockDuration]) : 0

    const [localLocks, setLocalLocks] = useState<any[]>([])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLocalLocks(JSON.parse(localStorage.getItem('aureum_locks') || '[]'))
        }
    }, [])

    // Simulated active locks merged with localStorage
    const activeLocks = useMemo(() => {
        const defaults = [
            { id: '1', product: 'Cuban Link 20"', karat: 22, weight: 18, locked: 6850, current: price?.gold_24k_gram || 14573, duration: '48h', expiresIn: '23h 14m', pnl: ((price?.gold_24k_gram || 14573) - 6850) * 18 * 0.916 },
            { id: '2', product: 'Om Pendant', karat: 22, weight: 4, locked: 7100, current: price?.gold_24k_gram || 14573, duration: '24h', expiresIn: '5h 42m', pnl: ((price?.gold_24k_gram || 14573) - 7100) * 4 * 0.916 },
        ]
        const merged = localLocks.filter(l => l.status === 'active').map(l => ({
            id: l.id,
            product: l.product,
            karat: 22,
            weight: 10,
            locked: l.locked,
            current: price?.gold_24k_gram || 14573,
            duration: l.duration,
            expiresIn: l.duration,
            pnl: ((price?.gold_24k_gram || 14573) - l.locked) * 10
        }))
        return [...merged, ...defaults]
    }, [localLocks, price?.gold_24k_gram])

    return (
        <>
            <Header />
            <main className="flex-1 pb-20 md:pb-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-heading font-bold text-aureum-white">
                                <span className="text-gold">Vault</span>Trade
                            </h1>
                            <p className="text-sm text-aureum-mid mt-1">Lock gold prices • Track your positions • Gold SIP</p>
                        </div>
                        {price && sessionInfo && (
                            <div className="flex items-center gap-3 px-4 py-2 bg-aureum-card rounded-xl border border-aureum-border">
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: sessionInfo.color }} />
                                <div>
                                    <span className="text-[10px] font-mono text-aureum-dim">{price.session} SESSION</span>
                                    <div className="text-lg font-mono font-bold text-gold">₹{price.gold_24k_gram.toFixed(0)}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Gold Price Chart */}
                    <div className="bg-aureum-card rounded-2xl border border-aureum-border p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <LineChartIcon size={16} className="text-gold" />
                                <h2 className="text-sm font-semibold text-aureum-white">Gold Price (24K, ₹/gram)</h2>
                            </div>
                            <div className="flex gap-1">
                                {(['24h', '7d', '30d'] as TimeRange[]).map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setTimeRange(r)}
                                        className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${timeRange === r ? 'bg-gold text-aureum-black font-bold' : 'text-aureum-dim hover:text-gold'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
                                <AreaChart data={chartData} style={{ outline: 'none' }}>
                                    <defs>
                                        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#D4A853" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#D4A853" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                                    <XAxis dataKey="t" tick={{ fill: '#555', fontSize: 10 }} axisLine={{ stroke: '#1a1a1a' }} />
                                    <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={{ stroke: '#1a1a1a' }} domain={['auto', 'auto']} />
                                    <Tooltip
                                        contentStyle={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 8, fontSize: 12 }}
                                        labelStyle={{ color: '#888' }}
                                        formatter={(value: number | string | undefined) => [typeof value === 'number' ? `₹${value.toFixed(0)}` : `₹${value}`, 'Gold']}
                                    />
                                    <Area type="monotone" dataKey="price" stroke="#D4A853" fill="url(#goldGrad)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Price Lock Creator */}
                        <div className="bg-aureum-card rounded-2xl border border-aureum-border p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Lock size={18} className="text-gold" />
                                <h2 className="text-lg font-heading font-bold text-aureum-white">Create Price Lock</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Duration */}
                                <div>
                                    <label className="text-xs text-aureum-dim uppercase tracking-wider mb-2 block">Lock Duration</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['24h', '48h', '7d'] as LockDuration[]).map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setLockDuration(d)}
                                                className={`py-3 rounded-lg text-sm font-mono text-center transition-all ${lockDuration === d ? 'bg-gold text-aureum-black font-bold' : 'bg-aureum-dark border border-aureum-border text-aureum-mid hover:border-gold/30'
                                                    }`}
                                            >
                                                <div className="font-bold">{d}</div>
                                                <div className="text-[10px] opacity-70">{LOCK_PREMIUM_RATES[d] * 100}% premium</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Karat */}
                                <div>
                                    <label className="text-xs text-aureum-dim uppercase tracking-wider mb-2 block">Karat</label>
                                    <div className="flex gap-2">
                                        {([14, 18, 22] as Karat[]).map(k => (
                                            <button
                                                key={k}
                                                onClick={() => setLockKarat(k)}
                                                className={`flex-1 py-2 rounded-lg text-sm font-mono transition-all ${lockKarat === k ? 'bg-gold text-aureum-black font-bold' : 'bg-aureum-dark border border-aureum-border text-aureum-mid hover:border-gold/30'
                                                    }`}
                                            >
                                                {k}K
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Weight */}
                                <div>
                                    <label className="text-xs text-aureum-dim uppercase tracking-wider mb-2 block">Weight: {lockWeight}g</label>
                                    <input type="range" min={2} max={50} step={1} value={lockWeight} onChange={e => setLockWeight(parseInt(e.target.value))} className="w-full accent-gold" />
                                </div>

                                {/* Summary */}
                                <div className="p-4 bg-aureum-dark rounded-xl border border-aureum-border">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-aureum-dim">Locked Value</span>
                                        <span className="text-aureum-white font-mono font-bold">{lockBreakdown ? formatINR(lockBreakdown.total) : '...'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-aureum-dim">Lock Premium ({LOCK_PREMIUM_RATES[lockDuration] * 100}%)</span>
                                        <span className="text-warning font-mono">{formatINR(lockPremium)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-2 border-t border-aureum-border">
                                        <span className="text-aureum-mid font-medium">Pay Now</span>
                                        <span className="text-gold font-mono font-bold">{formatINR(lockPremium)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setLockSuccess(true); setTimeout(() => setLockSuccess(false), 3000) }}
                                    className="btn-gold w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2"
                                >
                                    <Lock size={14} /> Lock Price for {lockDuration}
                                </button>
                                <AnimatePresence>
                                    {lockSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg flex items-center gap-2"
                                        >
                                            <Check size={14} className="text-success" />
                                            <div>
                                                <div className="text-xs font-semibold text-success">Price Locked!</div>
                                                <div className="text-[10px] text-aureum-dim">Gold at ₹{price?.gold_24k_gram.toFixed(0)}/g for {lockDuration}. Premium: {formatINR(lockPremium)}.</div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Active Locks */}
                        <div className="bg-aureum-card rounded-2xl border border-aureum-border p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Shield size={18} className="text-gold" />
                                <h2 className="text-lg font-heading font-bold text-aureum-white">Active Locks</h2>
                                <span className="text-[10px] font-mono text-aureum-dim ml-auto">{activeLocks.length} active</span>
                            </div>

                            <div className="space-y-3">
                                {activeLocks.map(lock => (
                                    <div key={lock.id} className="p-4 bg-aureum-dark rounded-xl border border-aureum-border">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-aureum-white">{lock.product}</span>
                                            <span className="text-xs font-mono px-2 py-0.5 bg-gold/10 text-gold rounded">{lock.duration}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="text-[10px] text-aureum-dim">Locked</div>
                                                <div className="text-sm font-mono text-aureum-mid">₹{lock.locked}/g</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-aureum-dim">Current</div>
                                                <div className="text-sm font-mono text-aureum-mid">₹{lock.current?.toFixed(0)}/g</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-aureum-dim">P&L</div>
                                                <div className={`text-sm font-mono font-bold flex items-center justify-center gap-1 ${lock.pnl >= 0 ? 'text-success' : 'text-error'}`}>
                                                    {lock.pnl >= 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                                                    {formatINR(Math.abs(lock.pnl))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-aureum-border/50">
                                            <span className="text-[10px] text-aureum-dim flex items-center gap-1">
                                                <Clock size={10} /> Expires in {lock.expiresIn}
                                            </span>
                                            <button
                                                onClick={() => { setConvertingId(lock.id); setTimeout(() => { setConvertingId(null); window.location.href = '/collection' }, 1500) }}
                                                className="text-[10px] font-mono text-gold hover:text-gold-light transition-colors"
                                            >
                                                {convertingId === lock.id ? '✓ Redirecting...' : 'Convert to Order →'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* SIP Section */}
                            <div className="mt-6 p-4 bg-aureum-dark rounded-xl border border-aureum-border">
                                <div className="flex items-center gap-2 mb-3">
                                    <Wallet size={16} className="text-gold" />
                                    <h3 className="text-sm font-semibold text-aureum-white">Gold SIP</h3>
                                </div>
                                <p className="text-xs text-aureum-dim mb-3">
                                    Invest ₹500+/month in gold automatically. Dollar-cost average into the market.
                                </p>
                                <button onClick={() => setSipModal(true)} className="btn-outline-gold w-full py-2 rounded-lg text-xs">
                                    Start Gold SIP →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {/* SIP Modal */}
            <AnimatePresence>
                {sipModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSipModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-sm bg-aureum-card border border-aureum-border rounded-2xl p-6"
                        >
                            {sipSuccess ? (
                                <div className="text-center py-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 blur-[40px] rounded-full pointer-events-none" />
                                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }} className="mb-6 relative z-10">
                                        <div className="w-16 h-16 rounded-full bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-2 relative">
                                            <Sparkles size={28} className="text-success drop-shadow-[0_0_15px_rgba(22,163,74,0.5)]" />
                                        </div>
                                    </motion.div>
                                    <h4 className="text-xl font-heading font-bold text-aureum-white mb-2 relative z-10">Gold SIP Activated</h4>
                                    <p className="text-sm text-aureum-dim mb-8 relative z-10">Your monthly investment of <span className="text-success font-mono font-medium">₹{sipAmount.toLocaleString()}</span> is now algorithmically accumulating gold.</p>
                                    <button onClick={() => { setSipModal(false); setTimeout(() => setSipSuccess(false), 500) }} className="bg-aureum-dark hover:bg-aureum-border border border-aureum-border transition-colors w-full py-3 rounded-lg text-sm text-aureum-white font-medium relative z-10">Return to Vault</button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={18} className="text-gold" />
                                            <h3 className="text-lg font-heading font-bold text-aureum-white">Start Gold SIP</h3>
                                        </div>
                                        <button onClick={() => setSipModal(false)} className="p-1 text-aureum-dim hover:text-gold"><X size={16} /></button>
                                    </div>
                                    <p className="text-xs text-aureum-dim mb-4">Invest monthly in gold. We buy at optimal prices using AI timing.</p>
                                    <label className="text-xs text-aureum-dim uppercase tracking-wider mb-2 block">Monthly Amount: ₹{sipAmount.toLocaleString()}</label>
                                    <input type="range" min={500} max={50000} step={500} value={sipAmount} onChange={e => setSipAmount(parseInt(e.target.value))} className="w-full accent-gold mb-4" />
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {[1000, 2000, 5000].map(a => (
                                            <button key={a} onClick={() => setSipAmount(a)} className={`py-2 rounded-lg text-xs font-mono transition-all ${sipAmount === a ? 'bg-gold text-aureum-black font-bold' : 'bg-aureum-dark border border-aureum-border text-aureum-mid'}`}>₹{a.toLocaleString()}</button>
                                        ))}
                                    </div>
                                    <div className="p-3 bg-aureum-dark rounded-lg mb-4">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-aureum-dim">Est. gold/month</span>
                                            <span className="text-gold font-mono">{price ? (sipAmount / price.gold_24k_gram).toFixed(2) : '—'}g</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-aureum-dim">Annual estimate</span>
                                            <span className="text-gold font-mono">{price ? (sipAmount * 12 / price.gold_24k_gram).toFixed(1) : '—'}g</span>
                                        </div>
                                    </div>
                                    <button onClick={() => {
                                        setSipSuccess(true);
                                        const newSip = {
                                            amount: sipAmount,
                                            frequency: 'monthly',
                                            nextDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                                            totalInvested: sipAmount, // 1st month processed upon confirmation 
                                            goldAccumulated: Number((sipAmount / (price?.gold_24k_gram || 14573)).toFixed(4)),
                                        }
                                        localStorage.setItem('aureum_sip', JSON.stringify(newSip))
                                    }} className="btn-gold w-full py-3 rounded-lg text-sm">Start SIP — ₹{sipAmount.toLocaleString()}/mo</button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
