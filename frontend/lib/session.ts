export function buildSessionQuery(tableNumber?: string | null, sessionId?: string | null): string {
    const params = new URLSearchParams()

    if (tableNumber) {
        params.set('table', tableNumber)
    }

    if (sessionId) {
        params.set('sessionId', sessionId)
    }

    return params.toString()
}

export function buildSessionPath(path: string, tableNumber?: string | null, sessionId?: string | null): string {
    const query = buildSessionQuery(tableNumber, sessionId)

    return query ? `${path}?${query}` : path
}
