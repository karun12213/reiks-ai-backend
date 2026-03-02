'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useGoldPrice } from '@/hooks/useGoldPrice'
import { getSessionInfo, formatINR, calculatePrice } from '@/lib/utils'
import { SEED_PRODUCTS } from '@/lib/seed-products'
import { Wand2, Lock, ShoppingBag, Shield, Sparkles, TrendingUp, ArrowRight, Gem, Zap } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

export default function HomePage() {
  const { price, loading } = useGoldPrice()
  const featured = SEED_PRODUCTS.filter(p => p.is_featured).slice(0, 6)

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-aureum-black via-aureum-dark to-aureum-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,83,0.08)_0%,transparent_70%)]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div variants={fadeIn} className="mb-4">
                <span className="inline-block px-3 py-1 text-[10px] font-mono font-semibold text-gold border border-gold/30 rounded-full tracking-widest uppercase">
                  India&apos;s First AI-Native Gold Platform
                </span>
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-4xl sm:text-5xl md:text-7xl font-heading font-extrabold leading-tight"
              >
                <span className="text-aureum-white">Where </span>
                <span className="text-gold-gradient">AI Meets Gold</span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="mt-6 text-lg sm:text-xl text-aureum-mid max-w-2xl mx-auto leading-relaxed"
              >
                Design jewelry with AI, lock live gold prices, buy from master goldsmiths.
                Zero markup on gold. Every piece made to order.
              </motion.p>

              {/* Live Gold Price Display */}
              {price && (
                <motion.div
                  variants={fadeIn}
                  className="mt-8 inline-flex items-center gap-4 px-6 py-3 bg-aureum-card/80 backdrop-blur-md rounded-xl border border-aureum-border gold-border-glow"
                >
                  <div className="text-center">
                    <div className="text-[10px] font-mono text-aureum-dim">24K GOLD</div>
                    <div className="text-xl font-mono font-bold text-gold">
                      ₹{price.gold_24k_gram.toFixed(0)}<span className="text-xs text-aureum-dim">/g</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-aureum-border" />
                  <div className="text-center">
                    <div className="text-[10px] font-mono text-aureum-dim">22K</div>
                    <div className="text-sm font-mono text-aureum-mid">₹{price.gold_22k_gram.toFixed(0)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-mono text-aureum-dim">18K</div>
                    <div className="text-sm font-mono text-aureum-mid">₹{price.gold_18k_gram.toFixed(0)}</div>
                  </div>
                  <div className="w-px h-8 bg-aureum-border" />
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getSessionInfo(price.session).color }}
                    />
                    <span className="text-xs font-mono text-aureum-dim">{price.session}</span>
                  </div>
                </motion.div>
              )}

              {/* CTA Buttons */}
              <motion.div variants={fadeIn} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/forge"
                  className="btn-gold px-8 py-3.5 rounded-lg text-sm tracking-wider flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Wand2 size={16} />
                  Design with AI
                </Link>
                <Link
                  href="/collection"
                  className="btn-outline-gold px-8 py-3.5 rounded-lg text-sm tracking-wider flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <ShoppingBag size={16} />
                  Explore Collection
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section className="py-20 bg-aureum-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-heading font-bold text-aureum-white">
                How <span className="text-gold">AUREUM</span> Works
              </motion.h2>
              <motion.p variants={fadeIn} className="mt-3 text-aureum-mid text-sm">
                From inspiration to doorstep in three simple steps.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: Sparkles,
                  step: '01',
                  title: 'Upload & Design',
                  desc: 'Upload any inspiration image. Claude Vision analyzes it. FLUX generates 4 custom variations in your chosen metal and karat.',
                  color: 'text-purple-400',
                },
                {
                  icon: Lock,
                  step: '02',
                  title: 'Lock the Price',
                  desc: 'See a price you like? Lock it for 24h–7d with a small premium. Gold won\'t rise on you.',
                  color: 'text-gold',
                },
                {
                  icon: Gem,
                  step: '03',
                  title: 'Master Craftsmen Build',
                  desc: 'Chennai\'s finest goldsmiths craft your piece. BIS hallmarked, insured delivery, certificate of authenticity.',
                  color: 'text-success',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="relative p-8 bg-aureum-card rounded-xl border border-aureum-border card-hover group"
                >
                  <div className={`${item.color} mb-4`}>
                    <item.icon size={28} />
                  </div>
                  <div className="absolute top-6 right-6 text-4xl font-heading font-bold text-aureum-border group-hover:text-gold/10 transition-colors">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-aureum-white mb-2">{item.title}</h3>
                  <p className="text-sm text-aureum-mid leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ FEATURED PRODUCTS ═══ */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-aureum-white">
                  Featured <span className="text-gold">Pieces</span>
                </h2>
                <p className="mt-2 text-sm text-aureum-mid">Prices update live with the gold market.</p>
              </div>
              <Link
                href="/collection"
                className="hidden sm:flex items-center gap-1 text-sm text-gold hover:text-gold-light transition-colors"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {featured.map((product, i) => {
                const livePrice = price
                  ? calculatePrice(price.gold_24k_gram, product.base_weight_grams, product.default_karat, product.making_charges_per_gram)
                  : null

                return (
                  <motion.div
                    key={product.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      className="block bg-aureum-card rounded-xl border border-aureum-border card-hover overflow-hidden group"
                    >
                      {/* Image placeholder */}
                      <div className="aspect-square bg-gradient-to-br from-aureum-card to-aureum-dark flex items-center justify-center relative overflow-hidden">
                        <div className="text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                          {product.category === 'rings' ? '💍' : product.category === 'chains' ? '🔗' : product.category === 'pendants' ? '📿' : product.category === 'bracelets' ? '⌚' : product.category === 'earrings' ? '✨' : product.category === 'bangles' ? '⭕' : '👑'}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="text-[10px] font-mono text-gold bg-black/60 px-2 py-0.5 rounded">
                            {product.default_karat}K {product.base_weight_grams}g
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-aureum-white group-hover:text-gold transition-colors truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-aureum-dim mt-1 truncate">{product.short_description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            {livePrice ? (
                              <div className="text-base font-mono font-bold text-gold">
                                {formatINR(livePrice.total)}
                              </div>
                            ) : (
                              <div className="h-5 w-20 bg-aureum-border rounded animate-pulse" />
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-aureum-dim">
                            {price ? (price.isLive ? 'LIVE' : 'SIM') : '...'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/collection" className="btn-outline-gold px-6 py-2.5 rounded-lg text-sm inline-flex items-center gap-2">
                View All Collection <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ TRUST INDICATORS ═══ */}
        <section className="py-16 bg-aureum-dark border-y border-aureum-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: '0% Gold Markup', desc: 'Pay spot price, verified live' },
                { icon: TrendingUp, title: 'Live Prices', desc: 'Metals-API + GoldAPI feed' },
                { icon: Zap, title: 'Made to Order', desc: 'Crafted by master goldsmiths' },
                { icon: Sparkles, title: 'AI Designed', desc: 'FLUX + Claude Vision engine' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold/10 text-gold mb-3">
                    <item.icon size={22} />
                  </div>
                  <h4 className="text-sm font-semibold text-aureum-white">{item.title}</h4>
                  <p className="text-xs text-aureum-dim mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ AI DESIGN CTA ═══ */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-aureum-card to-aureum-dark border border-gold/20 p-8 md:p-16">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,168,83,0.12)_0%,transparent_60%)]" />
              <div className="relative max-w-xl">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-aureum-white">
                  Your Design. <span className="text-gold">Our Intelligence.</span>
                </h2>
                <p className="mt-4 text-aureum-mid leading-relaxed">
                  Upload any image — a Pinterest board, a photo from a wedding, even a sketch on a napkin.
                  Our AI analyzes the design, generates variations in your chosen metal and karat,
                  and calculates the price in real-time.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href="/forge" className="btn-gold px-8 py-3 rounded-lg text-sm tracking-wider flex items-center gap-2 justify-center">
                    <Wand2 size={16} />
                    Open Forge Studio
                  </Link>
                  <Link href="/concierge" className="btn-outline-gold px-8 py-3 rounded-lg text-sm tracking-wider flex items-center gap-2 justify-center">
                    <Sparkles size={16} />
                    Talk to AI Concierge
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
