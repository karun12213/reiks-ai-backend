// Replicate API wrapper (FLUX image generation)
import Replicate from 'replicate'

let client: Replicate | null = null

export function getReplicateClient(): Replicate | null {
    if (client) return client
    const token = process.env.REPLICATE_API_TOKEN
    if (!token) return null
    client = new Replicate({ auth: token })
    return client
}

// FLUX prompt builder for jewelry generation
export function buildFluxPrompt(params: {
    description: string
    metal: string
    karat: number
    category: string
    style?: string
}): string {
    const metalMap: Record<string, string> = {
        gold: 'yellow gold',
        rose_gold: 'rose gold',
        silver: 'sterling silver',
        platinum: 'platinum',
    }

    return `Photorealistic ${params.karat}K ${metalMap[params.metal] || 'gold'} ${params.category || 'jewelry'}, ${params.description}, professional jewelry product photography, studio lighting on pure white background, sharp focus, 8K ultra-detailed, luxury e-commerce style, no watermark, no text`
}

// FLUX model configs
export const FLUX_MODELS = {
    dev: 'black-forest-labs/flux-dev' as const,
    schnell: 'black-forest-labs/flux-schnell' as const,
}

export const FLUX_DEFAULTS = {
    num_outputs: 4,
    aspect_ratio: '1:1' as const,
    output_format: 'webp' as const,
    output_quality: 90,
    guidance: 3.5,
    num_inference_steps: 28,
}
