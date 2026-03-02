// POST /api/payments/verify — Verify Razorpay payment signature
import { NextResponse } from 'next/server'
import { verifyPaymentSignature } from '@/lib/razorpay'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

        const isValid = verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        )

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
        }

        // TODO: Update order in Supabase to status: 'confirmed', payment_status: 'paid'

        return NextResponse.json({
            success: true,
            payment_id: razorpay_payment_id,
            message: 'Payment verified successfully',
        })
    } catch (error) {
        console.error('Payment verification error:', error)
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
    }
}
