'use client'

import { useState, useRef, useCallback, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { useGoldPrice } from '@/hooks/useGoldPrice'
import { calculatePrice, formatINR, metalLabel, karatLabel } from '@/lib/utils'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Upload, Wand2, Sparkles, Loader2, Image as ImageIcon, X, Lock, ShoppingBag, ChevronRight, Instagram } from 'lucide-react'
import type { VisionAnalysis, Karat, MetalType } from '@/lib/types'

type Stage = 'upload' | 'analyzing' | 'analysis' | 'generating' | 'results' | 'editing'

function ForgeStudioContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { price } = useGoldPrice()
    const fileRef = useRef<HTMLInputElement>(null)
    const [stage, setStage] = useState<Stage>('upload')
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [analysis, setAnalysis] = useState<VisionAnalysis | null>(null)
    const [generatedImages, setGeneratedImages] = useState<string[]>([])
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [prompt, setPrompt] = useState('')
    const [metal, setMetal] = useState<MetalType>('gold')
    const [karat, setKarat] = useState<Karat>(22)
    const [weight, setWeight] = useState(8)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const initPrompt = searchParams.get('prompt')
        if (initPrompt && stage === 'upload') {
            const parsedWeight = parseFloat(searchParams.get('weight') || '8')
            const parsedKarat = searchParams.get('karat') || '22'
            const parsedMetal = (searchParams.get('metal') as MetalType) || 'gold'
            setPrompt(initPrompt)
            setMetal(parsedMetal)
            setKarat(parseInt(parsedKarat) as Karat)
            setWeight(parsedWeight)
            setAnalysis({
                type: searchParams.get('category') || 'jewelry',
                metal: parsedMetal,
                style: 'custom',
                motifs: ['customized'],
                estimated_weight_grams: parsedWeight,
                suggested_karat: parsedKarat,
                complexity: 'moderate',
                occasions: ['all'],
                description: initPrompt
            })
            setStage('analysis')
        }
    }, [searchParams, stage])

    const handleUpload = useCallback(async (file: File) => {
        setError(null)
        const reader = new FileReader()
        reader.onload = async (e) => {
            const dataUrl = e.target?.result as string
            setUploadedImage(dataUrl)
            setStage('analyzing')

            try {
                const base64 = dataUrl.split(',')[1]
                const mediaType = file.type || 'image/jpeg'
                const res = await fetch('/api/vision', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-anthropic-key': localStorage.getItem('aureum_anthropic_key') || ''
                    },
                    body: JSON.stringify({ imageBase64: base64, mediaType }),
                })

                if (!res.ok) throw new Error('Analysis failed')
                const data: VisionAnalysis = await res.json()
                setAnalysis(data)
                setPrompt(data.description)
                setMetal(data.metal || 'gold')
                setKarat(parseInt(data.suggested_karat || '22') as Karat)
                setWeight(data.estimated_weight_grams || 8)
                setStage('analysis')
            } catch {
                // Simulate analysis for demo
                const simAnalysis: VisionAnalysis = {
                    type: 'ring',
                    metal: 'gold',
                    style: 'modern',
                    motifs: ['geometric', 'minimalist'],
                    estimated_weight_grams: 6,
                    suggested_karat: '22',
                    complexity: 'moderate',
                    occasions: ['daily', 'office'],
                    description: 'Elegant modern gold ring with geometric patterns and clean lines, suitable for daily wear',
                }
                setAnalysis(simAnalysis)
                setPrompt(simAnalysis.description)
                setWeight(simAnalysis.estimated_weight_grams)
                setStage('analysis')
            }
        }
        reader.readAsDataURL(file)
    }, [])

    const handleGenerate = useCallback(async () => {
        setStage('generating')
        setError(null)

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-replicate-key': localStorage.getItem('aureum_replicate_key') || ''
                },
                body: JSON.stringify({ prompt, metal, karat, category: analysis?.type || 'jewelry' }),
            })

            if (!res.ok) throw new Error('Generation failed')
            const data = await res.json()
            const images = data.images || []
            setGeneratedImages(images)

            // Track generated design
            const newDesign = {
                id: `DSGN-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                prompt: prompt || analysis?.description || 'Custom Jewelry Design',
                image: images[0],
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }
            const existingDesigns = JSON.parse(localStorage.getItem('aureum_designs') || '[]')
            localStorage.setItem('aureum_designs', JSON.stringify([newDesign, ...existingDesigns]))

            setStage('results')
        } catch {
            // Placeholder images for demo
            const demoImages = [
                'https://placehold.co/512x512/111111/D4A853?text=Design+1',
                'https://placehold.co/512x512/111111/D4A853?text=Design+2',
                'https://placehold.co/512x512/111111/D4A853?text=Design+3',
                'https://placehold.co/512x512/111111/D4A853?text=Design+4',
            ]
            setGeneratedImages(demoImages)

            // Track generated design
            const newDesign = {
                id: `DSGN-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                prompt: prompt || analysis?.description || 'Custom Jewelry Design',
                image: demoImages[0],
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }
            const existingDesigns = JSON.parse(localStorage.getItem('aureum_designs') || '[]')
            localStorage.setItem('aureum_designs', JSON.stringify([newDesign, ...existingDesigns]))

            setStage('results')
        }
    }, [prompt, metal, karat, analysis])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) handleUpload(file)
    }, [handleUpload])

    const priceBreakdown = price ? calculatePrice(price.gold_24k_gram, weight, karat) : null

    return (
        <>
            <Header />
            <main className="flex-1 pb-20 md:pb-0">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-aureum-white">
                            <span className="text-gold">Forge</span> AI Studio
                        </h1>
                        <p className="mt-2 text-sm text-aureum-mid">
                            Upload any inspiration → AI analyzes it → Generate custom designs → Buy
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-2 mb-10">
                        {['Upload', 'Analyze', 'Generate', 'Edit'].map((step, i) => {
                            const stages: Stage[][] = [['upload'], ['analyzing', 'analysis'], ['generating', 'results'], ['editing']]
                            const isActive = stages[i].includes(stage)
                            const isPast = i < stages.findIndex(s => s.includes(stage))
                            return (
                                <div key={step} className="flex items-center gap-2">
                                    <div className={`text-xs font-mono px-3 py-1 rounded-full transition-colors ${isActive ? 'bg-gold text-aureum-black font-bold' :
                                        isPast ? 'bg-gold/20 text-gold' :
                                            'bg-aureum-card text-aureum-dim border border-aureum-border'
                                        }`}>
                                        {step}
                                    </div>
                                    {i < 3 && <ChevronRight size={12} className="text-aureum-dim" />}
                                </div>
                            )
                        })}
                    </div>

                    <AnimatePresence mode="wait">
                        {/* ═══ UPLOAD STAGE ═══ */}
                        {stage === 'upload' && (
                            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={e => e.preventDefault()}
                                    onClick={() => fileRef.current?.click()}
                                    className="border-2 border-dashed border-aureum-border hover:border-gold/40 rounded-2xl p-16 text-center cursor-pointer transition-colors group"
                                >
                                    <Upload size={48} className="mx-auto text-aureum-dim group-hover:text-gold transition-colors mb-4" />
                                    <h3 className="text-lg font-semibold text-aureum-white mb-2">Drop your inspiration image</h3>
                                    <p className="text-sm text-aureum-dim mb-6">
                                        A Pinterest pin, wedding photo, sketch — anything with jewelry
                                    </p>
                                    <button className="btn-gold px-6 py-2.5 rounded-lg text-sm">
                                        Choose File
                                    </button>
                                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                                </div>

                                {/* Instagram Connect */}
                                <div className="mt-6 mb-8 text-center">
                                    <button onClick={() => { alert('Instagram API integration placeholder. Would trigger OAuth flow.') }} className="px-6 py-2.5 rounded-lg text-sm border border-[#E1306C]/50 hover:border-[#E1306C] bg-gradient-to-r hover:from-[#f09433]/10 hover:via-[#e6683c]/10 hover:to-[#bc1888]/10 text-aureum-white transition-all flex items-center gap-2 mx-auto justify-center group">
                                        <Instagram size={16} className="text-[#E1306C] group-hover:scale-110 transition-transform" />
                                        Connect Instagram to Select Photo
                                    </button>
                                </div>

                                {/* Or text prompt */}
                                <div className="mt-8 text-center border-t border-aureum-border pt-8 max-w-xl mx-auto">
                                    <p className="text-xs text-aureum-dim mb-3">Or simply describe the design you want to generate:</p>
                                    <div className="flex items-center gap-3 max-w-lg mx-auto">
                                        <input
                                            type="text"
                                            placeholder="A minimalist 18K gold ring with wave pattern..."
                                            value={prompt}
                                            onChange={e => setPrompt(e.target.value)}
                                            className="flex-1 px-4 py-3 bg-aureum-card border border-aureum-border rounded-lg text-sm text-aureum-white placeholder:text-aureum-dim focus:outline-none focus:border-gold/40"
                                        />
                                        <button
                                            onClick={() => { if (prompt) { setStage('generating'); handleGenerate() } }}
                                            disabled={!prompt}
                                            className="btn-gold px-6 py-3 rounded-lg text-sm disabled:opacity-40 flex items-center gap-2"
                                        >
                                            <Wand2 size={14} /> Generate
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ ANALYZING ═══ */}
                        {stage === 'analyzing' && (
                            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
                                <Loader2 size={48} className="mx-auto text-gold animate-spin mb-4" />
                                <h3 className="text-lg font-semibold text-aureum-white mb-2">Analyzing with Claude Vision...</h3>
                                <p className="text-sm text-aureum-dim">Identifying metal, style, weight, motifs</p>
                            </motion.div>
                        )}

                        {/* ═══ ANALYSIS RESULTS ═══ */}
                        {stage === 'analysis' && analysis && (
                            <motion.div key="analysis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Uploaded image */}
                                    <div className="rounded-xl overflow-hidden border border-aureum-border">
                                        {uploadedImage && (
                                            <img src={uploadedImage} alt="Uploaded" className="w-full aspect-square object-cover" />
                                        )}
                                    </div>

                                    {/* Analysis details */}
                                    <div className="p-6 bg-aureum-card rounded-xl border border-aureum-border">
                                        <h3 className="text-lg font-heading font-bold text-gold mb-4">AI Analysis</h3>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Type', value: analysis.type },
                                                { label: 'Metal', value: metalLabel(analysis.metal) },
                                                { label: 'Style', value: analysis.style },
                                                { label: 'Complexity', value: analysis.complexity },
                                                { label: 'Est. Weight', value: `${analysis.estimated_weight_grams}g` },
                                                { label: 'Suggested', value: `${analysis.suggested_karat}K` },
                                            ].map(item => (
                                                <div key={item.label} className="flex justify-between text-sm">
                                                    <span className="text-aureum-dim">{item.label}</span>
                                                    <span className="text-aureum-white font-medium capitalize">{item.value}</span>
                                                </div>
                                            ))}
                                            <div className="pt-2">
                                                <span className="text-xs text-aureum-dim">Motifs</span>
                                                <div className="flex flex-wrap gap-1.5 mt-1">
                                                    {analysis.motifs.map(m => (
                                                        <span key={m} className="text-[10px] font-mono px-2 py-0.5 bg-gold/10 text-gold rounded">{m}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Editable prompt */}
                                        <div className="mt-6">
                                            <label className="text-xs text-aureum-dim mb-2 block">Design Prompt</label>
                                            <textarea
                                                value={prompt}
                                                onChange={e => setPrompt(e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 bg-aureum-dark border border-aureum-border rounded-lg text-sm text-aureum-white focus:outline-none focus:border-gold/40 resize-none"
                                            />
                                        </div>

                                        <button
                                            onClick={handleGenerate}
                                            className="btn-gold w-full py-3 rounded-lg text-sm mt-4 flex items-center justify-center gap-2"
                                        >
                                            <Sparkles size={16} /> Generate 4 Designs
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ GENERATING ═══ */}
                        {stage === 'generating' && (
                            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="aspect-square bg-aureum-card rounded-xl border border-aureum-border animate-pulse flex items-center justify-center">
                                            <div className="text-center">
                                                <Loader2 size={24} className="mx-auto text-gold animate-spin mb-2" />
                                                <span className="text-[10px] font-mono text-aureum-dim">Variation {i}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-center text-sm text-aureum-dim mt-6">Generating with FLUX... ~20 seconds</p>
                            </motion.div>
                        )}

                        {/* ═══ RESULTS ═══ */}
                        {stage === 'results' && (
                            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
                                    {generatedImages.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setSelectedImage(img); setStage('editing') }}
                                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-gold' : 'border-aureum-border hover:border-gold/40'
                                                }`}
                                        >
                                            <img src={img} alt={`Design ${i + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-center text-sm text-aureum-dim mt-4">Click a design to customize and price it</p>
                            </motion.div>
                        )}

                        {/* ═══ EDITING ═══ */}
                        {stage === 'editing' && selectedImage && (
                            <motion.div key="editing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="rounded-xl overflow-hidden border border-gold/30">
                                        <img src={selectedImage} alt="Selected design" className="w-full aspect-square object-cover" />
                                    </div>

                                    <div className="p-6 bg-aureum-card rounded-xl border border-aureum-border">
                                        <h3 className="text-lg font-heading font-bold text-gold mb-4">Customize</h3>

                                        {/* Metal */}
                                        <div className="mb-4">
                                            <label className="text-xs text-aureum-dim uppercase tracking-wider mb-2 block">Metal</label>
                                            <div className="flex gap-2">
                                                {(['gold', 'rose_gold', 'silver', 'platinum'] as MetalType[]).map(m => (
                                                    <button
                                                        key={m}
                                                        onClick={() => setMetal(m)}
                                                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${metal === m ? 'bg-gold text-aureum-black' : 'bg-aureum-dark text-aureum-mid border border-aureum-border hover:border-gold/30'
                                                            }`}
                                                    >
                                                        {metalLabel(m)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Karat */}
                                        <div className="mb-4">
                                            <label className="text-xs text-aureum-dim uppercase tracking-wider mb-2 block">Karat</label>
                                            <div className="flex gap-2">
                                                {([14, 18, 22] as Karat[]).map(k => (
                                                    <button
                                                        key={k}
                                                        onClick={() => setKarat(k)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-all ${karat === k ? 'bg-gold text-aureum-black' : 'bg-aureum-dark text-aureum-mid border border-aureum-border hover:border-gold/30'
                                                            }`}
                                                    >
                                                        {k}K
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Weight */}
                                        <div className="mb-6">
                                            <label className="text-xs text-aureum-dim uppercase tracking-wider mb-2 block">
                                                Weight: {weight}g
                                            </label>
                                            <input
                                                type="range"
                                                min={2}
                                                max={30}
                                                step={0.5}
                                                value={weight}
                                                onChange={e => setWeight(parseFloat(e.target.value))}
                                                className="w-full accent-gold"
                                            />
                                        </div>

                                        {/* Price */}
                                        <div className="p-4 bg-aureum-dark rounded-xl border border-aureum-border">
                                            <div className="flex justify-between text-xs text-aureum-dim mb-2">
                                                <span>Estimated Total</span>
                                                <span>{price?.isLive ? 'LIVE' : 'SIM'}</span>
                                            </div>
                                            <div className="text-2xl font-mono font-bold text-gold">
                                                {priceBreakdown ? formatINR(priceBreakdown.total) : '...'}
                                            </div>
                                            <div className="text-xs text-aureum-dim mt-1">
                                                Gold: {priceBreakdown ? formatINR(priceBreakdown.goldCost) : '...'} + Making: {priceBreakdown ? formatINR(priceBreakdown.makingCharges) : '...'} + GST
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-4 space-y-2">
                                            <button onClick={() => router.push(`/checkout?mode=buy&name=${encodeURIComponent((prompt || analysis?.type || 'Custom Design').substring(0, 30))}&weight=${weight}&karat=${karat}&price=${priceBreakdown?.total || 0}`)} className="btn-gold w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2">
                                                <ShoppingBag size={16} /> Buy Now
                                            </button>
                                            <button onClick={() => router.push(`/checkout?mode=lock&name=${encodeURIComponent((prompt || analysis?.type || 'Custom Design').substring(0, 30))}&weight=${weight}&karat=${karat}&price=${priceBreakdown?.total || 0}`)} className="btn-outline-gold w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2">
                                                <Lock size={16} /> Lock This Price
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => setStage('results')}
                                            className="mt-3 text-xs text-aureum-dim hover:text-gold transition-colors w-full text-center"
                                        >
                                            ← Back to all designs
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Reset */}
                    {stage !== 'upload' && (
                        <button
                            onClick={() => {
                                setStage('upload')
                                setUploadedImage(null)
                                setAnalysis(null)
                                setGeneratedImages([])
                                setSelectedImage(null)
                                setPrompt('')
                                setError(null)
                            }}
                            className="mt-8 text-xs text-aureum-dim hover:text-gold transition-colors flex items-center gap-1 mx-auto"
                        >
                            <X size={12} /> Start Over
                        </button>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}

export default function ForgePage() {
    return (
        <Suspense fallback={
            <>
                <Header />
                <main className="flex-1 flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-gold" size={32} /></main>
                <Footer />
            </>
        }>
            <ForgeStudioContent />
        </Suspense>
    )
}
