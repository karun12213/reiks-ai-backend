import { NextResponse } from 'next/server';
import { getAnthropicClient } from '@/lib/anthropic';

// Standardize on the known-working model ID from the Vision API
const AGENT_MODEL = 'claude-sonnet-4-20250514';

/**
 * Option 2A: The Daily Briefing Agent
 * This route is designed to be called by a Vercel Cron Job (e.g., every 12 hours)
 */
export async function GET(req: Request) {
    const customKey = req.headers.get('x-anthropic-key') || undefined;
    const anthropic = getAnthropicClient(customKey);

    if (!anthropic) {
        return NextResponse.json({ error: 'Server Anthropic key missing' }, { status: 503 });
    }

    try {
        // In a real app, we would fetch logs from a DB like Supabase/Upstash here.
        // For this demo, we'll simulate a set of "recent logs" to analyze.
        const mockLogs = [
            { timestamp: new Date().toISOString(), action: 'forge_upload', metadata: { source: 'instagram' } },
            { timestamp: new Date().toISOString(), action: 'forge_generate', metadata: { prompt: 'Rose gold diamond ring', count: 4 } },
            { timestamp: new Date().toISOString(), action: 'price_lock', metadata: { product: 'classic-band', price: 45000 } },
            { timestamp: new Date().toISOString(), action: 'concierge_chat', metadata: { msg: 'Do you have custom pendants?' } },
        ];

        const systemPrompt = `You are the AUREUM Automated Intelligence (AAI).
Your task is to generate a proactive "Morning Briefing" for the CEO.
Analyze the provided activity logs and highlight:
1. Significant user activities (Successes/Opportunities).
2. Potential risks (Abandoned checkouts, cost spikes).
3. Strategic recommendations.
Keep it under 150 words. Use formatting for readability.`;

        const response = await anthropic.messages.create({
            model: AGENT_MODEL,
            max_tokens: 500,
            system: systemPrompt,
            messages: [{ role: 'user', content: `Analyze these logs and generate the briefing: ${JSON.stringify(mockLogs)}` }],
        });

        const briefing = response.content[0].type === 'text' ? response.content[0].text : '';

        // In a real app, this would be emailed or sent via webhook.
        console.log("--- PROACTIVE DAILY BRIEFING GENERATED ---");
        console.log(briefing);

        return NextResponse.json({
            success: true,
            briefing,
            delivered_to: 'CEO Dashboard (Static View) & Server Logs'
        });
    } catch (error: any) {
        console.error('Agent Cron Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
