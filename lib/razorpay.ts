// Razorpay server-side client
import Razorpay from 'razorpay'
import crypto from 'crypto'

let client: InstanceType<typeof Razorpay> | null = null

export function getRazorpayClient(): InstanceType<typeof Razorpay> | null {
    if (client) return client
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keyId || !keySecret) return null
    client = new Razorpay({ key_id: keyId, key_secret: keySecret })
    return client
}

/**
 * Verify Razorpay payment signature
 */
export function verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) return false

    const body = `${orderId}|${paymentId}`
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex')

    return expectedSignature === signature
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(body: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!secret) return false

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex')

    return expectedSignature === signature
}
