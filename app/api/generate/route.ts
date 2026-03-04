// POST /api/generate — Image generation with Replicate → Meshy fallback
import { NextResponse } from 'next/server'
import { getReplicateClient, buildFluxPrompt, FLUX_DEFAULTS } from '@/lib/replicate'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// ─── Meshy text-to-image fallback ───
async function generateWithMeshy(prompt: string, meshyKey: string): Promise<string[]> {
    // Step 1: Create task
    const createRes = await fetch('https://api.meshy.ai/openapi/v1/text-to-image', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${meshyKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ai_model: 'nano-banana',
            prompt,
            aspect_ratio: '1:1',
        }),
    })

    if (!createRes.ok) {
        const err = await createRes.text()
        throw new Error(`Meshy create failed: ${createRes.status} ${err}`)
    }

    const { result: taskId } = await createRes.json()
    console.log('Meshy: Task created:', taskId)

    // Step 2: Poll for completion (max 45 seconds)
    const maxWait = 45_000
    const pollInterval = 2_000
    const startTime = Date.now()

    while (Date.now() - startTime < maxWait) {
        await new Promise(r => setTimeout(r, pollInterval))

        const statusRes = await fetch(`https://api.meshy.ai/openapi/v1/text-to-image/${taskId}`, {
            headers: { 'Authorization': `Bearer ${meshyKey}` },
        })

        if (!statusRes.ok) continue

        const task = await statusRes.json()
        console.log('Meshy: Task status:', task.status, 'Progress:', task.progress)

        if (task.status === 'SUCCEEDED' && task.image_urls?.length) {
            return task.image_urls
        }

        if (task.status === 'FAILED') {
            throw new Error('Meshy generation failed')
        }
    }

    throw new Error('Meshy generation timed out')
}

// ─── Generate 4 images (Meshy generates 1 per call, run 4 in parallel) ───
async function generateMultipleWithMeshy(prompt: string, meshyKey: string, count: number = 4): Promise<string[]> {
    const variations = [
        prompt,
        prompt + ', front view, centered composition',
        prompt + ', angled view, dramatic lighting',
        prompt + ', close-up detail, macro photography',
    ].slice(0, count)

    const results = await Promise.allSettled(
        variations.map(p => generateWithMeshy(p, meshyKey))
    )

    return results
        .filter((r): r is PromiseFulfilledResult<string[]> => r.status === 'fulfilled')
        .flatMap(r => r.value)
}

export async function POST(req: Request) {
    try {
        const { prompt, style, metal = 'gold', karat = 22, category = 'jewelry' } = await req.json()
        const customReplicateToken = req.headers.get('x-replicate-key') || undefined
        const customMeshyKey = req.headers.get('x-meshy-key') || undefined

        const fullPrompt = buildFluxPrompt({
            description: prompt,
            metal,
            karat,
            category,
            style,
        })

        // ─── Try Replicate first ───
        const replicate = getReplicateClient(customReplicateToken)
        if (replicate) {
            try {
                const output = await replicate.run('black-forest-labs/flux-dev', {
                    input: {
                        prompt: fullPrompt,
                        ...FLUX_DEFAULTS,
                    },
                })

                const outputArray = Array.isArray(output) ? output : [output]
                const images = outputArray.map(item => {
                    if (typeof item === 'string') return item
                    return String(item)
                }).filter(url => url && url !== '[object Object]' && url !== '[object ReadableStream]')

                if (images.length > 0) {
                    console.log('Generate API: Replicate succeeded with', images.length, 'images')
                    return NextResponse.json({ images, prompt: fullPrompt, provider: 'replicate' })
                }
            } catch (replicateError: any) {
                console.warn('Generate API: Replicate failed, trying Meshy fallback:', replicateError.message)
            }
        }

        // ─── Fallback to Meshy ───
        const meshyKey = customMeshyKey || process.env.MESHY_API_KEY
        if (!meshyKey) {
            return NextResponse.json(
                { error: 'No image generation service available. Configure Replicate or Meshy API key.' },
                { status: 503 }
            )
        }

        console.log('Generate API: Using Meshy fallback')
        const images = await generateMultipleWithMeshy(fullPrompt, meshyKey, 4)

        if (images.length === 0) {
            return NextResponse.json({ error: 'Image generation failed on all providers' }, { status: 500 })
        }

        console.log('Generate API: Meshy succeeded with', images.length, 'images')
        return NextResponse.json({ images, prompt: fullPrompt, provider: 'meshy' })

    } catch (error: any) {
        console.error('Generate API error:', error.message || error)
        return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 })
    }
}
