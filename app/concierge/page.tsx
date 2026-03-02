'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Send, Sparkles, Loader2, Bot, User, Trash2 } from 'lucide-react'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
}

const QUICK_ACTIONS = [
    '💍 Show rings under ₹30K',
    '🔗 Best chains for men',
    '🎁 Gift ideas for Diwali',
    '📈 Should I lock gold now?',
    '✨ What\'s Forge AI?',
    '💎 Explain karats',
]

export default function ConciergePage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Welcome to AUREUM. I\'m your personal gold jewelry concierge — powered by AI but trained in tradition.\n\nI can help you find the perfect piece, calculate prices in real-time, design custom jewelry with AI, or explain when to lock the best gold prices.\n\nWhat can I help you with today?',
        },
    ])
    const [input, setInput] = useState('')
    const [streaming, setStreaming] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [])

    useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || streaming) return

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
        const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: '' }

        setMessages(prev => [...prev, userMsg, assistantMsg])
        setInput('')
        setStreaming(true)

        try {
            const chatMessages = [...messages.filter(m => m.id !== 'welcome'), userMsg]
                .map(m => ({ role: m.role, content: m.content }))

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: chatMessages }),
            })

            if (!res.ok) throw new Error('Chat failed')

            const reader = res.body?.getReader()
            const decoder = new TextDecoder()

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    const text = decoder.decode(value)
                    const lines = text.split('\n').filter(l => l.startsWith('data: '))

                    for (const line of lines) {
                        const data = line.slice(6)
                        if (data === '[DONE]') break

                        try {
                            const parsed = JSON.parse(data)
                            if (parsed.text) {
                                setMessages(prev => {
                                    const updated = [...prev]
                                    const last = updated[updated.length - 1]
                                    if (last.role === 'assistant') {
                                        last.content += parsed.text
                                    }
                                    return [...updated]
                                })
                            }
                        } catch { }
                    }
                }
            }
        } catch {
            // Fallback response
            setMessages(prev => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                if (last.role === 'assistant' && !last.content) {
                    last.content = 'I apologize, but I\'m having trouble connecting right now. Please ensure the Anthropic API key is configured in your environment, or try again in a moment.\n\nIn the meantime, feel free to browse our [Collection](/collection) or try the [AI Design Studio](/forge).'
                }
                return [...updated]
            })
        }

        setStreaming(false)
    }, [streaming, messages])

    return (
        <>
            <Header />
            <main className="flex-1 flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)] pb-14 md:pb-0">
                <div className="max-w-3xl mx-auto w-full flex flex-col flex-1 px-4">
                    {/* Header */}
                    <div className="flex items-center justify-between py-4 border-b border-aureum-border">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center">
                                <Sparkles size={16} className="text-gold" />
                            </div>
                            <div>
                                <h1 className="text-sm font-semibold text-aureum-white">AUREUM Concierge</h1>
                                <span className="text-[10px] text-aureum-dim font-mono">Claude Haiku · Live Gold Data</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setMessages([messages[0]])}
                            className="p-2 text-aureum-dim hover:text-gold transition-colors"
                            title="Clear chat"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
                        {messages.map(msg => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-gold/10' : 'bg-aureum-card'
                                    }`}>
                                    {msg.role === 'assistant' ? <Bot size={13} className="text-gold" /> : <User size={13} className="text-aureum-mid" />}
                                </div>
                                <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-gold/10 text-aureum-white border border-gold/20'
                                        : 'bg-aureum-card text-aureum-light border border-aureum-border'
                                    }`}>
                                    {msg.content || (
                                        <span className="flex items-center gap-2 text-aureum-dim">
                                            <Loader2 size={12} className="animate-spin" /> Thinking...
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    {messages.length <= 2 && (
                        <div className="flex flex-wrap gap-2 pb-3">
                            {QUICK_ACTIONS.map(action => (
                                <button
                                    key={action}
                                    onClick={() => sendMessage(action)}
                                    className="text-xs px-3 py-1.5 bg-aureum-card border border-aureum-border rounded-lg text-aureum-mid hover:text-gold hover:border-gold/30 transition-colors"
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="py-3 border-t border-aureum-border">
                        <form
                            onSubmit={e => { e.preventDefault(); sendMessage(input) }}
                            className="flex items-center gap-2"
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Ask about jewelry, prices, designs..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                disabled={streaming}
                                className="flex-1 px-4 py-3 bg-aureum-card border border-aureum-border rounded-lg text-sm text-aureum-white placeholder:text-aureum-dim focus:outline-none focus:border-gold/40 disabled:opacity-50 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={streaming || !input.trim()}
                                className="btn-gold p-3 rounded-lg disabled:opacity-40 transition-all"
                            >
                                {streaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}
