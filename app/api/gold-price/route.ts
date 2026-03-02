// GET /api/gold-price — Fetch gold prices with cache
import { NextResponse } from 'next/server'
import { fetchGoldPrice } from '@/lib/gold/fetcher'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
    try {
        const data = await fetchGoldPrice()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Gold price API error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch gold prices' },
            { status: 500 }
        )
    }
}
