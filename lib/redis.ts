// Upstash Redis client (edge-compatible, serverless)

import { Redis } from '@upstash/redis'

let redis: Redis | null = null

export function getRedis(): Redis | null {
    if (redis) return redis
    const url = process.env.UPSTASH_REDIS_URL
    const token = process.env.UPSTASH_REDIS_TOKEN
    if (!url || !token) return null
    redis = new Redis({ url, token })
    return redis
}

// In-memory fallback when Redis is not configured
const memCache = new Map<string, { value: string; expiresAt: number }>()

export async function cacheGet<T>(key: string): Promise<T | null> {
    const r = getRedis()
    if (r) {
        try {
            const val = await r.get(key)
            if (val === null) return null
            return (typeof val === 'string' ? JSON.parse(val) : val) as T
        } catch {
            // fall through to memory
        }
    }
    const entry = memCache.get(key)
    if (entry && entry.expiresAt > Date.now()) {
        return JSON.parse(entry.value) as T
    }
    memCache.delete(key)
    return null
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    const json = JSON.stringify(value)
    const r = getRedis()
    if (r) {
        try {
            await r.setex(key, ttlSeconds, json)
            return
        } catch {
            // fall through to memory
        }
    }
    memCache.set(key, { value: json, expiresAt: Date.now() + ttlSeconds * 1000 })
}
