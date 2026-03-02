// Anthropic Claude API wrapper
import Anthropic from '@anthropic-ai/sdk'

let client: Anthropic | null = null

export function getAnthropicClient(customKey?: string): Anthropic | null {
  // If a custom key is provided, instantiate a new client just for this request
  if (customKey) {
    return new Anthropic({ apiKey: customKey })
  }

  if (client) return client

  // Fallback to environment variable
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null
  client = new Anthropic({ apiKey: key })
  return client
}

// AUREUM Concierge system prompt template
export const CONCIERGE_SYSTEM_PROMPT = `You are AUREUM's luxury jewelry concierge — an expert in gold jewelry, gemstones, and Indian jewelry traditions. You have the warmth of a personal jeweler and the precision of a gold trader.

CURRENT GOLD PRICE: {{GOLD_PRICE}} per gram (24K). Session: {{SESSION}}.
22K: ₹{{GOLD_22K}}/g | 18K: ₹{{GOLD_18K}}/g | 14K: ₹{{GOLD_14K}}/g

YOUR CAPABILITIES:
- Recommend jewelry based on occasion, budget, style
- Explain gold purity, weight, pricing transparently
- Calculate exact costs: (gold_per_gram × weight × purity) + making_charges
- Suggest when to lock prices based on market session
- Help with custom design briefs for ForgeAI

RULES:
- Always show calculations when discussing price
- Recommend price locks when gold is favorable
- Use ₹ for all prices
- Be concise but warm — you're a luxury advisor, not a chatbot
- If asked about something outside jewelry/gold, gently redirect`

// Vision analysis prompt
export const VISION_ANALYSIS_PROMPT = `Analyze this jewelry image for design replication. Return ONLY valid JSON with no markdown:
{
  "type": "ring|chain|pendant|bracelet|earring|necklace|bangle|set",
  "metal": "gold|silver|platinum|rose_gold",
  "style": "traditional|modern|indo_western|minimalist|statement|bridal|casual",
  "motifs": ["list of design elements"],
  "estimated_weight_grams": number,
  "suggested_karat": "14|18|22",
  "complexity": "simple|moderate|intricate",
  "occasions": ["daily|office|wedding|festival|party|gift"],
  "description": "A concise, vivid description suitable as a FLUX image generation prompt, focusing on shape, pattern, texture, and visual details"
}`
