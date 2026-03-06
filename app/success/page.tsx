'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CheckCircle2, ShieldCheck, Truck, Award, Sparkles, ArrowRight, Lock } from 'lucide-react'
import { formatINR } from '@/lib/utils'

function SuccessContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [mounted, setMounted] = useState(false)

    const type = searchParams.get('type') || 'buy'
    const id = searchParams.get('id') || 'AUR-XXXX'
    const amount = parseInt(searchParams.get('amount') || '0')
    const product = searchParams.get('product') || 'Custom Jewellery'

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-reiks-black text-reiks-white flex flex-col pt-24">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-2xl bg-reiks-card border border-reiks-border rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
                >
                    {/* Background glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-gold/10 blur-[60px] rounded-full pointer-events-none" />

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="mb-6 relative z-10"
                    >
                        <div className="w-24 h-24 rounded-full bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-2 relative">
                            <div className="absolute inset-0 rounded-full border border-success/20 animate-ping opacity-50"></div>
                            <CheckCircle2 size={48} className="text-success drop-shadow-[0_0_15px_rgba(22,163,74,0.6)]" />
                        </div>
                    </motion.div>

                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-reiks-white mb-4 relative z-10">
                        Payment Successful
                    </h1>

                    <p className="text-reiks-mid mb-8 max-w-md mx-auto relative z-10">
                        Your order for <span className="text-gold font-medium">{product}</span> has been confirmed and placed in the manufacturing queue.
                    </p>

                    <div className="bg-reiks-dark/50 border border-reiks-border rounded-xl p-6 mb-10 relative z-10 max-w-sm mx-auto">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-reiks-dim uppercase tracking-wider">Order ID</span>
                            <span className="font-mono text-reiks-white font-medium">{id}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-t border-reiks-border/50">
                            <span className="text-sm text-reiks-dim uppercase tracking-wider">Total Paid</span>
                            <span className="font-mono text-xl text-gold font-bold">{formatINR(amount)}</span>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10 text-left">
                        <div className="bg-[#1a1c1a]/50 border border-success/20 rounded-lg p-4 flex flex-col items-center text-center">
                            <ShieldCheck size={24} className="text-success mb-2" />
                            <h4 className="text-sm font-bold text-reiks-white mb-1">AES-256 Secured</h4>
                            <p className="text-[10px] text-reiks-dim">Your transaction was fully encrypted and secured</p>
                        </div>
                        <div className="bg-[#1a1a15]/50 border border-gold/20 rounded-lg p-4 flex flex-col items-center text-center">
                            <Award size={24} className="text-gold mb-2" />
                            <h4 className="text-sm font-bold text-reiks-white mb-1">BIS Hallmarked</h4>
                            <p className="text-[10px] text-reiks-dim">Guaranteed purity standard for your physical gold</p>
                        </div>
                        <div className="bg-[#151a1c]/50 border border-blue-500/20 rounded-lg p-4 flex flex-col items-center text-center">
                            <Truck size={24} className="text-blue-500 mb-2" />
                            <h4 className="text-sm font-bold text-reiks-white mb-1">Insured Transit</h4>
                            <p className="text-[10px] text-reiks-dim">100% insured delivery via trusted logistics partners</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <button
                            onClick={() => router.push('/account')}
                            className="btn-gold px-8 py-3 rounded-lg text-sm font-medium"
                        >
                            Track Order in Dashboard
                        </button>
                        <button
                            onClick={() => router.push('/collection')}
                            className="bg-transparent border border-reiks-border text-reiks-white hover:text-gold hover:border-gold/50 px-8 py-3 rounded-lg text-sm font-medium transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    )
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-reiks-black flex items-center justify-center"><div className="loader border-[2px] border-gold border-t-transparent rounded-full w-8 h-8 animate-spin blur-[0.5px]"></div></div>}>
            <SuccessContent />
        </Suspense>
    )
}
