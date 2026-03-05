export type EventAction =
    | 'forge_generate'
    | 'forge_upload'
    | 'concierge_chat'
    | 'collection_view'
    | 'product_view'
    | 'price_lock'
    | 'buy_now'
    | 'page_view';

export interface TrackingEvent {
    id: string;
    timestamp: string;
    action: EventAction;
    metadata?: Record<string, any>;
}

export function trackEvent(action: EventAction, metadata?: Record<string, any>) {
    if (typeof window === 'undefined') return;

    try {
        const events: TrackingEvent[] = JSON.parse(localStorage.getItem('aureum_events') || '[]');

        const newEvent: TrackingEvent = {
            id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            action,
            metadata: metadata || {}
        };

        events.unshift(newEvent);

        // Keep last 500 events to prevent localStorage overflow
        const trimmedEvents = events.slice(0, 500);

        localStorage.setItem('aureum_events', JSON.stringify(trimmedEvents));
        console.log(`[AUREUM TRACK] ${action}`, metadata);

        // Async sync to Agent Backend for real-time processing (Options 2B, 2C)
        fetch('/api/agent/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent)
        }).catch(e => console.error('Agent sync failed', e));

    } catch (e) {
        console.error('Failed to track event:', e);
    }
}
