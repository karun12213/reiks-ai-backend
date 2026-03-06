// ═══════════════════════════════════════════
// REIKS — TypeScript Types
// ═══════════════════════════════════════════

// ─── Gold Prices ───
export interface GoldPriceData {
    gold_usd_oz: number
    gold_usd_gram: number
    gold_inr_gram: number
    gold_24k_gram: number
    gold_22k_gram: number
    gold_18k_gram: number
    gold_14k_gram: number
    silver_inr_gram: number
    usd_inr: number
    session: TradingSession
    timestamp: number
    isLive: boolean
}

export type TradingSession = 'ASIAN' | 'LONDON' | 'NEW_YORK'

export interface SessionInfo {
    name: TradingSession
    city: string
    color: string
    nextSession: TradingSession
    endsIn: string
}

// ─── Products ───
export type ProductCategory = 'rings' | 'chains' | 'pendants' | 'bracelets' | 'earrings' | 'bangles' | 'necklaces' | 'sets'
export type MetalType = 'gold' | 'silver' | 'platinum' | 'rose_gold'
export type Karat = 14 | 18 | 22 | 24

export interface Product {
    id: string
    name: string
    slug: string
    category: ProductCategory
    metal: MetalType
    default_karat: Karat
    available_karats: Karat[]
    base_weight_grams: number
    making_charges_per_gram: number
    images: string[]
    thumbnail_url: string | null
    model_3d_url: string | null
    description: string | null
    short_description: string | null
    tags: string[]
    is_active: boolean
    is_featured: boolean
    is_ai_generated: boolean
    sort_order: number
    views: number
    created_at: string
    specifications?: { label: string; value: string }[]
}

export interface PriceBreakdown {
    goldPricePerGram: number
    weightGrams: number
    karat: Karat
    purity: number
    goldCost: number
    makingCharges: number
    subtotal: number
    gst: number
    total: number
}

// ─── Designs (AI Generated) ───
export interface Design {
    id: string
    user_id: string
    source_image_url: string | null
    analysis_json: VisionAnalysis | null
    generated_images: string[]
    selected_image_url: string | null
    parameters: DesignParameters
    flux_prompt: string | null
    model_3d_url: string | null
    is_saved: boolean
    created_at: string
}

export interface VisionAnalysis {
    type: string
    metal: MetalType
    style: string
    motifs: string[]
    estimated_weight_grams: number
    suggested_karat: string
    complexity: 'simple' | 'moderate' | 'intricate'
    occasions: string[]
    description: string
}

export interface DesignParameters {
    metal?: MetalType
    karat?: Karat
    style?: string
    category?: string
    weight?: number
}

// ─── Price Locks ───
export type LockDuration = '24h' | '48h' | '7d'
export type LockStatus = 'active' | 'expired' | 'converted' | 'cancelled'

export interface PriceLock {
    id: string
    user_id: string
    product_id: string | null
    design_id: string | null
    locked_gold_price: number
    locked_total_price: number
    weight_grams: number
    karat: Karat
    premium_rate: number
    premium_charged: number
    premium_paid: boolean
    duration: LockDuration
    status: LockStatus
    expires_at: string
    created_at: string
}

// ─── Orders ───
export type OrderStatus = 'confirmed' | 'manufacturing' | 'quality_check' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
    id: string
    order_number: string
    user_id: string
    product_id: string | null
    design_id: string | null
    lock_id: string | null
    gold_price_at_purchase: number
    weight_grams: number
    karat: Karat
    purity: number
    gold_cost: number
    making_charges: number
    design_fee: number
    rush_surcharge: number
    lock_premium: number
    total_amount: number
    margin: number
    is_rush: boolean
    razorpay_order_id: string | null
    razorpay_payment_id: string | null
    payment_status: PaymentStatus
    status: OrderStatus
    goldsmith_name: string | null
    tracking_number: string | null
    estimated_delivery: string | null
    created_at: string
    updated_at: string
}

// ─── SIP ───
export interface SipPlan {
    id: string
    user_id: string
    monthly_amount: number
    frequency: 'weekly' | 'biweekly' | 'monthly'
    accumulated_grams: number
    total_invested: number
    avg_buy_price: number
    status: 'active' | 'paused' | 'cancelled'
    next_buy_date: string
    created_at: string
}

// ─── Users ───
export type UserTier = 'free' | 'gold' | 'platinum' | 'diamond'

export interface UserProfile {
    id: string
    name: string | null
    email: string | null
    phone: string | null
    avatar_url: string | null
    style_dna: Record<string, unknown>
    tier: UserTier
    total_spent: number
    forge_pass_active: boolean
    forge_pass_expires_at: string | null
    free_designs_today: number
    free_tryons_today: number
    created_at: string
}

// ─── Chat ───
export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: number
    productSuggestions?: Product[]
}

export interface Conversation {
    id: string
    user_id: string
    title: string
    messages: ChatMessage[]
    created_at: string
    updated_at: string
}

// ─── AI Usage ───
export type AIUsageType = 'chat' | 'vision' | 'design_gen' | 'design_preview' | 'tryon' | '3d_gen' | 'certificate'

export interface AIUsage {
    id: number
    user_id: string
    type: AIUsageType
    model: string
    input_tokens: number
    output_tokens: number
    cost_usd: number
    duration_ms: number
    created_at: string
}

// ─── Feature Flags ───
export interface FeatureFlag {
    id: string
    name: string
    description: string | null
    category: string | null
    enabled: boolean
    config: Record<string, unknown>
    updated_at: string
}
