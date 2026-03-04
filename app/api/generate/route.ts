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

        // Replicate SDK v1.4+ returns FileOutput objects (extending ReadableStream).
        // JSON.stringify does NOT call toString() on them, so they serialize as {}.
        // We must explicitly convert each to its URL string.
        const outputArray = Array.isArray(output) ? output : [output]
        const images = outputArray.map(item => {
            if (typeof item === 'string') return item
            // FileOutput.toString() returns the URL string
            return String(item)
        }).filter(url => url && url !== '[object Object]' && url !== '[object ReadableStream]')

        console.log('Generate API: Converted images:', images)

        return NextResponse.json({
            images,
            prompt: fullPrompt,
        })
    } catch (error: any) {

        console.error('Generate API error:', error.message || error)
        return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 })
    }
}
