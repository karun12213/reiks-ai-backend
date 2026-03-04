// Trigger fresh deployment for model synchronization
// POST /api/chat — Claude Haiku streaming concierge
import { NextResponse } from 'next/server'
import { getAnthropicClient, CONCIERGE_SYSTEM_PROMPT } from '@/lib/anthropic'
import { cacheGet } from '@/lib/redis'
import type { GoldPriceData } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()
        const customKey = req.headers.get('x-anthropic-key') || undefined
        const anthropic = getAnthropicClient(customKey)

        if (!anthropic) {
            return NextResponse.json(
                { error: 'Anthropic API key not configured' },
                { status: 503 }
            )
        }

        // Inject live gold prices
        const gold = await cacheGet<GoldPriceData>('gold:latest')
        const systemPrompt = CONCIERGE_SYSTEM_PROMPT
            .replace('{{GOLD_PRICE}}', `₹${gold?.gold_inr_gram || 14573}`)
            .replace('{{SESSION}}', gold?.session || 'UNKNOWN')
            .replace('{{GOLD_22K}}', String(gold?.gold_22k_gram || 6595))
            .replace('{{GOLD_18K}}', String(gold?.gold_18k_gram || 5400))
            .replace('{{GOLD_14K}}', String(gold?.gold_14k_gram || 4212))

        const stream = anthropic.messages.stream({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 600,
            system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
            messages: messages.map((m: { role: string; content: string }) => ({
                role: m.role,
                content: m.content,
            })),
        })

        const encoder = new TextEncoder()
        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const event of stream) {
                        if (event.type === 'content_block_delta' && 'delta' in event && event.delta.type === 'text_delta') {
                            controller.enqueue(
                                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
                            )
                        }
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                    controller.close()
                } catch (err) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`))
                    controller.close()
                }
            },
        })

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        })
    } catch (error) {
        console.error('Chat API error:', error)
        return NextResponse.json({ error: 'Chat failed' }, { status: 500 })
    }
}
