// POST /api/vision — Claude Sonnet image analysis
import { NextResponse } from 'next/server'
import { getAnthropicClient, VISION_ANALYSIS_PROMPT } from '@/lib/anthropic'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const { imageBase64, mediaType = 'image/jpeg' } = await req.json()
        const anthropic = getAnthropicClient()

        if (!anthropic) {
            return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 503 })
        }

        if (!imageBase64) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 })
        }

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-5-20250929',
            max_tokens: 500,
            messages: [{
                role: 'user',
                content: [
                    {
                        type: 'image',
                        source: { type: 'base64', media_type: mediaType, data: imageBase64 },
                    },
                    { type: 'text', text: VISION_ANALYSIS_PROMPT },
                ],
            }],
        })

        const text = response.content[0].type === 'text' ? response.content[0].text : ''
        const analysis = JSON.parse(text.replace(/```json?|```/g, '').trim())

        return NextResponse.json(analysis)
    } catch (error) {
        console.error('Vision API error:', error)
        return NextResponse.json({ error: 'Vision analysis failed' }, { status: 500 })
    }
}
