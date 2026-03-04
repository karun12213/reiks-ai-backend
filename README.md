# AUREUM — India's First AI-Native Gold Jewelry Platform

> Design jewelry with AI, lock live gold prices, buy from master goldsmiths. Zero markup on gold. Every piece made to order.

**Live Site**: Deployed on Vercel  
**Stack**: Next.js 16 · TypeScript · Tailwind CSS 4 · Framer Motion

---

## 🏗️ Architecture

```
aureum-next/
├── app/                          # Next.js App Router pages & API routes
│   ├── page.tsx                  # Homepage — hero, gold ticker, CTAs
│   ├── layout.tsx                # Root layout — fonts, theme, metadata
│   ├── globals.css               # Design system tokens & utility classes
│   │
│   ├── collection/page.tsx       # Product catalog — grid, filters, live pricing
│   ├── product/[id]/page.tsx     # Product detail — specs, karat selector, pricing
│   ├── forge/page.tsx            # AI Design Studio — upload, prompt, generate
│   ├── concierge/page.tsx        # AI Chat — streaming Claude concierge
│   ├── vault/page.tsx            # Gold Vault — SIP, price locks, balance
│   ├── checkout/page.tsx         # Checkout — Razorpay integration
│   ├── success/page.tsx          # Order confirmation
│   ├── account/page.tsx          # User account & order history
│   ├── admin/page.tsx            # Admin panel — ops center, API keys, metrics
│   │
│   └── api/                      # Serverless API routes
│       ├── chat/route.ts         # Claude Sonnet 4 streaming concierge
│       ├── generate/route.ts     # Image gen — Replicate FLUX → Meshy fallback
│       ├── vision/route.ts       # Claude vision — jewelry analysis
│       ├── gold-price/route.ts   # Live gold prices (GoldAPI.io)
│       ├── admin/
│       │   ├── status/route.ts   # System health check
│       │   └── test-key/route.ts # API key validation
│       └── payments/
│           ├── create-order/route.ts  # Razorpay order creation
│           └── verify/route.ts        # Payment verification
│
├── lib/                          # Shared utilities & configs
│   ├── anthropic.ts              # Claude client + system prompts
│   ├── replicate.ts              # Replicate client + FLUX prompt builder
│   ├── redis.ts                  # Upstash Redis caching (with memory fallback)
│   ├── razorpay.ts               # Payment gateway client
│   ├── supabase/                 # Supabase clients (admin, server, browser)
│   ├── gold/fetcher.ts           # Gold price fetching logic
│   ├── seed-products.ts          # Product catalog data (35 items)
│   ├── admin-data.ts             # Admin panel mock data
│   ├── constants.ts              # App constants & config
│   ├── types.ts                  # TypeScript interfaces (240 lines)
│   └── utils.ts                  # Price calculation, formatting
│
├── components/layout/            # Shared UI components
│   ├── Header.tsx                # Navigation bar with gold ticker
│   └── Footer.tsx                # Footer with links
│
├── hooks/
│   └── useGoldPrice.ts           # Real-time gold price hook (30s polling)
│
└── public/images/                # 35 product images (AI-generated)
```

## 🔑 Key Features

### AI Design Studio (Forge)
- Upload jewelry photos or enter text prompts
- **Claude Vision** analyzes uploaded images for style, metal, and karat
- **Replicate FLUX** generates 4 photorealistic designs (primary)
- **Meshy AI** text-to-image fallback when Replicate is unavailable
- Design customization: metal, karat, weight adjustments

### AI Concierge
- Streaming chat powered by **Claude Sonnet 4**
- Injected with live gold prices for accurate recommendations
- Buffered stream parser for reliable chunk handling
- Custom system prompt for luxury jewelry expertise

### Live Gold Pricing
- Real-time prices from **GoldAPI.io** (24K, 22K, 18K, 14K)
- 30-second polling with Redis caching
- Price lock system with premium tiers

### Admin Panel
- **Mission Control**: Revenue, users, API costs dashboard
- **API Health**: Real-time status for Claude, GoldAPI, Replicate, Meshy
- **API Key Management**: Save/test all keys with inline feedback
- **Order Pipeline**: Track orders through manufacturing stages
- **Activity Tracking**: Supabase call logging

## 🛠️ Environment Variables

| Variable | Service | Required |
|----------|---------|----------|
| `ANTHROPIC_API_KEY` | Claude AI (Chat + Vision) | ✅ |
| `MESHY_API_KEY` | Meshy AI (Image Gen Fallback) | ✅ |
| `REPLICATE_API_TOKEN` | Replicate FLUX (Image Gen Primary) | Optional |
| `GOLDAPI_KEY` | GoldAPI.io (Gold Prices) | ✅ |
| `UPSTASH_REDIS_URL` | Upstash Redis (Caching) | Optional |
| `UPSTASH_REDIS_TOKEN` | Upstash Redis (Caching) | Optional |
| `RAZORPAY_KEY_ID` | Razorpay (Payments) | Optional |
| `RAZORPAY_KEY_SECRET` | Razorpay (Payments) | Optional |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your API keys to .env.local

# Run development server
npm run dev

# Build for production
npm run build
```

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `next` 16.1.6 | React framework |
| `@anthropic-ai/sdk` | Claude AI integration |
| `replicate` | FLUX image generation |
| `framer-motion` | Animations |
| `recharts` | Admin dashboard charts |
| `@supabase/supabase-js` | Database & auth |
| `@upstash/redis` | Edge-compatible caching |
| `razorpay` | Payment processing |
| `lucide-react` | Icons |
| `zustand` | State management |
| `zod` | Runtime validation |

## 🎨 Design System

- **Colors**: Dark theme with gold accents (`#D4A853`)
- **Typography**: Playfair Display (headings), DM Sans (body), JetBrains Mono (code)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Responsive**: Mobile-first design with bottom navigation

---

Built with ❤️ by AUREUM · *Forged by Intelligence™*
