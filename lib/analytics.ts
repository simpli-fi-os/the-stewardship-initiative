// Client-side analytics helper
export type EventType = 'page_view' | 'search' | 'filter' | 'contact_click' | 'profile_view' | 'request_service'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = sessionStorage.getItem('tsi_session_id')
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem('tsi_session_id', id)
  }
  return id
}

export async function trackEvent(
  orgId: string,
  eventType: EventType,
  metadata?: Record<string, unknown>,
  memberId?: string
): Promise<void> {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        org_id: orgId,
        event_type: eventType,
        metadata: metadata || {},
        member_id: memberId || null,
        session_id: getSessionId(),
      }),
    })
  } catch {
    // Silent fail for analytics
  }
}
