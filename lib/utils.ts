// ═══════════════════════════════════════════
// REIKS — Utility Functions
// ═══════════════════════════════════════════

import type { Karat, PriceBreakdown, TradingSession } from './types'
import { PURITY, GST_RATE, DEFAULT_MAKING_CHARGE_PER_GRAM, RUSH_MULTIPLIER } from './constants'

/**
 * Calculate full price breakdown for a jewelry piece
 */
export function calculatePrice(
    goldPricePerGram: number,
    weightGrams: number,
    karat: Karat,
    makingChargePerGram: number = DEFAULT_MAKING_CHARGE_PER_GRAM,
    isRush: boolean = false
): PriceBreakdown {
    const purity = PURITY[karat] ?? 0.916
    const goldCost = goldPricePerGram * weightGrams * purity
    const makingCharges = weightGrams * makingChargePerGram * (isRush ? RUSH_MULTIPLIER : 1)
    const subtotal = goldCost + makingCharges
    const gst = subtotal * GST_RATE

    return {
        goldPricePerGram,
        weightGrams,
        karat,
        purity,
        goldCost: Math.round(goldCost),
        makingCharges: Math.round(makingCharges),
        subtotal: Math.round(subtotal),
        gst: Math.round(gst),
        total: Math.round(subtotal + gst),
    }
}

/**
 * Format currency in INR
 */
export function formatINR(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

/**
 * Format compact currency (₹1.2L, ₹45K)
 */
export function formatCompact(amount: number): string {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
    return `₹${amount}`
}

/**
 * Get current trading session
 */
export function getTradingSession(): TradingSession {
    const h = new Date().getUTCHours()
    if (h >= 22 || h < 7) return 'ASIAN'
    if (h < 12) return 'LONDON'
    return 'NEW_YORK'
}

/**
 * Get session display info
 */
export function getSessionInfo(session: TradingSession) {
    const info = {
        ASIAN: { city: 'Tokyo / Shanghai', color: '#ef4444', emoji: '🌏' },
        LONDON: { city: 'London', color: '#60a5fa', emoji: '🌍' },
        NEW_YORK: { city: 'New York', color: '#4ade80', emoji: '🌎' },
    }
    return info[session]
}

/**
 * Format time remaining (for lock countdown)
 */
export function formatTimeRemaining(expiresAt: string): string {
    const ms = new Date(expiresAt).getTime() - Date.now()
    if (ms <= 0) return 'Expired'
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    if (hours >= 24) {
        const days = Math.floor(hours / 24)
        return `${days}d ${hours % 24}h`
    }
    return `${hours}h ${minutes}m`
}

/**
 * Format weight with unit
 */
export function formatWeight(grams: number): string {
    return `${grams.toFixed(grams < 1 ? 2 : 1)}g`
}

/**
 * Slugify text
 */
export function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

/**
 * Karat label
 */
export function karatLabel(karat: Karat): string {
    return `${karat}K`
}

/**
 * Metal display name
 */
export function metalLabel(metal: string): string {
    const labels: Record<string, string> = {
        gold: 'Yellow Gold',
        rose_gold: 'Rose Gold',
        silver: 'Sterling Silver',
        platinum: 'Platinum',
    }
    return labels[metal] ?? metal
}

/**
 * Generate simulated gold price (fallback when API unavailable)
 */
export function simulateGoldPrice(): number {
    const base = 14573 // approximate ₹/gram for 24K
    const variance = (Math.random() - 0.5) * 100
    return Math.round((base + variance) * 100) / 100
}

/**
 * Delay helper
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Clamp value
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

/**
 * cn — classname merge helper
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ')
}
