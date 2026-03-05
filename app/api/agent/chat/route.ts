import { NextResponse } from 'next/server';
import { getAnthropicClient } from '@/lib/anthropic';

// Standardize on the known-working model ID from the Vision API
const AGENT_MODEL = 'claude-sonnet-4-20250514';

export async function POST(req: Request) {
    const customKey = req.headers.get('x-anthropic-key') || undefined;
    const anthropic = getAnthropicClient(customKey);

    if (!anthropic) {
        return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 503 });
    }

    try {
        const { logs, query } = await req.json();

        const systemPrompt = `You are the AUREUM AI Chief Operating Officer (COO). 
Your job is to manage the website and report to the owner. 
You have access to the recent activity logs of the website.
Analyze the logs and answer the owner's query. 
Be professional, concise, and proactive. Use emojis where appropriate.
Logs: ${JSON.stringify(logs.slice(0, 50))}`;

        const response = await anthropic.messages.create({
            model: AGENT_MODEL,
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: 'user', content: query || "Give me a summary of how the site is performing today." }],
        });

        const content = response.content[0].type === 'text' ? response.content[0].text : '';

        return NextResponse.json({ report: content });
    } catch (error: any) {
        console.error('CEO Agent Error Detailed:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error occurred in agent backend'
        }, { status: 500 });
    }
}
