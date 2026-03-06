'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CreditCard, CheckCircle2, Lock, Shield, Loader2, ArrowLeft, Check, Sparkles } from 'lucide-react'
import { formatINR } from '@/lib/utils'
import { LOCK_PREMIUM_RATES } from '@/lib/constants'
import type { LockDuration } from '@/lib/types'

function CheckoutContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const mode = searchParams.get('mode') as 'buy' | 'lock' || 'buy'
    const name = searchParams.get('name') || 'Custom Item'
    const weight = searchParams.get('weight') || '10'
    const karat = searchParams.get('karat') || '22'
    const priceStr = searchParams.get('price') || '0'
    const price = parseInt(priceStr)

    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [customerName, setCustomerName] = useState('Priya S.')
    const [duration, setDuration] = useState<LockDuration>('24h')
    const [sipBalance, setSipBalance] = useState<number>(0)
    const [applySip, setApplySip] = useState(false)

    const lockPremium = mode === 'lock' ? Math.round(price * LOCK_PREMIUM_RATES[duration]) : 0

    // Total calculation with SIP offset
    const subtotal = mode === 'buy' ? price : lockPremium
    const totalToPay = Math.max(0, subtotal - (applySip ? sipBalance : 0))

    useEffect(() => {
        if (!name || !price) {
            router.push('/collection')
        }

        // Check for active SIP to apply as credit if buying
        if (mode === 'buy') {
            const localSip = JSON.parse(localStorage.getItem('reiks_sip') || 'null')
            if (localSip && localSip.currentValue > 0) {
                setSipBalance(localSip.currentValue)
            }
        }
    }, [name, price, router, mode])

    const handleConfirm = async () => {
        if (mode === 'buy' && applySip && sipBalance < price) {
            alert(`Insufficient SIP Balance. You need at least ₹${price.toLocaleString()} in your SIP to use this feature.`)
            return
        }

        setIsProcessing(true)
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        if (mode === 'buy') {
            const newOrder = {
                id: `AUR-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                customer: customerName,
                product: name,
                amount: totalToPay,
                basePrice: price,
                sipApplied: applySip ? Math.min(sipBalance, price) : 0,
                status: 'processing',
                placed: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                weight,
                karat
            }
            const existingOrders = JSON.parse(localStorage.getItem('reiks_orders') || '[]')
            localStorage.setItem('reiks_orders', JSON.stringify([newOrder, ...existingOrders]))

            // Deduct applied SIP
            if (applySip && sipBalance > 0) {
                const localSip = JSON.parse(localStorage.getItem('reiks_sip') || '{}')
                if (localSip) {
                    localSip.currentValue = Math.max(0, localSip.currentValue - price)
                    localSip.totalInvested = Math.max(0, localSip.totalInvested - price)
                    // Note: For a real app, recalculate goldAccumulated here too based on price
                    localStorage.setItem('reiks_sip', JSON.stringify(localSip))
                }
            }

            router.push(`/success?type=buy&id=${newOrder.id}&amount=${totalToPay}&product=${encodeURIComponent(name)}`)
            return // exit early
        } else {
            const newLock = {
                id: `LK-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                user: customerName,
                product: `${karat}K ${name}`,
                locked: price,
                current: price,
                duration: duration,
                premium: lockPremium,
                expires: 'Active',
                status: 'active'
            }
            const existingLocks = JSON.parse(localStorage.getItem('reiks_locks') || '[]')
            localStorage.setItem('reiks_locks', JSON.stringify([newLock, ...existingLocks]))
        }

        setIsProcessing(false)
        setIsSuccess(true)

        setTimeout(() => {
            router.push('/vault')
        }, 2000)
    }

    if (isSuccess && mode === 'lock') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-reiks-card border border-reiks-border p-8 rounded-2xl relative overflow-hidden max-w-sm w-full mx-auto shadow-[0_0_30px_rgba(234,179,8,0.05)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-warning/10 blur-[40px] rounded-full pointer-events-none" />
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }} className="mb-6 relative z-10">
                        <div className="w-16 h-16 rounded-full bg-warning/10 border border-warning/30 flex items-center justify-center mx-auto mb-2 relative">
                            <Lock size={28} className="text-warning drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                        </div>
                    </motion.div>
                    <h2 className="text-xl font-heading font-bold text-reiks-white mb-2 relative z-10">
                        Price Locked Setup
                    </h2>
                    <p className="text-sm text-reiks-dim mb-6 relative z-10">
                        Your gold price is securely stored for {duration}. Reverting you back to the Vault.
                    </p>
                    <div className="loader border-[2px] border-warning border-t-transparent rounded-full w-5 h-5 animate-spin blur-[0.5px] mx-auto opacity-50 relative z-10"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 md:py-16">
            <button onClick={() => router.back()} className="text-xs text-reiks-dim hover:text-gold flex items-center gap-1 mb-8 transition-colors">
                <ArrowLeft size={12} /> Back
            </button>
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-reiks-white">
                    {mode === 'buy' ? 'Secure Checkout' : 'Secure Price Lock'}
                </h1>
                <p className="mt-2 text-sm text-reiks-dim flex items-center justify-center gap-2">
                    <Shield size={14} className="text-success" /> End-to-end encrypted
                </p>
            </div>

            <div className="bg-reiks-card rounded-2xl border border-reiks-border p-6 md:p-8">
                <div className="mb-8">
                    <h3 className="text-xs text-reiks-dim uppercase tracking-wider mb-4">Item Details</h3>
                    <div className="flex justify-between items-start pb-4 border-b border-reiks-border">
                        <div>
                            <div className="text-lg font-semibold text-reiks-white">{name}</div>
                            <div className="text-sm text-reiks-dim">{karat}K Gold • {weight}g</div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-mono font-bold text-gold">{formatINR(price)}</div>
                            <div className="text-[10px] text-reiks-dim">incl. taxes</div>
                        </div>
                    </div>
                </div>

                {mode === 'lock' && (
                    <div className="mb-8">
                        <label className="text-xs text-reiks-dim uppercase tracking-wider mb-3 block">Lock Duration</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['24h', '48h', '7d'] as LockDuration[]).map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDuration(d)}
                                    className={`py-3 rounded-lg text-sm font-mono text-center transition-all ${duration === d ? 'bg-gold text-reiks-black font-bold' : 'bg-reiks-dark border border-reiks-border text-reiks-mid hover:border-gold/30'}`}
                                >
                                    <div className="font-bold">{d}</div>
                                    <div className="text-[10px] opacity-70">{LOCK_PREMIUM_RATES[d] * 100}% premium</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-8 p-4 bg-reiks-dark rounded-xl border border-reiks-border">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-reiks-dim">{mode === 'buy' ? 'Order Total' : 'Total Locked Value'}</span>
                        <span className="text-reiks-white font-mono">{formatINR(price)}</span>
                    </div>
                    {mode === 'lock' && (
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-reiks-dim">Premium Required ({LOCK_PREMIUM_RATES[duration] * 100}%)</span>
                            <span className="text-warning font-mono">{formatINR(lockPremium)}</span>
                        </div>
                    )}

                    {/* SIP Application Toggle */}
                    {sipBalance > 0 && mode === 'buy' && (
                        <div className="flex items-center justify-between py-3 my-2 border-y border-reiks-border/30">
                            <label onClick={(e) => {
                                if (sipBalance < price) {
                                    e.preventDefault()
                                    alert(`Insufficient SIP Balance. You need at least ₹${price.toLocaleString()} in your SIP to use this feature.`)
                                    return
                                }
                                setApplySip(!applySip)
                            }} className={`flex items-center gap-3 cursor-pointer group ${sipBalance < price ? 'opacity-50' : ''}`}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${applySip ? 'bg-gold border-gold' : 'border-reiks-dim group-hover:border-gold/50'}`}>
                                    {applySip && <Check size={14} className="text-reiks-black font-bold" />}
                                </div>
                                <div className="text-sm">
                                    <span className="text-reiks-white block">Apply Vault SIP Gold</span>
                                    <span className="text-[10px] text-reiks-dim">Balance: {formatINR(sipBalance)}</span>
                                </div>
                            </label>
                            {applySip && (
                                <span className="text-success font-mono font-medium animate-in fade-in zoom-in">- {formatINR(Math.min(sipBalance, price))}</span>
                            )}
                        </div>
                    )}

                    <div className="flex justify-between text-base pt-3 mt-3 border-t border-reiks-border/50">
                        <span className="text-reiks-white font-medium">To Pay Now</span>
                        <span className="text-gold font-mono font-bold text-xl">{formatINR(totalToPay)}</span>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className="text-xs text-reiks-dim mb-2 block">Card Details</label>
                        <div className="relative">
                            <input disabled placeholder="xxxx xxxx xxxx xxxx" className="w-full px-4 py-3 bg-reiks-dark border border-reiks-border rounded-lg text-reiks-dim cursor-not-allowed font-mono opacity-50" />
                            <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-reiks-dim" />
                        </div>
                        <p className="text-[10px] text-reiks-dim mt-2 group flex items-center gap-1">
                            <Lock size={10} /> Test environment. No real funds needed.
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="btn-gold w-full py-4 rounded-xl text-lg flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <><Loader2 size={18} className="animate-spin" /> Processing Securely...</>
                    ) : (
                        <>{mode === 'buy' ? 'Confirm Order' : 'Lock Price'} • {formatINR(totalToPay)}</>
                    )}
                </button>
            </div>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <>
            <Header />
            <main className="flex-1 pb-20 md:pb-0">
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <Loader2 className="animate-spin text-gold" size={32} />
                    </div>
                }>
                    <CheckoutContent />
                </Suspense>
            </main>
            <Footer />
        </>
    )
}
