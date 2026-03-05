import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

export async function POST(req: Request) {
    const authKey = req.headers.get('x-anthropic-key') || process.env.ANTHROPIC_API_KEY;

    if (!authKey) {
        return NextResponse.json({ error: 'Auth key missing' }, { status: 401 });
    }

    const anthropic = new Anthropic({ apiKey: authKey });

    try {
        const { logs, query } = await req.json();

        const systemPrompt = `You are the AUREUM AI Chief Operating Officer (COO). 
Your job is to manage the website and report to the owner. 
You have access to the recent activity logs of the website.
Analyze the logs and answer the owner's query. 
Be professional, concise, and proactive. Use emojis where appropriate.
Logs: ${JSON.stringify(logs.slice(0, 50))}`;

        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: 'user', content: query || "Give me a summary of how the site is performing today." }],
        });

        const content = response.content[0].type === 'text' ? response.content[0].text : '';

        return NextResponse.json({ report: content });
    } catch (error: any) {
        console.error('CEO Agent Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
