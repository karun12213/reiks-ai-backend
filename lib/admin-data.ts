// Admin Ops Center — Mock Data
export const FEATURES = [
    { id: "live_gold", name: "Live Gold Pricing", desc: "Real-time gold/silver prices from Metals-API", category: "core", status: true, api: "Metals-API", cost: "₹0 (free tier)" },
    { id: "ai_concierge", name: "AI Concierge", desc: "Claude Haiku-powered shopping assistant", category: "ai", status: true, api: "Claude Haiku", cost: "₹177/mo" },
    { id: "ai_design", name: "AI Design Studio", desc: "Upload → Vision → FLUX generation pipeline", category: "ai", status: true, api: "Claude Sonnet + FLUX", cost: "₹2,777/mo" },
    { id: "price_lock", name: "GoldLock", desc: "Lock gold price for 24h/48h/7d with premium", category: "core", status: true, api: "Internal", cost: "Revenue ₹7.8K" },
    { id: "ar_tryon", name: "AI Try-On", desc: "FLUX inpainting composite on selfies", category: "ai", status: true, api: "FLUX Dev", cost: "₹455/mo" },
    { id: "3d_viewer", name: "3D Model Viewer", desc: "Meshy image-to-3D + Three.js renderer", category: "premium", status: true, api: "Meshy", cost: "₹1,365/mo" },
    { id: "gold_sip", name: "Gold SIP", desc: "Monthly gold savings with AI buy timing", category: "finance", status: true, api: "Razorpay + Internal", cost: "Revenue ₹1.2K" },
    { id: "forge_pass", name: "Forge Pass", desc: "₹299/mo subscription for unlimited designs", category: "monetization", status: true, api: "Razorpay", cost: "Revenue ₹3.5K" },
    { id: "rush_order", name: "Rush Manufacturing", desc: "3-day delivery with 25% surcharge", category: "monetization", status: true, api: "Internal", cost: "Revenue ₹4.2K" },
    { id: "certificate", name: "Digital Certificate", desc: "AI-generated appraisal + QR verification", category: "monetization", status: true, api: "Claude Haiku", cost: "Revenue ₹1.5K" },
    { id: "gift_ai", name: "AI Gift Intelligence", desc: "Recipient style analysis + suggestions", category: "ai", status: false, api: "Claude Sonnet", cost: "~₹200/mo" },
    { id: "flash_forge", name: "Flash Forge Drops", desc: "Weekly limited AI designs, ₹199 entry", category: "monetization", status: false, api: "FLUX + Internal", cost: "Revenue est ₹2K" },
];

export const ORDERS = [
    { id: "AUR-0031", customer: "Priya S.", product: "22K Temple Necklace", amount: 89000, weight: "12g", karat: "22K", goldAt: 6480, margin: 12400, lockId: "LK-019", status: "manufacturing", placed: "Feb 26", est: "Mar 4", goldsmith: "Rajan & Sons" },
    { id: "AUR-0030", customer: "Vikram T.", product: "22K Cuban Link 24\"", amount: 185000, weight: "24g", karat: "22K", goldAt: 6450, margin: 28500, lockId: "LK-017", status: "shipped", placed: "Feb 22", est: "Mar 1", goldsmith: "Zaveri Bros" },
    { id: "AUR-0029", customer: "Deepa R.", product: "18K Diamond Pendant", amount: 42000, weight: "5g", karat: "18K", goldAt: 6500, margin: 8200, lockId: "LK-015", status: "delivered", placed: "Feb 18", est: "Feb 25", goldsmith: "KG Gold" },
    { id: "AUR-0028", customer: "Arjun M.", product: "22K Signet Ring", amount: 34500, weight: "8g", karat: "22K", goldAt: 6460, margin: 5200, lockId: "LK-022", status: "confirmed", placed: "Feb 28", est: "Mar 7", goldsmith: "Pending assign" },
    { id: "AUR-0027", customer: "Meera J.", product: "14K Stacking Rings ×3", amount: 18500, weight: "6g", karat: "14K", goldAt: 6510, margin: 3800, lockId: null, status: "payment_pending", placed: "Mar 1", est: "—", goldsmith: "—" },
    { id: "AUR-0026", customer: "Suresh P.", product: "22K Baby Bangle", amount: 22000, weight: "4g", karat: "22K", goldAt: 6490, margin: 4100, lockId: "LK-020", status: "manufacturing", placed: "Feb 25", est: "Mar 3", goldsmith: "Rajan & Sons" },
];

export const LOCKS = [
    { id: "LK-023", user: "Priya S.", product: "22K Choker Set", locked: 245000, current: 251200, duration: "48h", premium: 2450, expires: "4h 22m", status: "active" },
    { id: "LK-022", user: "Arjun M.", product: "22K Signet Ring", locked: 34200, current: 33800, duration: "24h", premium: 171, expires: "18h 5m", status: "active" },
    { id: "LK-021", user: "Vikram T.", product: "22K Tennis Bracelet", locked: 267000, current: 271500, duration: "7d", premium: 5340, expires: "5d 12h", status: "active" },
    { id: "LK-020", user: "Suresh P.", product: "22K Baby Bangle", locked: 22000, current: 22300, duration: "24h", premium: 110, expires: "CONVERTED", status: "converted" },
    { id: "LK-019", user: "Priya S.", product: "22K Temple Necklace", locked: 89000, current: 91200, duration: "48h", premium: 890, expires: "CONVERTED", status: "converted" },
];

export const USERS = [
    { id: "U001", name: "Arjun M.", email: "arjun@mail.com", joined: "Jan 15", tier: "Gold", spent: 34500, designs: 8, locks: 2, orders: 1, sip: true, forgePass: false, lastActive: "2h ago", aiCalls: 24 },
    { id: "U002", name: "Priya S.", email: "priya@mail.com", joined: "Nov 1", tier: "Platinum", spent: 128000, designs: 15, locks: 4, orders: 3, sip: true, forgePass: true, lastActive: "12m ago", aiCalls: 52 },
    { id: "U003", name: "Rahul K.", email: "rahul@mail.com", joined: "Feb 20", tier: "Free", spent: 0, designs: 3, locks: 1, orders: 0, sip: true, forgePass: false, lastActive: "1d ago", aiCalls: 8 },
    { id: "U004", name: "Deepa R.", email: "deepa@mail.com", joined: "Feb 10", tier: "Gold", spent: 67000, designs: 6, locks: 3, orders: 2, sip: false, forgePass: false, lastActive: "5h ago", aiCalls: 18 },
    { id: "U005", name: "Vikram T.", email: "vikram@mail.com", joined: "Sep 1", tier: "Diamond", spent: 345000, designs: 22, locks: 8, orders: 5, sip: true, forgePass: true, lastActive: "30m ago", aiCalls: 89 },
    { id: "U006", name: "Meera J.", email: "meera@mail.com", joined: "Feb 28", tier: "Free", spent: 0, designs: 1, locks: 0, orders: 0, sip: false, forgePass: false, lastActive: "3d ago", aiCalls: 3 },
    { id: "U007", name: "Suresh P.", email: "suresh@mail.com", joined: "Feb 12", tier: "Gold", spent: 22000, designs: 4, locks: 2, orders: 1, sip: false, forgePass: false, lastActive: "1h ago", aiCalls: 11 },
];

export const API_SERVICES = [
    { name: "Metals-API", status: "healthy", latency: "142ms", calls: 88, limit: 100, cost: 0, plan: "Free" },
    { name: "GoldAPI.io", status: "healthy", latency: "198ms", calls: 12, limit: 100, cost: 0, plan: "Free" },
    { name: "Claude Haiku", status: "healthy", latency: "380ms", calls: 312, limit: 5000, cost: 177, plan: "Pay-per-use" },
    { name: "Claude Sonnet", status: "healthy", latency: "1.2s", calls: 187, limit: 1000, cost: 137, plan: "Pay-per-use" },
    { name: "FLUX Dev", status: "healthy", latency: "8.2s", calls: 743, limit: 3300, cost: 2230, plan: "Replicate" },
    { name: "FLUX Schnell", status: "healthy", latency: "1.8s", calls: 1284, limit: 10000, cost: 410, plan: "Replicate" },
    { name: "Meshy 3D", status: "degraded", latency: "45s", calls: 38, limit: 100, cost: 570, plan: "Pro" },
    { name: "Supabase", status: "healthy", latency: "12ms", calls: 14200, limit: 500000, cost: 0, plan: "Free" },
    { name: "Upstash Redis", status: "healthy", latency: "4ms", calls: 8400, limit: 10000, cost: 0, plan: "Free" },
    { name: "Razorpay", status: "healthy", latency: "220ms", calls: 34, limit: null, cost: 0, plan: "Standard 2%" },
    { name: "Resend", status: "healthy", latency: "90ms", calls: 47, limit: 100, cost: 0, plan: "Free" },
    { name: "Vercel", status: "healthy", latency: "—", calls: null, limit: null, cost: 0, plan: "Hobby" },
];

export const AI_QUEUE = [
    { id: "DES-148", user: "Priya S.", type: "design_gen", model: "FLUX Dev", status: "completed", duration: "8.4s", cost: "₹1.65", input: "22K temple-style choker with ruby motifs" },
    { id: "DES-147", user: "Arjun M.", type: "vision", model: "Sonnet", status: "completed", duration: "1.1s", cost: "₹0.73", input: "Instagram screenshot analysis" },
    { id: "DES-146", user: "Vikram T.", type: "design_gen", model: "FLUX Dev", status: "completed", duration: "9.1s", cost: "₹1.65", input: "Modern 18K white gold tennis bracelet" },
    { id: "TRY-089", user: "Meera J.", type: "tryon", model: "FLUX Dev", status: "completed", duration: "7.2s", cost: "₹0.41", input: "Selfie + pendant overlay" },
    { id: "CHT-312", user: "Deepa R.", type: "chat", model: "Haiku", status: "completed", duration: "0.4s", cost: "₹0.06", input: "Show me earrings under 15K for office wear" },
    { id: "3D-038", user: "Vikram T.", type: "3d_gen", model: "Meshy", status: "processing", duration: "—", cost: "₹15.0", input: "Tennis bracelet → GLB model" },
];

export const ALERTS = [
    { id: 1, type: "warning" as const, title: "Metals-API at 88%", msg: "12 calls remaining on free tier.", time: "10m ago", resolved: false },
    { id: 2, type: "warning" as const, title: "Upstash Redis at 84%", msg: "1,600 commands remaining today.", time: "30m ago", resolved: false },
    { id: 3, type: "critical" as const, title: "Lock LK-023 expires in 4h", msg: "Priya S. has ₹2.45L locked. Send reminder.", time: "2h ago", resolved: false },
    { id: 4, type: "success" as const, title: "Order AUR-0030 shipped", msg: "DHL AWB: 4820183746", time: "3h ago", resolved: true },
    { id: 5, type: "success" as const, title: "Daily revenue target hit", msg: "₹8,200 revenue today.", time: "6h ago", resolved: true },
];

export const GOLDSMITHS = [
    { name: "Rajan & Sons", location: "T. Nagar, Chennai", speciality: "Traditional South Indian", active: 2, completed: 12, rating: 4.8, avgDays: 5 },
    { name: "Zaveri Bros", location: "Zaveri Bazaar, Mumbai", speciality: "Chains & Bracelets", active: 1, completed: 8, rating: 4.6, avgDays: 4 },
    { name: "KG Gold", location: "Coimbatore", speciality: "Lightweight Modern", active: 0, completed: 5, rating: 4.9, avgDays: 3 },
];

export const REVENUE_STREAMS = [
    { name: "Jewelry Margins", value: 54300, color: "#D4A853" },
    { name: "Lock Premiums", value: 7822, color: "#8B6914" },
    { name: "AI Design Fees", value: 3980, color: "#C49B3C" },
    { name: "Forge Pass", value: 3588, color: "#A67C2E" },
    { name: "Rush Orders", value: 4200, color: "#E8C547" },
    { name: "SIP Fees", value: 1250, color: "#F0D875" },
    { name: "Try-On Credits", value: 1519, color: "#B8942A" },
    { name: "Certificates", value: 863, color: "#9E8530" },
];

export function genPriceHistory() {
    let p = 6420;
    return Array.from({ length: 48 }, (_, i) => {
        p += (Math.random() - 0.48) * 18;
        return { t: `${String(i % 24).padStart(2, "0")}:00`, price: Math.round(p * 100) / 100, vol: Math.round(50 + Math.random() * 200) };
    });
}

export function genDailyRev() {
    return Array.from({ length: 30 }, (_, i) => ({
        d: `${i + 1}`, rev: Math.round(800 + Math.random() * 9000), cost: Math.round(150 + Math.random() * 400),
    }));
}
