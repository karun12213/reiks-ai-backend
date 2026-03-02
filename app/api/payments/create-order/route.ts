// POST /api/payments/create-order — Create Razorpay order
import { NextResponse } from 'next/server'
import { getRazorpayClient } from '@/lib/razorpay'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const { amount, productName, orderId } = await req.json()
        const razorpay = getRazorpayClient()

        if (!razorpay) {
            return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 503 })
        }

        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // paise
            currency: 'INR',
            receipt: orderId || `aureum_${Date.now()}`,
            notes: {
                product: productName || 'AUREUM Jewelry',
                platform: 'aureum',
            },
        })

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        })
    } catch (error) {
        console.error('Payment creation error:', error)
        return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
    }
}
