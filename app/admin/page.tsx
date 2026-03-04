'use client'

import { useState, useEffect, useMemo } from 'react'
import { useGoldPrice } from '@/hooks/useGoldPrice'
import { Shield, Key, TrendingUp, Users, Package, Sparkles, Cog, Check, AlertTriangle, ChevronRight, BarChart3, Zap, Star } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { FEATURES, ORDERS, LOCKS, USERS, API_SERVICES, AI_QUEUE, ALERTS, GOLDSMITHS, REVENUE_STREAMS, genPriceHistory, genDailyRev } from '@/lib/admin-data'

type Nav = 'mission' | 'gold' | 'orders' | 'sip' | 'ai' | 'users' | 'revenue' | 'system' | 'config'

const NAV_ITEMS: { id: Nav; icon: string; label: string }[] = [
    { id: 'mission', icon: '◉', label: 'Mission Control' },
    { id: 'gold', icon: '◈', label: 'Gold Ops' },
    { id: 'orders', icon: '◆', label: 'Orders' },
    { id: 'sip', icon: '⧖', label: 'SIP Manager' },
    { id: 'ai', icon: '◎', label: 'AI Engine' },
    { id: 'users', icon: '◇', label: 'Users' },
    { id: 'revenue', icon: '◊', label: 'Revenue' },
    { id: 'system', icon: '⬡', label: 'System' },
    { id: 'config', icon: '⚙', label: 'Settings' },
]

const statusColor = (s: string) => s === 'healthy' ? '#4ade80' : s === 'degraded' ? '#fbbf24' : '#f87171'
const orderColor = (s: string) => ({ confirmed: '#c084fc', payment_pending: '#fbbf24', manufacturing: '#60a5fa', shipped: '#22d3ee', delivered: '#4ade80' }[s] || '#555')
const tierColor = (t: string) => ({ Diamond: '#60a5fa', Platinum: '#c084fc', Gold: '#D4A853', Free: '#555' }[t] || '#555')

function Badge({ text, color }: { text: string; color: string }) {
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold whitespace-nowrap" style={{ background: color + '18', color }}>{text}</span>
}

function Stat({ label, value, sub, trend, accent }: { label: string; value: string; sub?: string; trend?: string; accent?: boolean }) {
    const trendColor = trend?.startsWith('+') || trend === 'Healthy' || trend === 'On Track' || trend === 'All green' || trend?.includes('✓') ? '#4ade80' : trend?.startsWith('-') ? '#f87171' : '#fbbf24'
    return (
        <div className={`rounded-xl p-3.5 border relative overflow-hidden ${accent ? 'border-gold/40 bg-gradient-to-br from-[#1a1205] to-[#2a1f0a]' : 'border-aureum-border bg-aureum-dark'}`}>
            {accent && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-[#8B6914]" />}
            <div className="text-[10px] text-aureum-dim uppercase tracking-widest font-mono truncate">{label}</div>
            <div className={`text-xl font-mono font-bold mt-1 ${accent ? 'text-gold' : 'text-aureum-white'}`}>{value}</div>
            <div className="flex justify-between items-center mt-1">
                {sub && <span className="text-[10px] text-aureum-dim">{sub}</span>}
                {trend && <span className="text-[10px] font-mono" style={{ color: trendColor }}>{trend}</span>}
            </div>
        </div>
    )
}

function Card({ children, gold }: { children: React.ReactNode; gold?: boolean }) {
    return <div className={`rounded-xl p-4 border ${gold ? 'border-gold/30 bg-gradient-to-br from-[#1a1205] to-[#1f1808]' : 'border-aureum-border bg-aureum-dark'}`}>{children}</div>
}

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [nav, setNav] = useState<Nav>('mission')
    const { price: livePrice } = useGoldPrice()
    const [goldPrice, setGoldPrice] = useState(6523.4)
    const [goldDelta, setGoldDelta] = useState(0.82)
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        if (livePrice) {
            setGoldPrice(livePrice.gold_24k_gram)
            setGoldDelta(livePrice.isLive ? 1.25 : 0.82)
        }
    }, [livePrice])
    const [features, setFeatures] = useState(FEATURES)
    const [orders, setOrders] = useState(ORDERS)
    const [locks, setLocks] = useState(LOCKS)
    const [alerts, setAlerts] = useState(ALERTS)
    const [sips, setSips] = useState<any[]>([]) // Add state for tracking SIPs
    const [collapsed, setCollapsed] = useState(false)
    const [anthropicKey, setAnthropicKey] = useState('')
    const [replicateKey, setReplicateKey] = useState('')
    const [metalsKey, setMetalsKey] = useState('')
    const [goldApiKey, setGoldApiKey] = useState('')
    const [razorpayKey, setRazorpayKey] = useState('')
    const [supabaseUrl, setSupabaseUrl] = useState('')
    const [supabaseAnonKey, setSupabaseAnonKey] = useState('')
    const [upstashUrl, setUpstashUrl] = useState('')
    const [upstashToken, setUpstashToken] = useState('')
    const [testingKey, setTestingKey] = useState<string | null>(null)
    const [testResults, setTestResults] = useState<Record<string, { status: 'success' | 'error', message: string }>>({})

    const priceHistory = useMemo(genPriceHistory, [])
    const dailyRev = useMemo(genDailyRev, [])

    useEffect(() => {
        const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('aureum-admin') === 'true'
        setAuthenticated(isAuth)
        if (typeof window !== 'undefined') {
            const localOrders = JSON.parse(localStorage.getItem('aureum_orders') || '[]')
            const localLocks = JSON.parse(localStorage.getItem('aureum_locks') || '[]')
            if (localOrders.length > 0) setOrders([...localOrders, ...ORDERS])
            if (localLocks.length > 0) setLocks([...localLocks, ...LOCKS])
            setAnthropicKey(localStorage.getItem('aureum_anthropic_key') || '')
            setReplicateKey(localStorage.getItem('aureum_replicate_key') || '')
            setMetalsKey(localStorage.getItem('aureum_metals_key') || '')
            setGoldApiKey(localStorage.getItem('aureum_gold_api_key') || '')
            setRazorpayKey(localStorage.getItem('aureum_razorpay_key') || '')
            setSupabaseUrl(localStorage.getItem('aureum_supabase_url') || '')
            setSupabaseAnonKey(localStorage.getItem('aureum_supabase_anon_key') || '')
            setUpstashUrl(localStorage.getItem('aureum_upstash_url') || '')
            setUpstashToken(localStorage.getItem('aureum_upstash_token') || '')
        }
    }, [])

    useEffect(() => {
        if (!authenticated) return
        const i = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(i)
    }, [authenticated])

    function handleLogin() {
        const pw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'aureum-admin-2024'
        if (password === pw) {
            sessionStorage.setItem('aureum-admin', 'true')
            setAuthenticated(true)
        }
    }

    if (!authenticated) {
        return (
            <div className="min-h-screen bg-[#080808] flex items-center justify-center">
                <div className="max-w-sm w-full mx-auto px-4">
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Shield size={24} className="text-gold" />
                        </div>
                        <h1 className="text-2xl font-heading font-bold text-gold tracking-widest">AUREUM</h1>
                        <p className="text-xs text-aureum-dim mt-1">Operations Center — Admin Access Required</p>
                    </div>
                    <form onSubmit={e => { e.preventDefault(); handleLogin() }}>
                        <input type="password" placeholder="Admin password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-aureum-card border border-aureum-border rounded-lg text-sm text-aureum-white placeholder:text-aureum-dim focus:outline-none focus:border-gold/40 mb-3" />
                        <button type="submit" className="btn-gold w-full py-3 rounded-lg text-sm">Access Ops Center</button>
                        <p className="text-[10px] text-aureum-dim mt-3 text-center">Default: aureum-admin-2024</p>
                    </form>
                </div>
            </div>
        )
    }

    const session = (() => { const h = time.getUTCHours(); return h >= 22 || h < 7 ? 'ASIAN' : h < 12 ? 'LONDON' : 'NEW YORK' })()
    const sessionClr = session === 'ASIAN' ? '#f87171' : session === 'LONDON' ? '#60a5fa' : '#4ade80'
    const activeFeatures = features.filter(f => f.status).length
    const unresolvedAlerts = alerts.filter(a => !a.resolved).length
    const totalRev = REVENUE_STREAMS.reduce((s, r) => s + r.value, 0)
    const totalCost = API_SERVICES.reduce((s, a) => s + a.cost, 0)

    const toggleFeature = (id: string) => setFeatures(f => f.map(x => x.id === id ? { ...x, status: !x.status } : x))
    const resolveAlert = (id: number) => setAlerts(a => a.map(x => x.id === id ? { ...x, resolved: true } : x))
    const updateOrder = (id: string, status: string) => setOrders(o => o.map(x => x.id === id ? { ...x, status } : x))

    const testKey = async (service: string, key: string) => {
        if (!key) {
            setTestResults(prev => ({ ...prev, [service]: { status: 'error', message: 'Please enter a key first.' } }))
            return
        }
        setTestingKey(service)
        setTestResults(prev => {
            const next = { ...prev }
            delete next[service]
            return next
        })

        try {
            const res = await fetch('/api/admin/test-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ service, key })
            })
            const data = await res.json()
            if (res.ok && data.success) {
                setTestResults(prev => ({ ...prev, [service]: { status: 'success', message: data.message } }))
            } else {
                setTestResults(prev => ({ ...prev, [service]: { status: 'error', message: data.error || 'Connection failed' } }))
            }
        } catch (e: any) {
            setTestResults(prev => ({ ...prev, [service]: { status: 'error', message: e.message } }))
        } finally {
            setTestingKey(null)
        }
    }

    const handleSaveKeys = () => {
        if (typeof window === 'undefined') return
        localStorage.setItem('aureum_anthropic_key', anthropicKey)
        localStorage.setItem('aureum_replicate_key', replicateKey)
        localStorage.setItem('aureum_metals_key', metalsKey)
        localStorage.setItem('aureum_gold_api_key', goldApiKey)
        localStorage.setItem('aureum_razorpay_key', razorpayKey)
        localStorage.setItem('aureum_supabase_url', supabaseUrl)
        localStorage.setItem('aureum_supabase_anon_key', supabaseAnonKey)
        localStorage.setItem('aureum_upstash_url', upstashUrl)
        localStorage.setItem('aureum_upstash_token', upstashToken)
        alert('All credentials saved successfully to localStorage.')
    }

    // ─── SECTIONS ───
    const renderMission = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Stat label="Gold Spot /g" value={`₹${goldPrice.toFixed(0)}`} sub={`22K: ₹${(goldPrice * .916).toFixed(0)}`} trend={`${goldDelta >= 0 ? '+' : ''}${goldDelta.toFixed(2)}%`} accent />
                <Stat label="Monthly Revenue" value={`₹${(totalRev / 1000).toFixed(1)}K`} sub="30 orders + fees" trend="+24%" />
                <Stat label="Active Users" value="78" sub="of 100 registered" trend="+12 this week" />
                <Stat label="API Cost MTD" value={`₹${totalCost}`} sub="Budget: ₹6,273" trend="On Track" />
                <Stat label="Active Features" value={`${activeFeatures}/${features.length}`} sub={`${features.length - activeFeatures} disabled`} trend="Healthy" />
                <Stat label="Alerts" value={unresolvedAlerts.toString()} sub={`${alerts.filter(a => a.resolved).length} resolved`} trend={unresolvedAlerts > 2 ? '⚠ Review' : 'OK'} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <h3 className="text-sm font-semibold text-aureum-white mb-3">Gold Price — 48h</h3>
                    <div className="flex gap-2 mb-3 flex-wrap">
                        <Badge text={`● ${session}`} color={sessionClr} />
                        <Badge text={`24K: ₹${goldPrice.toFixed(0)}`} color="#D4A853" />
                        <Badge text={`22K: ₹${(goldPrice * .916).toFixed(0)}`} color="#D4A853" />
                    </div>
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={priceHistory}>
                                <defs><linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D4A853" stopOpacity={0.25} /><stop offset="100%" stopColor="#D4A853" stopOpacity={0} /></linearGradient></defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                                <XAxis dataKey="t" tick={{ fill: '#333', fontSize: 9 }} axisLine={false} tickLine={false} interval={5} />
                                <YAxis tick={{ fill: '#333', fontSize: 9 }} axisLine={false} tickLine={false} domain={['dataMin-30', 'dataMax+30']} />
                                <Tooltip contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: 6, fontSize: 11, color: '#D4A853' }} />
                                <Area type="monotone" dataKey="price" stroke="#D4A853" fill="url(#gG)" strokeWidth={1.5} dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card>
                    <h3 className="text-sm font-semibold text-aureum-white mb-3">Active Alerts</h3>
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                        {alerts.filter(a => !a.resolved).map(a => (
                            <div key={a.id} className="flex gap-2 items-start p-2 bg-[#111] rounded-md" style={{ borderLeft: `3px solid ${a.type === 'critical' ? '#f87171' : a.type === 'warning' ? '#fbbf24' : '#60a5fa'}` }}>
                                <span className="text-[10px]">{a.type === 'critical' ? '🔴' : a.type === 'warning' ? '🟡' : '🔵'}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[11px] font-semibold text-aureum-white">{a.title}</div>
                                    <div className="text-[10px] text-aureum-dim">{a.msg}</div>
                                </div>
                                <button onClick={() => resolveAlert(a.id)} className="text-[9px] border border-aureum-border text-aureum-dim px-1.5 py-0.5 rounded hover:text-gold shrink-0">✓</button>
                            </div>
                        ))}
                        {unresolvedAlerts === 0 && <p className="text-xs text-aureum-dim text-center py-4">All clear ✓</p>}
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <h3 className="text-sm font-semibold text-aureum-white mb-3">Order Pipeline</h3>
                    {[
                        { label: 'Payment Pending', count: orders.filter(o => o.status === 'payment_pending').length, color: '#fbbf24' },
                        { label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length, color: '#c084fc' },
                        { label: 'Manufacturing', count: orders.filter(o => o.status === 'manufacturing').length, color: '#60a5fa' },
                        { label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length, color: '#22d3ee' },
                        { label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, color: '#4ade80' },
                    ].map(s => (
                        <div key={s.label} className="flex items-center gap-3 py-1.5">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                            <span className="flex-1 text-xs text-aureum-mid">{s.label}</span>
                            <span className="text-sm font-mono font-bold text-aureum-white">{s.count}</span>
                        </div>
                    ))}
                </Card>
                <Card>
                    <h3 className="text-sm font-semibold text-aureum-white mb-3">Daily Revenue (30d)</h3>
                    <div className="h-36">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyRev}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                                <XAxis dataKey="d" tick={{ fill: '#333', fontSize: 9 }} axisLine={false} />
                                <YAxis tick={{ fill: '#333', fontSize: 9 }} axisLine={false} />
                                <Tooltip contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: 6, fontSize: 11 }} formatter={(v: number | string | undefined) => `₹${v}`} />
                                <Bar dataKey="rev" fill="#D4A853" radius={[3, 3, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
            <Card>
                <h3 className="text-sm font-semibold text-aureum-white mb-3">API Health Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {API_SERVICES.slice(0, 8).map(api => (
                        <div key={api.name} className="p-2.5 bg-[#111] rounded-md" style={{ borderLeft: `3px solid ${statusColor(api.status)}` }}>
                            <div className="text-[11px] font-semibold text-aureum-white mb-1">{api.name}</div>
                            <div className="flex justify-between text-[10px] text-aureum-dim">
                                <span>{api.latency}</span>
                                <span style={{ color: statusColor(api.status) }}>{api.status}</span>
                            </div>
                            {api.limit && <div className="mt-1.5 h-1 bg-[#1a1a1a] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.min((api.calls! / api.limit) * 100, 100)}%`, background: (api.calls! / api.limit) > 0.85 ? '#f87171' : (api.calls! / api.limit) > 0.6 ? '#fbbf24' : '#D4A853' }} /></div>}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )

    const renderGold = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Stat label="24K Gold/gram" value={`₹${goldPrice.toFixed(2)}`} trend={`${goldDelta >= 0 ? '+' : ''}${goldDelta.toFixed(2)}%`} accent />
                <Stat label="22K /gram" value={`₹${(goldPrice * .916).toFixed(0)}`} sub="Wedding standard" />
                <Stat label="18K /gram" value={`₹${(goldPrice * .75).toFixed(0)}`} sub="Modern jewelry" />
                <Stat label="14K /gram" value={`₹${(goldPrice * .585).toFixed(0)}`} sub="Lightweight" />
                <Stat label="Active Locks" value={locks.filter(l => l.status === 'active').length.toString()} sub={`₹${(locks.filter(l => l.status === 'active').reduce((s, l) => s + l.locked, 0) / 100000).toFixed(1)}L locked`} />
                <Stat label="Lock Premiums" value={`₹${locks.reduce((s, l) => s + l.premium, 0).toLocaleString()}`} sub="Revenue earned" trend="+100%" />
            </div>

            {/* New Active SIPs Table */}
            {sips.length > 0 && (
                <Card>
                    <h3 className="text-sm font-semibold text-aureum-white mb-3 flex items-center gap-2"><Sparkles size={14} className="text-gold" /> Active VaultTrade SIPs</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead><tr className="border-b border-aureum-border">
                                {['User', 'Monthly Amount', 'Total Invested', 'Gold Accumulated', 'Next Deposit', 'Frequency'].map(h => <th key={h} className="px-3 py-2 text-[9px] font-mono font-semibold text-aureum-dim uppercase tracking-wider">{h}</th>)}
                            </tr></thead>
                            <tbody>
                                {sips.map((s, i) => (
                                    <tr key={i} className="border-b border-[#111]">
                                        <td className="px-3 py-2 text-xs">{s.user}</td>
                                        <td className="px-3 py-2 text-xs font-mono text-gold">₹{s.amount.toLocaleString()}</td>
                                        <td className="px-3 py-2 text-xs font-mono">₹{s.totalInvested.toLocaleString()}</td>
                                        <td className="px-3 py-2 text-xs font-mono font-bold text-success">{s.goldAccumulated.toFixed(4)}g</td>
                                        <td className="px-3 py-2 text-xs font-mono text-aureum-mid">{s.nextDate}</td>
                                        <td className="px-3 py-2"><Badge text={s.frequency.toUpperCase()} color="#60a5fa" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <Card>
                <h3 className="text-sm font-semibold text-aureum-white mb-3">Active Price Locks</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b border-aureum-border">
                            {['ID', 'User', 'Product', 'Locked', 'Current', 'P&L', 'Duration', 'Premium', 'Expires', 'Status'].map(h => <th key={h} className="px-3 py-2 text-[9px] font-mono font-semibold text-aureum-dim uppercase tracking-wider">{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {locks.map(l => {
                                const pnl = l.current - l.locked
                                return (
                                    <tr key={l.id} className="border-b border-[#111]">
                                        <td className="px-3 py-2 text-xs font-mono text-gold">{l.id}</td>
                                        <td className="px-3 py-2 text-xs">{l.user}</td>
                                        <td className="px-3 py-2 text-xs text-aureum-mid">{l.product}</td>
                                        <td className="px-3 py-2 text-xs font-mono">₹{l.locked.toLocaleString()}</td>
                                        <td className="px-3 py-2 text-xs font-mono">₹{l.current.toLocaleString()}</td>
                                        <td className={`px-3 py-2 text-xs font-mono font-bold ${pnl >= 0 ? 'text-success' : 'text-error'}`}>{pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString()}</td>
                                        <td className="px-3 py-2 text-xs font-mono text-aureum-mid">{l.duration}</td>
                                        <td className="px-3 py-2 text-xs font-mono text-gold">₹{l.premium.toLocaleString()}</td>
                                        <td className={`px-3 py-2 text-xs font-mono ${l.status === 'active' ? 'text-warning' : 'text-aureum-dim'}`}>{l.expires}</td>
                                        <td className="px-3 py-2"><Badge text={l.status.toUpperCase()} color={l.status === 'active' ? '#4ade80' : l.status === 'converted' ? '#60a5fa' : '#555'} /></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold text-aureum-white mb-3">Goldsmith Partners</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {GOLDSMITHS.map(g => (
                        <div key={g.name} className="p-3 bg-[#111] rounded-lg border border-aureum-border">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-aureum-white">{g.name}</span>
                                <Badge text={`★ ${g.rating}`} color="#D4A853" />
                            </div>
                            <div className="text-[10px] text-aureum-dim mt-1">{g.location} · {g.speciality}</div>
                            <div className="flex gap-4 mt-2">
                                <div><span className="text-base font-mono font-bold text-aureum-white">{g.active}</span><span className="text-[9px] text-aureum-dim ml-1">active</span></div>
                                <div><span className="text-base font-mono font-bold text-aureum-mid">{g.completed}</span><span className="text-[9px] text-aureum-dim ml-1">done</span></div>
                                <div><span className="text-base font-mono font-bold text-gold">{g.avgDays}d</span><span className="text-[9px] text-aureum-dim ml-1">avg</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )

    const renderSip = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Stat label="Active SIPs" value="4" sub="1 paused" trend="+4.2%" accent />
                <Stat label="Total AUM" value="₹3.24L" sub="49.1 grams accumulated" trend="+4.2%" />
                <Stat label="Monthly Inflow" value="₹21,000" sub="Next cycle: Mar 1-15" />
                <Stat label="Mgmt Fee Earned" value="₹1,250" sub="1% annual on AUM" accent />
            </div>

            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-semibold text-aureum-white font-heading tracking-tight">GOLD SIP INVESTORS</h3>
                    <div className="flex gap-2">
                        <Badge text="AUTO-BUY ACTIVE" color="#4ade80" />
                        <Badge text="REBALANCE: 3d" color="#D4A853" />
                    </div>
                </div>
                <div className="overflow-x-auto -mx-4">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-aureum-border bg-[#0a0a0a]">
                                <th className="px-6 py-3 text-[10px] font-mono text-aureum-dim uppercase tracking-wider">Investor</th>
                                <th className="px-6 py-3 text-[10px] font-mono text-aureum-dim uppercase tracking-wider">Plan</th>
                                <th className="px-6 py-3 text-[10px] font-mono text-aureum-dim uppercase tracking-wider">Weight</th>
                                <th className="px-6 py-3 text-[10px] font-mono text-aureum-dim uppercase tracking-wider">Next Buy</th>
                                <th className="px-6 py-3 text-[10px] font-mono text-aureum-dim uppercase tracking-wider">ROI</th>
                                <th className="px-6 py-3 text-[10px] font-mono text-aureum-dim uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#111]">
                            {[
                                { id: 1, user: "Arjun M.", amount: 2000, freq: "Monthly", weight: "4.2g", date: "Mar 15", roi: "+3.2%", status: "active" },
                                { id: 2, user: "Priya S.", amount: 5000, freq: "Monthly", weight: "11.8g", date: "Mar 01", roi: "+5.1%", status: "active" },
                                { id: 3, user: "Rahul K.", amount: 1000, freq: "Weekly", weight: "2.1g", date: "Mar 03", roi: "+1.8%", status: "active" },
                                { id: 4, user: "Deepa R.", amount: 3000, freq: "Monthly", weight: "3.6g", date: "Mar 10", roi: "+2.4%", status: "active" },
                                { id: 5, user: "Vikram T.", amount: 10000, freq: "Monthly", weight: "28.4g", date: "Paused", roi: "+8.7%", status: "paused" },
                            ].map(sip => (
                                <tr key={sip.id} className="hover:bg-gold/5 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-aureum-white">{sip.user}</div>
                                        <div className="text-[10px] text-aureum-dim">ID: {sip.id * 123}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-xs text-gold font-mono">₹{sip.amount.toLocaleString()}</div>
                                        <div className="text-[10px] text-aureum-mid">{sip.freq}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-aureum-white">{sip.weight}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-aureum-mid">{sip.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Badge text={sip.roi} color="#4ade80" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-tight transition-all border ${sip.status === 'active' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500/20' : 'bg-success/10 border-success/30 text-success hover:bg-success/20'}`}>
                                            {sip.status === 'active' ? 'PAUSE SIP' : 'RESUME SIP'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card gold>
                    <h3 className="text-sm font-bold text-gold mb-4 flex items-center gap-2">
                        <TrendingUp size={16} /> SIP ENGINE LOGS
                    </h3>
                    <div className="space-y-3 font-mono text-[10px]">
                        {[
                            { t: "14:22:01", m: "Buy window open for 12 users", c: "text-aureum-mid" },
                            { t: "14:22:05", m: "Price dip detected: ₹14,548 (-0.2%)", c: "text-success" },
                            { t: "14:22:06", m: "Executing batch purchase: 14.2g", c: "text-gold" },
                            { t: "14:23:10", m: "Razorpay mandate captured: ₹2,000 (Arjun M.)", c: "text-aureum-dim" },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-3 border-l border-gold/20 pl-3">
                                <span className="text-gold/50 shrink-0">{log.t}</span>
                                <span className={log.c}>{log.m}</span>
                            </div>
                        ))}
                    </div>
                </Card>
                <div className="space-y-4">
                    <Card>
                        <h4 className="text-xs font-bold text-aureum-white mb-2">MATERIALIZATION PIPELINE</h4>
                        <div className="flex justify-between items-center bg-[#111] p-3 rounded-lg border border-aureum-border">
                            <div>
                                <div className="text-xs text-gold font-bold">Vikram T.</div>
                                <div className="text-[10px] text-aureum-dim">28.4g ready to materialize</div>
                            </div>
                            <button className="bg-gold text-black px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-gold-light transition-colors">START FORGE</button>
                        </div>
                    </Card>
                    <Card>
                        <h4 className="text-xs font-bold text-aureum-white mb-2">SIP GROWTH TARGETS</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] text-aureum-mid"><span>Investor Retention</span><span>92%</span></div>
                            <div className="w-full h-1.5 bg-[#111] rounded-full overflow-hidden"><div className="h-full bg-gold" style={{ width: '92%' }}></div></div>
                            <div className="flex justify-between text-[10px] text-aureum-mid"><span>AUM Growth (MTD)</span><span>₹1.2L / ₹2.0L</span></div>
                            <div className="w-full h-1.5 bg-[#111] rounded-full overflow-hidden"><div className="h-full bg-success" style={{ width: '60%' }}></div></div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )


    const renderOrders = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Stat label="Total Orders" value={orders.length.toString()} sub="This month" accent />
                <Stat label="GMV" value={`₹${(orders.reduce((s, o) => s + o.amount, 0) / 100000).toFixed(1)}L`} />
                <Stat label="Total Margin" value={`₹${(orders.reduce((s, o) => s + o.margin, 0) / 1000).toFixed(1)}K`} trend="+15.5% avg" />
                <Stat label="In Manufacturing" value={orders.filter(o => o.status === 'manufacturing').length.toString()} sub="Avg 5 days" />
                <Stat label="Shipped" value={orders.filter(o => o.status === 'shipped').length.toString()} />
                <Stat label="Fulfillment Rate" value="96.7%" trend="Healthy" />
            </div>
            <Card>
                <h3 className="text-sm font-semibold text-aureum-white mb-3">Full Order Pipeline</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b border-aureum-border">
                            {['Order', 'Customer', 'Product', 'Amount', 'Weight', 'Gold ₹/g', 'Margin', 'Lock', 'Goldsmith', 'Status', 'Actions'].map(h => <th key={h} className="px-3 py-2 text-[9px] font-mono font-semibold text-aureum-dim uppercase tracking-wider">{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id} className="border-b border-[#111]">
                                    <td className="px-3 py-2 text-xs font-mono text-gold">{o.id}</td>
                                    <td className="px-3 py-2 text-xs">{o.customer}</td>
                                    <td className="px-3 py-2 text-xs text-aureum-mid">{o.product}</td>
                                    <td className="px-3 py-2 text-xs font-mono font-bold">₹{o.amount.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-xs font-mono">{o.weight}</td>
                                    <td className="px-3 py-2 text-xs font-mono text-aureum-mid">₹{o.goldAt}</td>
                                    <td className="px-3 py-2 text-xs font-mono text-success">₹{o.margin.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-xs font-mono text-aureum-dim">{o.lockId || '—'}</td>
                                    <td className="px-3 py-2 text-xs text-aureum-mid">{o.goldsmith}</td>
                                    <td className="px-3 py-2"><Badge text={o.status.replace('_', ' ').toUpperCase()} color={orderColor(o.status)} /></td>
                                    <td className="px-3 py-2">
                                        <div className="flex gap-1">
                                            {o.status === 'confirmed' && <button onClick={() => updateOrder(o.id, 'manufacturing')} className="text-[9px] font-mono px-2 py-0.5 rounded border border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20">→ Mfg</button>}
                                            {o.status === 'manufacturing' && <button onClick={() => updateOrder(o.id, 'shipped')} className="text-[9px] font-mono px-2 py-0.5 rounded border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20">→ Ship</button>}
                                            {o.status === 'shipped' && <button onClick={() => updateOrder(o.id, 'delivered')} className="text-[9px] font-mono px-2 py-0.5 rounded border border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20">→ Done</button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )

    const renderAI = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Stat label="AI Calls Today" value="47" sub="Chat: 18 · Design: 12" accent />
                <Stat label="AI Cost Today" value="₹142" sub="Budget: ₹209/day" trend="On Track" />
                <Stat label="Avg Latency" value="2.4s" sub="Chat: 0.4s · Gen: 8s" />
                <Stat label="Queue Depth" value="1" sub="1 Meshy 3D processing" />
                <Stat label="Cache Hit Rate" value="34%" sub="Prompt caching active" trend="+12%" />
                <Stat label="Cost per User" value="₹1.82" sub="Per active user today" />
            </div>
            <Card>
                <h3 className="text-sm font-semibold text-aureum-white mb-3">AI Processing Queue</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b border-aureum-border">
                            {['ID', 'User', 'Type', 'Model', 'Input', 'Duration', 'Cost', 'Status'].map(h => <th key={h} className="px-3 py-2 text-[9px] font-mono font-semibold text-aureum-dim uppercase tracking-wider">{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {AI_QUEUE.map(q => (
                                <tr key={q.id} className="border-b border-[#111]">
                                    <td className="px-3 py-2 text-xs font-mono text-gold">{q.id}</td>
                                    <td className="px-3 py-2 text-xs">{q.user}</td>
                                    <td className="px-3 py-2"><Badge text={q.type.replace('_', ' ')} color={q.type === 'design_gen' ? '#c084fc' : q.type === 'vision' ? '#60a5fa' : q.type === 'chat' ? '#4ade80' : '#fbbf24'} /></td>
                                    <td className="px-3 py-2 text-xs font-mono text-aureum-mid">{q.model}</td>
                                    <td className="px-3 py-2 text-xs text-aureum-mid max-w-[200px] truncate">{q.input}</td>
                                    <td className="px-3 py-2 text-xs font-mono text-aureum-mid">{q.duration}</td>
                                    <td className="px-3 py-2 text-xs font-mono text-gold">{q.cost}</td>
                                    <td className="px-3 py-2"><Badge text={q.status.toUpperCase()} color={q.status === 'completed' ? '#4ade80' : '#fbbf24'} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <h3 className="text-sm font-semibold text-aureum-white mb-3">Model Cost Breakdown</h3>
                    {[
                        { model: 'Claude Haiku', calls: 312, cost: 177, per: '₹0.57', use: 'Concierge chat, certificates' },
                        { model: 'Claude Sonnet', calls: 187, cost: 137, per: '₹0.73', use: 'Vision analysis' },
                        { model: 'FLUX Dev', calls: 743, cost: 2230, per: '₹3.00', use: 'Final designs, try-on' },
                        { model: 'FLUX Schnell', calls: 1284, cost: 410, per: '₹0.32', use: 'Preview generation' },
                        { model: 'Meshy', calls: 38, cost: 570, per: '₹15.0', use: '3D model generation' },
                    ].map(m => (
                        <div key={m.model} className="flex items-center gap-3 py-2 border-b border-[#111] last:border-0">
                            <div className="flex-1">
                                <div className="text-xs font-semibold text-aureum-white">{m.model}</div>
                                <div className="text-[10px] text-aureum-dim">{m.use}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-mono text-gold">₹{m.cost}</div>
                                <div className="text-[9px] text-aureum-dim">{m.calls} calls · {m.per}/call</div>
                            </div>
                        </div>
                    ))}
                </Card>
                <Card>
                    <h3 className="text-sm font-semibold text-aureum-white mb-3">AI Feature Flows</h3>
                    {[
                        { flow: 'Design Studio', steps: 'Upload → Vision → FLUX ×4 → Editor', cost: '₹4.73/session' },
                        { flow: 'Concierge Chat', steps: 'Msg → Haiku → Response + products', cost: '₹0.57/chat' },
                        { flow: 'AI Try-On', steps: 'Selfie + product → FLUX inpaint', cost: '₹3.00/try-on' },
                        { flow: '3D Generation', steps: 'Design → Meshy → GLB → Three.js', cost: '₹15.00/model' },
                    ].map(f => (
                        <div key={f.flow} className="py-2 border-b border-[#111] last:border-0">
                            <div className="flex justify-between">
                                <span className="text-xs font-semibold text-aureum-white">{f.flow}</span>
                                <span className="text-[10px] font-mono text-gold">{f.cost}</span>
                            </div>
                            <div className="text-[10px] text-aureum-dim mt-1">{f.steps}</div>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    )

    const renderUsers = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Stat label="Total Users" value="100" sub="78 active" accent />
                <Stat label="Paying Users" value="34" sub="34% conversion" trend="+8" />
                <Stat label="ARPU" value="₹775" sub="Revenue/user/mo" />
                <Stat label="Forge Pass" value="12" sub="₹3,588 MRR" />
                <Stat label="SIP Users" value="4" sub="₹18K/mo inflow" />
                <Stat label="Top Spender" value="₹3.45L" sub="Vikram T." />
            </div>
            <Card>
                <h3 className="text-sm font-semibold text-aureum-white mb-3">User Management</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b border-aureum-border">
                            {['User', 'Tier', 'Spent', 'Designs', 'Locks', 'Orders', 'AI Calls', 'SIP', 'Pass', 'Last Active'].map(h => <th key={h} className="px-3 py-2 text-[9px] font-mono font-semibold text-aureum-dim uppercase tracking-wider">{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {USERS.map(u => (
                                <tr key={u.id} className="border-b border-[#111] hover:bg-[#111] cursor-pointer transition-colors">
                                    <td className="px-3 py-2"><div className="text-xs font-medium text-aureum-white">{u.name}</div><div className="text-[9px] text-aureum-dim">{u.email}</div></td>
                                    <td className="px-3 py-2"><Badge text={u.tier} color={tierColor(u.tier)} /></td>
                                    <td className="px-3 py-2 text-xs font-mono font-bold">{u.spent > 0 ? `₹${(u.spent / 1000).toFixed(1)}K` : '—'}</td>
                                    <td className="px-3 py-2 text-xs font-mono">{u.designs}</td>
                                    <td className="px-3 py-2 text-xs font-mono">{u.locks}</td>
                                    <td className="px-3 py-2 text-xs font-mono">{u.orders}</td>
                                    <td className="px-3 py-2 text-xs font-mono">{u.aiCalls}</td>
                                    <td className="px-3 py-2">{u.sip ? <Badge text="SIP" color="#4ade80" /> : <span className="text-aureum-dim text-xs">—</span>}</td>
                                    <td className="px-3 py-2">{u.forgePass ? <Badge text="PASS" color="#D4A853" /> : <span className="text-aureum-dim text-xs">—</span>}</td>
                                    <td className="px-3 py-2 text-xs text-aureum-dim">{u.lastActive}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <Card gold>
                <h3 className="text-sm font-semibold text-gold mb-3">Auto-Tier Engine</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { tier: 'Free', range: '₹0', users: 3, perks: '3 AI designs/day, 24h locks', color: '#555' },
                        { tier: 'Gold', range: '₹10K+', users: 3, perks: '+10 designs/day, 48h locks', color: '#D4A853' },
                        { tier: 'Platinum', range: '₹50K+', users: 1, perks: 'Unlimited designs, 7d locks', color: '#c084fc' },
                        { tier: 'Diamond', range: '₹2L+', users: 1, perks: 'Everything + personal AI stylist', color: '#60a5fa' },
                    ].map(t => (
                        <div key={t.tier} className="p-3 bg-[#0a0a0a] rounded-lg" style={{ border: `1px solid ${t.color}33` }}>
                            <div className="text-sm font-bold" style={{ color: t.color }}>{t.tier}</div>
                            <div className="text-[11px] font-mono text-aureum-mid">{t.range} spent</div>
                            <div className="text-lg font-mono font-bold text-aureum-white my-1">{t.users}</div>
                            <div className="text-[10px] text-aureum-dim leading-relaxed">{t.perks}</div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )

    const renderRevenue = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Stat label="Total Revenue" value={`₹${(totalRev / 1000).toFixed(1)}K`} sub="This month" trend="+24%" accent />
                <Stat label="Jewelry Margin" value="₹54.3K" sub="15.5% avg" />
                <Stat label="Fee Revenue" value={`₹${((totalRev - 54300) / 1000).toFixed(1)}K`} sub="8 streams" trend="90%+ margin" />
                <Stat label="API Cost" value={`₹${totalCost}`} sub="5.7% of revenue" />
                <Stat label="Net Profit" value={`₹${((totalRev - totalCost) / 1000).toFixed(1)}K`} trend="+ve ✓" accent />
                <Stat label="Rev:Cost Ratio" value={`${(totalRev / totalCost).toFixed(1)}x`} sub="Excellent" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <h3 className="text-sm font-semibold text-aureum-white mb-3">Revenue Streams</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart><Pie data={REVENUE_STREAMS} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" stroke="none">{REVENUE_STREAMS.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: 6, fontSize: 11 }} formatter={(v: number | string | undefined) => `₹${typeof v === 'number' ? v.toLocaleString() : v}`} /></PieChart>
                        </ResponsiveContainer>
                    </div>
                    {REVENUE_STREAMS.map(r => (
                        <div key={r.name} className="flex justify-between items-center py-1 text-[11px]">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm" style={{ background: r.color }} /><span className="text-aureum-mid">{r.name}</span></div>
                            <div className="flex gap-3"><span className="font-mono text-gold">₹{r.value.toLocaleString()}</span><span className="font-mono text-aureum-dim w-8 text-right">{((r.value / totalRev) * 100).toFixed(0)}%</span></div>
                        </div>
                    ))}
                </Card>
                <Card>
                    <h3 className="text-sm font-semibold text-aureum-white mb-3">30-Day Revenue Trend</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyRev}>
                                <defs><linearGradient id="rG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D4A853" stopOpacity={0.2} /><stop offset="100%" stopColor="#D4A853" stopOpacity={0} /></linearGradient></defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                                <XAxis dataKey="d" tick={{ fill: '#333', fontSize: 9 }} axisLine={false} />
                                <YAxis tick={{ fill: '#333', fontSize: 9 }} axisLine={false} />
                                <Tooltip contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: 6, fontSize: 11 }} formatter={(v: number | string | undefined) => `₹${v}`} />
                                <Area type="monotone" dataKey="rev" stroke="#D4A853" fill="url(#rG)" strokeWidth={1.5} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-3 bg-[#111] rounded-md">
                        <div className="text-[11px] font-semibold text-aureum-white mb-2">Growth Projection</div>
                        <div className="grid grid-cols-4 gap-2 text-[10px]">
                            {[{ label: 'Month 3', gmv: '₹8.3L', users: '500' }, { label: 'Month 6', gmv: '₹40L', users: '2K' }, { label: 'Month 9', gmv: '₹1.2Cr', users: '5K' }, { label: 'Month 12', gmv: '₹2.6Cr', users: '10K' }].map(p => (
                                <div key={p.label}><div className="text-aureum-dim">{p.label}</div><div className="font-mono text-gold font-semibold">{p.gmv}</div><div className="text-aureum-dim">{p.users} users</div></div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )

    const renderSystem = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Stat label="System Status" value="Operational" trend="All green" accent />
                <Stat label="APIs Healthy" value={`${API_SERVICES.filter(a => a.status === 'healthy').length}/${API_SERVICES.length}`} />
                <Stat label="Total API Cost" value={`₹${totalCost.toLocaleString()}`} sub="This month" />
                <Stat label="Uptime" value="99.9%" sub="Last 30 days" />
            </div>
            <Card>
                <h3 className="text-sm font-semibold text-aureum-white mb-3">API Service Monitor</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b border-aureum-border">
                            {['Service', 'Status', 'Latency', 'Calls', 'Limit', 'Usage', 'Cost', 'Plan'].map(h => <th key={h} className="px-3 py-2 text-[9px] font-mono font-semibold text-aureum-dim uppercase tracking-wider">{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {API_SERVICES.map(api => {
                                const usage = api.limit && api.calls ? (api.calls / api.limit) * 100 : null
                                return (
                                    <tr key={api.name} className="border-b border-[#111] hover:bg-[#111] transition-colors">
                                        <td className="px-3 py-2 text-xs font-semibold"><span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: statusColor(api.status) }} />{api.name}</td>
                                        <td className="px-3 py-2"><Badge text={api.status.toUpperCase()} color={statusColor(api.status)} /></td>
                                        <td className="px-3 py-2 text-xs font-mono text-aureum-mid">{api.latency}</td>
                                        <td className="px-3 py-2 text-xs font-mono">{api.calls ?? '—'}</td>
                                        <td className="px-3 py-2 text-xs font-mono text-aureum-dim">{api.limit?.toLocaleString() ?? '∞'}</td>
                                        <td className="px-3 py-2">{usage !== null ? <div className="flex items-center gap-2"><div className="w-14 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.min(usage, 100)}%`, background: usage > 80 ? '#f87171' : usage > 60 ? '#fbbf24' : '#D4A853' }} /></div><span className="text-[10px] font-mono" style={{ color: usage > 80 ? '#f87171' : '#888' }}>{usage.toFixed(0)}%</span></div> : <span className="text-[10px] text-aureum-dim">—</span>}</td>
                                        <td className="px-3 py-2 text-xs font-mono" style={{ color: api.cost > 0 ? '#D4A853' : '#4ade80' }}>{api.cost > 0 ? `₹${api.cost}` : 'FREE'}</td>
                                        <td className="px-3 py-2 text-xs text-aureum-dim">{api.plan}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )

    const renderConfig = () => (
        <div className="space-y-4">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-aureum-white">Live API Credentials</h3>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSaveKeys}
                            className="px-3 py-1 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded text-[10px] text-gold font-mono flex items-center gap-1.5 transition-colors"
                        >
                            <Check size={12} />
                            Save All
                        </button>
                        <Badge text="LOCAL INJECTION" color="#60a5fa" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs text-aureum-dim block">Anthropic API Key (Claude - Chat & Vision)</label>
                            <button onClick={() => testKey('anthropic', anthropicKey)} disabled={testingKey === 'anthropic'} className="text-[10px] text-gold hover:text-white transition-colors disabled:opacity-50">{testingKey === 'anthropic' ? 'Testing...' : 'Test Connection'}</button>
                        </div>
                        <input
                            type="password"
                            value={anthropicKey}
                            onChange={e => setAnthropicKey(e.target.value)}
                            onBlur={() => {
                                localStorage.setItem('aureum_anthropic_key', anthropicKey)
                                alert('Anthropic API key saved.')
                            }}
                            placeholder="sk-ant-api03-..."
                            className="w-full px-3 py-2 bg-[#111] border border-aureum-border rounded-md text-xs font-mono text-aureum-white placeholder:text-aureum-dim focus:border-gold/50 focus:outline-none placeholder:opacity-40 transition-colors"
                        />
                        {testResults['anthropic'] && (
                            <div className={`text-[10px] mt-1.5 font-mono ${testResults['anthropic'].status === 'success' ? 'text-success' : 'text-error'}`}>
                                {testResults['anthropic'].status === 'success' ? '✅' : '❌'} {testResults['anthropic'].message}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs text-aureum-dim block">Replicate API Token (FLUX - Image Gen)</label>
                            <button onClick={() => testKey('replicate', replicateKey)} disabled={testingKey === 'replicate'} className="text-[10px] text-gold hover:text-white transition-colors disabled:opacity-50">{testingKey === 'replicate' ? 'Testing...' : 'Test Connection'}</button>
                        </div>
                        <input
                            type="password"
                            value={replicateKey}
                            onChange={e => setReplicateKey(e.target.value)}
                            onBlur={() => {
                                localStorage.setItem('aureum_replicate_key', replicateKey)
                                alert('Replicate API token saved.')
                            }}
                            placeholder="r8_..."
                            className="w-full px-3 py-2 bg-[#111] border border-aureum-border rounded-md text-xs font-mono text-aureum-white placeholder:text-aureum-dim focus:border-gold/50 focus:outline-none placeholder:opacity-40 transition-colors"
                        />
                        {testResults['replicate'] && (
                            <div className={`text-[10px] mt-1.5 font-mono ${testResults['replicate'].status === 'success' ? 'text-success' : 'text-error'}`}>
                                {testResults['replicate'].status === 'success' ? '✅' : '❌'} {testResults['replicate'].message}
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-aureum-dim block">Metals-API Key</label>
                                <button onClick={() => testKey('metals', metalsKey)} disabled={testingKey === 'metals'} className="text-[10px] text-gold hover:text-white disabled:opacity-50">{testingKey === 'metals' ? 'Testing...' : 'Test'}</button>
                            </div>
                            <input
                                type="password"
                                value={metalsKey}
                                onChange={e => setMetalsKey(e.target.value)}
                                onBlur={() => localStorage.setItem('aureum_metals_key', metalsKey)}
                                className="w-full px-3 py-2 bg-[#111] border border-aureum-border rounded-md text-xs font-mono text-aureum-white focus:border-gold/50 focus:outline-none"
                            />
                            {testResults['metals'] && (
                                <div className={`text-[9px] mt-1 font-mono ${testResults['metals'].status === 'success' ? 'text-success' : 'text-error'}`}>
                                    {testResults['metals'].message}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-aureum-dim block">GoldAPI.io Key</label>
                                <button onClick={() => testKey('goldapi', goldApiKey)} disabled={testingKey === 'goldapi'} className="text-[10px] text-gold hover:text-white disabled:opacity-50">{testingKey === 'goldapi' ? 'Testing...' : 'Test'}</button>
                            </div>
                            <input
                                type="password"
                                value={goldApiKey}
                                onChange={e => setGoldApiKey(e.target.value)}
                                onBlur={() => localStorage.setItem('aureum_gold_api_key', goldApiKey)}
                                className="w-full px-3 py-2 bg-[#111] border border-aureum-border rounded-md text-xs font-mono text-aureum-white focus:border-gold/50 focus:outline-none"
                            />
                            {testResults['goldapi'] && (
                                <div className={`text-[9px] mt-1 font-mono ${testResults['goldapi'].status === 'success' ? 'text-success' : 'text-error'}`}>
                                    {testResults['goldapi'].message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs text-aureum-dim block">Razorpay API Key (Live/Test ID)</label>
                            <button onClick={() => testKey('razorpay', razorpayKey)} disabled={testingKey === 'razorpay'} className="text-[10px] text-gold hover:text-white disabled:opacity-50">{testingKey === 'razorpay' ? 'Testing...' : 'Test'}</button>
                        </div>
                        <input
                            type="text"
                            value={razorpayKey}
                            onChange={e => setRazorpayKey(e.target.value)}
                            onBlur={() => localStorage.setItem('aureum_razorpay_key', razorpayKey)}
                            placeholder="rzp_live_..."
                            className="w-full px-3 py-2 bg-[#111] border border-aureum-border rounded-md text-xs font-mono text-aureum-white focus:border-gold/50 focus:outline-none"
                        />
                        {testResults['razorpay'] && (
                            <div className={`text-[9px] mt-1 font-mono ${testResults['razorpay'].status === 'success' ? 'text-success' : 'text-error'}`}>
                                {testResults['razorpay'].message}
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-aureum-dim block">Supabase Project URL</label>
                                <button onClick={() => testKey('supabaseUrl', supabaseUrl)} disabled={testingKey === 'supabaseUrl'} className="text-[10px] text-gold hover:text-white disabled:opacity-50">{testingKey === 'supabaseUrl' ? 'Testing...' : 'Test'}</button>
                            </div>
                            <input
                                type="text"
                                value={supabaseUrl}
                                onChange={e => setSupabaseUrl(e.target.value)}
                                onBlur={() => localStorage.setItem('aureum_supabase_url', supabaseUrl)}
                                placeholder="https://xxx.supabase.co"
                                className="w-full px-3 py-2 bg-[#111] border border-aureum-border rounded-md text-xs font-mono text-aureum-white focus:border-gold/50 focus:outline-none"
                            />
                            {testResults['supabaseUrl'] && (
                                <div className={`text-[9px] mt-1 font-mono ${testResults['supabaseUrl'].status === 'success' ? 'text-success' : 'text-error'}`}>
                                    {testResults['supabaseUrl'].message}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-aureum-dim block">Supabase Anon Key</label>
                                <button onClick={() => testKey('supabaseKey', supabaseAnonKey)} disabled={testingKey === 'supabaseKey'} className="text-[10px] text-gold hover:text-white disabled:opacity-50">{testingKey === 'supabaseKey' ? 'Testing...' : 'Test'}</button>
                            </div>
                            <input
                                type="password"
                                value={supabaseAnonKey}
                                onChange={e => setSupabaseAnonKey(e.target.value)}
                                onBlur={() => localStorage.setItem('aureum_supabase_anon_key', supabaseAnonKey)}
                                className="w-full px-3 py-2 bg-[#111] border border-aureum-border rounded-md text-xs font-mono text-aureum-white focus:border-gold/50 focus:outline-none"
                            />
                            {testResults['supabaseKey'] && (
                                <div className={`text-[9px] mt-1 font-mono ${testResults['supabaseKey'].status === 'success' ? 'text-success' : 'text-error'}`}>
                                    {testResults['supabaseKey'].message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-aureum-dim block">Upstash Redis REST URL</label>
                                <button onClick={() => testKey('upstashUrl', upstashUrl)} disabled={testingKey === 'upstashUrl'} className="text-[10px] text-gold hover:text-white disabled:opacity-50">{testingKey === 'upstashUrl' ? 'Testing...' : 'Test'}</button>
                            </div>
                            <input
                                type="text"
                                value={upstashUrl}
                                onChange={e => setUpstashUrl(e.target.value)}
                                onBlur={() => localStorage.setItem('aureum_upstash_url', upstashUrl)}
                                className="w-full px-3 py-2 bg-[#111] border border-aureum-border rounded-md text-xs font-mono text-aureum-white focus:border-gold/50 focus:outline-none"
                            />
                            {testResults['upstashUrl'] && (
                                <div className={`text-[9px] mt-1 font-mono ${testResults['upstashUrl'].status === 'success' ? 'text-success' : 'text-error'}`}>
                                    {testResults['upstashUrl'].message}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-aureum-dim block">Upstash Redis REST Token</label>
                                <button onClick={() => testKey('upstashKey', upstashToken)} disabled={testingKey === 'upstashKey'} className="text-[10px] text-gold hover:text-white disabled:opacity-50">{testingKey === 'upstashKey' ? 'Testing...' : 'Test'}</button>
                            </div>
                            <input
                                type="password"
                                value={upstashToken}
                                onChange={e => setUpstashToken(e.target.value)}
                                onBlur={() => localStorage.setItem('aureum_upstash_token', upstashToken)}
                                className="w-full px-3 py-2 bg-[#111] border border-aureum-border rounded-md text-xs font-mono text-aureum-white focus:border-gold/50 focus:outline-none"
                            />
                            {testResults['upstashKey'] && (
                                <div className={`text-[9px] mt-1 font-mono ${testResults['upstashKey'].status === 'success' ? 'text-success' : 'text-error'}`}>
                                    {testResults['upstashKey'].message}
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-[10px] text-aureum-dim flex items-start gap-1.5 mt-2">
                        <AlertTriangle size={12} className="shrink-0 mt-0.5 text-warning" />
                        Credentials saved here are stored in your browser's localStorage and injected into API requests. This allows you to test live integrations immediately.
                    </p>
                </div>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold text-aureum-white mb-3">Feature Toggles <span className="text-[10px] text-aureum-dim font-normal ml-2">{activeFeatures} active · {features.length - activeFeatures} disabled</span></h3>
                {['core', 'ai', 'finance', 'monetization', 'premium'].map(cat => (
                    <div key={cat} className="mb-4">
                        <div className="text-[10px] text-gold uppercase tracking-widest font-mono mb-2">{cat}</div>
                        {features.filter(f => f.category === cat).map(f => (
                            <div key={f.id} className="flex items-center gap-3 p-2.5 mb-1 bg-[#111] rounded-md" style={{ borderLeft: `3px solid ${f.status ? '#4ade80' : '#333'}` }}>
                                <button onClick={() => toggleFeature(f.id)} className={`w-9 h-5 rounded-full relative flex-shrink-0 transition-colors ${f.status ? 'bg-gold' : 'bg-[#333]'}`}>
                                    <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-all ${f.status ? 'left-[18px]' : 'left-[3px]'}`} />
                                </button>
                                <div className="flex-1 min-w-0">
                                    <div className={`text-xs font-semibold ${f.status ? 'text-aureum-white' : 'text-aureum-dim'}`}>{f.name}</div>
                                    <div className="text-[10px] text-aureum-dim">{f.desc}</div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-[10px] font-mono text-aureum-mid">{f.api}</div>
                                    <div className={`text-[10px] font-mono ${f.cost.startsWith('Revenue') ? 'text-success' : 'text-gold'}`}>{f.cost}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </Card>
            <Card gold>
                <h3 className="text-sm font-semibold text-gold mb-3">Pricing Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="text-[11px] text-gold font-semibold mb-2">Lock Premiums</div>
                        {[{ dur: '24h', pct: '0.5%' }, { dur: '48h', pct: '1.0%' }, { dur: '7d', pct: '2.0%' }].map(l => (
                            <div key={l.dur} className="flex justify-between py-1.5 border-b border-[#1a1a1a] text-xs"><span className="text-aureum-white">{l.dur} lock</span><span className="font-mono text-gold">{l.pct}</span></div>
                        ))}
                        <div className="text-[11px] text-gold font-semibold mt-3 mb-2">Making Charges</div>
                        <div className="flex justify-between py-1.5 border-b border-[#1a1a1a] text-xs"><span className="text-aureum-white">Per gram</span><span className="font-mono text-gold">₹500</span></div>
                        <div className="flex justify-between py-1.5 text-xs"><span className="text-aureum-white">Rush multiplier</span><span className="font-mono text-gold">1.25x</span></div>
                    </div>
                    <div>
                        <div className="text-[11px] text-gold font-semibold mb-2">Monetization Pricing</div>
                        {[
                            { label: 'AI Design — Free/day', value: '3' },
                            { label: 'AI Design — 5 pack', value: '₹99' },
                            { label: 'Forge Pass', value: '₹299/mo' },
                            { label: 'Certificate Fee', value: '₹199' },
                            { label: 'SIP Mgmt Fee', value: '1% AUM/yr' },
                            { label: 'Target Margin', value: '18%' },
                        ].map(p => (
                            <div key={p.label} className="flex justify-between py-1 border-b border-[#1a1a1a] text-[11px]"><span className="text-aureum-mid">{p.label}</span><span className="font-mono text-gold">{p.value}</span></div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    )

    const sections: Record<Nav, () => React.ReactNode> = {
        mission: renderMission,
        gold: renderGold,
        orders: renderOrders,
        sip: renderSip,
        ai: renderAI,
        users: renderUsers,
        revenue: renderRevenue,
        system: renderSystem,
        config: renderConfig
    }

    return (
        <div className="flex min-h-screen bg-[#080808] text-aureum-white font-body">
            {/* SIDEBAR */}
            <div className={`${collapsed ? 'w-14' : 'w-48'} bg-[#0a0a0a] border-r border-aureum-border flex flex-col shrink-0 transition-all duration-200 overflow-hidden sticky top-0 h-screen`}>
                <div className={`${collapsed ? 'px-2 py-4' : 'px-5 py-4'} border-b border-aureum-border flex items-center gap-2 cursor-pointer`} onClick={() => setCollapsed(!collapsed)}>
                    <span className="text-lg text-gold font-heading font-extrabold">A</span>
                    {!collapsed && <span className="text-sm text-gold font-heading font-extrabold tracking-widest">AUREUM</span>}
                </div>
                <div className={`${collapsed ? 'px-1 py-2' : 'px-4 py-2'} border-b border-aureum-border text-center`}>
                    <div className={`${collapsed ? 'text-[10px]' : 'text-base'} font-mono font-bold text-gold`}>₹{goldPrice.toFixed(0)}</div>
                    {!collapsed && <div className="text-[10px] font-mono" style={{ color: goldDelta >= 0 ? '#4ade80' : '#f87171' }}>{goldDelta >= 0 ? '▲' : '▼'}{Math.abs(goldDelta).toFixed(2)}% <span style={{ color: sessionClr }}>● {session}</span></div>}
                </div>
                <div className="flex-1 py-2">
                    {NAV_ITEMS.map(item => (
                        <div key={item.id} onClick={() => setNav(item.id)} className={`flex items-center gap-2.5 ${collapsed ? 'px-0 justify-center' : 'px-5'} py-2.5 cursor-pointer transition-all text-sm ${nav === item.id ? 'text-gold' : 'text-aureum-dim hover:text-aureum-mid'}`} style={{ borderLeft: collapsed ? 'none' : nav === item.id ? '3px solid #D4A853' : '3px solid transparent', background: nav === item.id ? '#D4A85315' : 'transparent' }}>
                            <span className="text-sm w-5 text-center">{item.icon}</span>
                            {!collapsed && <span className={`whitespace-nowrap ${nav === item.id ? 'font-semibold' : ''}`}>{item.label}</span>}
                            {!collapsed && item.id === 'system' && unresolvedAlerts > 0 && <span className="ml-auto text-[9px] font-mono font-bold bg-error text-white px-1.5 py-0.5 rounded-full">{unresolvedAlerts}</span>}
                        </div>
                    ))}
                </div>
                {!collapsed && (
                    <div className="px-4 py-3 border-t border-aureum-border text-[9px] text-aureum-dim">
                        <div>{time.toLocaleTimeString()}</div>
                        <div>{time.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    </div>
                )}
            </div>

            {/* MAIN */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="px-6 py-2.5 border-b border-aureum-border bg-[#0a0a0a] flex justify-between items-center shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-aureum-white">{NAV_ITEMS.find(n => n.id === nav)?.label}</span>
                        <Badge text="LIVE" color="#4ade80" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-2.5 py-1 bg-[#111] rounded-md text-[11px] font-mono">
                            <span className="text-aureum-mid">XAU </span>
                            <span className="text-gold font-semibold">₹{goldPrice.toFixed(0)}</span>
                            <span className={`ml-1.5 ${goldDelta >= 0 ? 'text-success' : 'text-error'}`}>{goldDelta >= 0 ? '▲' : '▼'}{Math.abs(goldDelta).toFixed(2)}%</span>
                        </div>
                        {unresolvedAlerts > 0 && <button onClick={() => setNav('system')} className="px-2.5 py-1 bg-error/10 border border-error/30 rounded-md text-[11px] font-mono text-error">{unresolvedAlerts} alert{unresolvedAlerts > 1 ? 's' : ''}</button>}
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-[1100px] mx-auto">
                        {sections[nav]?.()}
                    </div>
                </div>
            </div>
        </div>
    )
}
