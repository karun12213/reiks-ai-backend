// GET /api/gold-price — Fetch live gold prices
// Build: 2026-03-04T18:00Z — v2
import { NextRequest, NextResponse } from 'next/server'
import { fetchGoldPrice } from '@/lib/gold/fetcher'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
    const fresh = request.nextUrl.searchParams.get('fresh') === '1'
    const debug = request.nextUrl.searchParams.get('debug') === '1'
    const customMetalsKey = request.headers.get('x-metals-key') || undefined
    const customGoldApiKey = request.headers.get('x-goldapi-key') || undefined
    try {
        const data = await fetchGoldPrice(customMetalsKey, customGoldApiKey, fresh)
        const response: any = { ...data }
        if (debug) {
            response._debug = {
                hasMetalsKey: !!process.env.METALS_API_KEY,
                hasGoldApiKey: !!process.env.GOLDAPI_KEY,
                goldApiKeyPrefix: process.env.GOLDAPI_KEY?.slice(0, 8) || 'none',
                fresh,
                buildTime: '2026-03-04T18:00Z',
            }
        }
        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                'CDN-Cache-Control': 'no-store',
                'Vercel-CDN-Cache-Control': 'no-store',
            }
        })
    } catch (error) {
        console.error('Gold price API error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch gold prices' },
            { status: 500 }
        )
    }
}

