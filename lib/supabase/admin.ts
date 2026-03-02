// Supabase admin client — service role, bypasses RLS
import { createClient } from '@supabase/supabase-js'

let adminClient: ReturnType<typeof createClient> | null = null

export function getAdminClient() {
    if (!adminClient) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!url || !key) {
            throw new Error('Missing Supabase credentials for admin client')
        }
        adminClient = createClient(url, key, {
            auth: { autoRefreshToken: false, persistSession: false },
        })
    }
    return adminClient
}
