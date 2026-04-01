'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Restaurant } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { buildSessionQuery } from '@/lib/session'

type UseSessionGuardOptions = {
    restaurantSlug: string
    restaurant?: Restaurant
}

export function useSessionGuard({ restaurantSlug, restaurant }: UseSessionGuardOptions) {
    const searchParams = useSearchParams()
    const tableNumber = searchParams.get('table')
    const sessionId = searchParams.get('sessionId')
    const [isChecking, setIsChecking] = useState<boolean>(Boolean(tableNumber || sessionId))
    const [error, setError] = useState<string>('')
    const { setTable, clearTable } = useCartStore()

    useEffect(() => {
        let isMounted = true

        async function verifySessionAvailability() {
            if (!tableNumber && !sessionId) {
                if (isMounted) {
                    setIsChecking(false)
                    setError('')
                }
                return
            }

            if (!tableNumber || !sessionId) {
                clearTable()

                if (isMounted) {
                    setIsChecking(false)
                    setError('Table and session ID are required to access this page.')
                }
                return
            }

            if (isMounted) {
                setIsChecking(true)
                setError('')
            }

            try {
                const query = new URLSearchParams({
                    table: tableNumber,
                    sessionId,
                })
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/restaurant/${restaurantSlug}/session/availability?${query.toString()}`
                )
                const data: { available?: boolean; message?: string } = await response.json()

                if (!response.ok || !data.available) {
                    throw new Error(data.message || 'Session is not available for this table')
                }

                if (restaurant) {
                    setTable(tableNumber, restaurant, sessionId)
                }

                if (isMounted) {
                    setError('')
                }
            } catch (sessionError) {
                clearTable()

                if (!isMounted) {
                    return
                }

                setError(
                    sessionError instanceof Error ? sessionError.message : 'Unable to verify table session'
                )
            } finally {
                if (isMounted) {
                    setIsChecking(false)
                }
            }
        }

        verifySessionAvailability()

        return () => {
            isMounted = false
        }
    }, [clearTable, restaurant, restaurantSlug, sessionId, setTable, tableNumber])

    return {
        tableNumber,
        sessionId,
        isChecking,
        error,
        sessionQuery: buildSessionQuery(tableNumber, sessionId),
    }
}
