// GET /api/admin/status — Check API key configuration status
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const keys = [
        { envVar: 'NEXT_PUBLIC_SUPABASE_URL', label: 'Supabase URL', required: true },
        { envVar: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', label: 'Supabase Anon Key', required: true },
        { envVar: 'SUPABASE_SERVICE_ROLE_KEY', label: 'Supabase Service Key', required: true },
        { envVar: 'ANTHROPIC_API_KEY', label: 'Anthropic API Key', required: true },
        { envVar: 'REPLICATE_API_TOKEN', label: 'Replicate API Token', required: true },
        { envVar: 'RAZORPAY_KEY_ID', label: 'Razorpay Key ID', required: true },
        { envVar: 'RAZORPAY_KEY_SECRET', label: 'Razorpay Key Secret', required: true },
        { envVar: 'METALS_API_KEY', label: 'Metals-API Key', required: false },
        { envVar: 'GOLDAPI_KEY', label: 'GoldAPI Key', required: false },
        { envVar: 'UPSTASH_REDIS_REST_URL', label: 'Upstash Redis URL', required: false },
        { envVar: 'UPSTASH_REDIS_REST_TOKEN', label: 'Upstash Redis Token', required: false },
        { envVar: 'RESEND_API_KEY', label: 'Resend API Key', required: false },
    ].map(k => ({
        ...k,
        key: '',
        description: '',
        masked: true,
        status: process.env[k.envVar] ? 'connected' as const : 'missing' as const,
    }))

    return NextResponse.json({ keys })
}
