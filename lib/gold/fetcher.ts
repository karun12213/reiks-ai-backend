// Gold price fetcher — Metals-API primary, GoldAPI backup, simulation fallback
import { cacheGet, cacheSet } from '@/lib/redis'
import type { GoldPriceData, TradingSession } from '@/lib/types'
import { getTradingSession, simulateGoldPrice } from '@/lib/utils'

const CACHE_KEY = 'gold:latest'
const CACHE_TTL = 1800 // 30 minutes

/**
 * Fetch current gold prices — tries cache → API → simulation
 */
export async function fetchGoldPrice(): Promise<GoldPriceData> {
    // 1. Check cache
    const cached = await cacheGet<GoldPriceData>(CACHE_KEY)
    if (cached) return cached

    const session = getTradingSession()
    let goldUsdOz: number | null = null
    let silverUsdOz: number | null = null
    const usdInr = 91 // TODO: fetch real rate

    // 2. Try Metals-API
    const metalsKey = process.env.METALS_API_KEY
    if (metalsKey) {
        try {
            const res = await fetch(
                `https://metals-api.com/api/latest?access_key=${metalsKey}&base=USD&symbols=XAU,XAG`,
                { cache: 'no-store' }
            )
            const data = await res.json()
            if (data.success) {
                goldUsdOz = 1 / data.rates.XAU
                silverUsdOz = 1 / data.rates.XAG
            }
        } catch (e) {
            console.error('Metals-API error:', e)
        }
    }

    // 3. Try GoldAPI as backup
    if (!goldUsdOz) {
        const goldApiKey = process.env.GOLDAPI_KEY
        if (goldApiKey) {
            try {
                const res = await fetch('https://www.goldapi.io/api/XAU/USD', {
                    headers: { 'x-access-token': goldApiKey },
                    cache: 'no-store',
                })
                const data = await res.json()
                if (data.price) {
                    goldUsdOz = data.price
                    silverUsdOz = data.price / 85
                }
            } catch (e) {
                console.error('GoldAPI error:', e)
            }
        }
    }

    // 4. Simulate if no API available
    const isLive = goldUsdOz !== null
    if (!goldUsdOz) {
        goldUsdOz = simulateGoldPrice() * 31.1035 / usdInr // convert back to oz/USD
    }
    if (!silverUsdOz) {
        silverUsdOz = goldUsdOz / 85
    }

    const goldPerGram = goldUsdOz / 31.1035
    const silverPerGram = silverUsdOz / 31.1035

    const priceData: GoldPriceData = {
        gold_usd_oz: round(goldUsdOz),
        gold_usd_gram: round(goldPerGram),
        gold_inr_gram: round(goldPerGram * usdInr),
        gold_24k_gram: round(goldPerGram * usdInr),
        gold_22k_gram: round(goldPerGram * usdInr * 0.916),
        gold_18k_gram: round(goldPerGram * usdInr * 0.75),
        gold_14k_gram: round(goldPerGram * usdInr * 0.585),
        silver_inr_gram: round(silverPerGram * usdInr),
        usd_inr: usdInr,
        session,
        timestamp: Date.now(),
        isLive,
    }

    // 5. Cache result
    await cacheSet(CACHE_KEY, priceData, CACHE_TTL)

    return priceData
}

/**
 * Generate simulated price history for charts
 */
export function generatePriceHistory(
    basePrice: number,
    points: number = 48,
    intervalLabel: (i: number) => string = defaultLabel
): Array<{ t: string; price: number }> {
    let price = basePrice
    return Array.from({ length: points }, (_, i) => {
        price += (Math.random() - 0.48) * 15
        return { t: intervalLabel(i), price: round(price) }
    })
}

function defaultLabel(i: number): string {
    const h = (new Date().getHours() - 48 + i + 48) % 24
    return `${h.toString().padStart(2, '0')}:00`
}

function round(n: number): number {
    return Math.round(n * 100) / 100
}
