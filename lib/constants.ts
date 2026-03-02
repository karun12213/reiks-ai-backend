// ═══════════════════════════════════════════
// AUREUM — Constants & Configuration
// ═══════════════════════════════════════════

import type { Karat, LockDuration, UserTier } from './types'

// ─── Pricing ───
export const PURITY: Record<Karat, number> = {
    14: 0.585,
    18: 0.75,
    22: 0.916,
    24: 1.0,
}

export const LOCK_PREMIUM_RATES: Record<LockDuration, number> = {
    '24h': 0.005,
    '48h': 0.01,
    '7d': 0.02,
}

export const LOCK_DURATION_MS: Record<LockDuration, number> = {
    '24h': 86400000,
    '48h': 172800000,
    '7d': 604800000,
}

export const DEFAULT_MAKING_CHARGE_PER_GRAM = 500
export const RUSH_MULTIPLIER = 1.25
export const GST_RATE = 0.03

// ─── Tier Thresholds ───
export const TIER_THRESHOLDS: Record<UserTier, number> = {
    free: 0,
    gold: 10000,
    platinum: 50000,
    diamond: 200000,
}

export function calculateTier(totalSpent: number): UserTier {
    if (totalSpent >= 200000) return 'diamond'
    if (totalSpent >= 50000) return 'platinum'
    if (totalSpent >= 10000) return 'gold'
    return 'free'
}

// ─── AI Credit Limits ───
export const AI_LIMITS: Record<UserTier, { designs: number; tryons: number; lockDuration: LockDuration[] }> = {
    free: { designs: 3, tryons: 3, lockDuration: ['24h'] },
    gold: { designs: 10, tryons: 10, lockDuration: ['24h', '48h'] },
    platinum: { designs: Infinity, tryons: Infinity, lockDuration: ['24h', '48h', '7d'] },
    diamond: { designs: Infinity, tryons: Infinity, lockDuration: ['24h', '48h', '7d'] },
}

// ─── Monetization Pricing ───
export const PRICING = {
    aiDesign: { freePerDay: 3, pack5: 99, pack15: 199 },
    tryOn: { freePerDay: 3, pack10: 69 },
    forgePass: 299, // per month
    certificateFee: 199,
    sipFee: 0.01, // 1% AUM/yr
    marginTarget: 0.18, // 18% gross margin target
    makingCharges: { perGram: 500, rushMultiplier: 1.25 },
    lockPremiums: { '24h': '0.5%', '48h': '1%', '7d': '2%' },
}

// ─── Design System Colors ───
export const COLORS = {
    black: '#080808',
    dark: '#0d0d0d',
    card: '#111111',
    border: '#1a1a1a',
    dim: '#555555',
    mid: '#888888',
    light: '#cccccc',
    white: '#f0f0f0',
    gold: '#D4A853',
    darkGold: '#8B6914',
    green: '#4ade80',
    red: '#f87171',
    blue: '#60a5fa',
    yellow: '#fbbf24',
    purple: '#c084fc',
    cyan: '#22d3ee',
}

// ─── Product Categories ───
export const CATEGORIES = [
    { id: 'rings', label: 'Rings', icon: '💍' },
    { id: 'chains', label: 'Chains', icon: '🔗' },
    { id: 'pendants', label: 'Pendants', icon: '📿' },
    { id: 'bracelets', label: 'Bracelets', icon: '⌚' },
    { id: 'earrings', label: 'Earrings', icon: '✨' },
    { id: 'bangles', label: 'Bangles', icon: '⭕' },
    { id: 'necklaces', label: 'Necklaces', icon: '👑' },
    { id: 'sets', label: 'Sets', icon: '🎁' },
] as const

// ─── Nav Items ───
export const NAV_ITEMS = [
    { href: '/', label: 'Home', icon: 'Home' },
    { href: '/forge', label: 'Forge', icon: 'Wand2' },
    { href: '/collection', label: 'Collection', icon: 'Grid3X3' },
    { href: '/vault', label: 'Vault', icon: 'Lock' },
    { href: '/concierge', label: 'Concierge', icon: 'MessageCircle' },
] as const

// ─── Session Info ───
export const SESSION_INFO = {
    ASIAN: { city: 'Tokyo / Shanghai', color: '#ef4444', hours: [22, 7] },
    LONDON: { city: 'London', color: '#60a5fa', hours: [7, 12] },
    NEW_YORK: { city: 'New York', color: '#4ade80', hours: [12, 22] },
} as const
