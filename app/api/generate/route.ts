// POST /api/generate — FLUX Dev image generation
import { NextResponse } from 'next/server'
import { getReplicateClient, buildFluxPrompt, FLUX_DEFAULTS } from '@/lib/replicate'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: Request) {
    try {
        const { prompt, style, metal = 'gold', karat = 22, category = 'jewelry' } = await req.json()
        const customToken = req.headers.get('x-replicate-key') || undefined
        const replicate = getReplicateClient(customToken)

        if (!replicate) {
            return NextResponse.json({ error: 'Replicate API not configured' }, { status: 503 })
        }

        const fullPrompt = buildFluxPrompt({
            description: prompt,
            metal,
            karat,
            category,
            style,
        })

        const output = await replicate.run('black-forest-labs/flux-dev', {
            input: {
                prompt: fullPrompt,
                ...FLUX_DEFAULTS,
            },
        })

        return NextResponse.json({
            images: output,
            prompt: fullPrompt,
        })
    } catch (error: any) {
        
        console.error('Generate API error:', error.message || error)
        return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 })
    }
}
