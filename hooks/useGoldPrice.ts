'use client'

import { useEffect, useState, useCallback } from 'react'
import type { GoldPriceData } from '@/lib/types'
import { simulateGoldPrice, getTradingSession, getSessionInfo } from '@/lib/utils'

export function useGoldPrice() {
    const [price, setPrice] = useState<GoldPriceData | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchPrice = useCallback(async () => {
        try {
            const headers: Record<string, string> = {}
            if (typeof window !== 'undefined') {
                const metalsKey = localStorage.getItem('aureum_metals_key')
                const goldApiKey = localStorage.getItem('aureum_gold_api_key')
                if (metalsKey) headers['x-metals-key'] = metalsKey
                if (goldApiKey) headers['x-goldapi-key'] = goldApiKey
            }

            const res = await fetch('/api/gold-price', { headers })
            if (res.ok) {
                const data = await res.json()
                setPrice(data)
                setLoading(false)
                return
            }
        } catch {
            // API unavailable — fall through to simulation
        }

        // Simulate prices if API fails
        const base = simulateGoldPrice()
        const session = getTradingSession()
        setPrice({
            gold_usd_oz: Math.round(base * 31.1035 / 91 * 100) / 100,
            gold_usd_gram: Math.round(base / 91 * 100) / 100,
            gold_inr_gram: base,
            gold_24k_gram: base,
            gold_22k_gram: Math.round(base * 0.916 * 100) / 100,
            gold_18k_gram: Math.round(base * 0.75 * 100) / 100,
            gold_14k_gram: Math.round(base * 0.585 * 100) / 100,
            silver_inr_gram: Math.round(base / 70 * 100) / 100,
            usd_inr: 91,
            session,
            timestamp: Date.now(),
            isLive: false,
        })
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchPrice()
        // Poll every 30 seconds
        const interval = setInterval(fetchPrice, 30000)
        // Micro-fluctuations every 2.5 seconds
        const microInterval = setInterval(() => {
            setPrice(prev => {
                if (!prev) return prev
                const delta = (Math.random() - 0.48) * 3
                const newBase = prev.gold_24k_gram + delta
                return {
                    ...prev,
                    gold_inr_gram: Math.round(newBase * 100) / 100,
                    gold_24k_gram: Math.round(newBase * 100) / 100,
                    gold_22k_gram: Math.round(newBase * 0.916 * 100) / 100,
                    gold_18k_gram: Math.round(newBase * 0.75 * 100) / 100,
                    gold_14k_gram: Math.round(newBase * 0.585 * 100) / 100,
                    timestamp: Date.now(),
                }
            })
        }, 2500)

        return () => {
            clearInterval(interval)
            clearInterval(microInterval)
        }
    }, [fetchPrice])

    return { price, loading, refresh: fetchPrice }
}
