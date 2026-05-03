
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
    Armchair,
    BadgeDollarSign,
    Check,
    Grid3X3,
    LayoutDashboard,
    Move,
    RotateCcw,
    Save,
    Users,
} from 'lucide-react'
import type { DashboardTable, Restaurant } from '@/types'

type LayoutPosition = {
    x: number
    y: number
}

type Props = {
    restaurant: Pick<Restaurant, 'id' | 'name' | 'slug' | 'address'>
    tables: DashboardTable[]
}

const BOARD_WIDTH = 100
const BOARD_HEIGHT = 100
const TABLE_WIDTH = 15
const TABLE_HEIGHT = 13

function getDefaultPositions(tables: DashboardTable[]): Record<string, LayoutPosition> {
    return tables.reduce<Record<string, LayoutPosition>>((positions, table, index) => {
        const columns = 4
        const gapX = 22
        const gapY = 21
        const x = 7 + (index % columns) * gapX
        const y = 8 + Math.floor(index / columns) * gapY

        positions[table.id] = {
            x: Math.min(x, BOARD_WIDTH - TABLE_WIDTH - 2),
            y: Math.min(y, BOARD_HEIGHT - TABLE_HEIGHT - 2),
        }

        return positions
    }, {})
}

export default function AdminDashboardClient({ restaurant, tables }: Props) {
    const boardRef = useRef<HTMLDivElement | null>(null)
    const storageKey = `nomnow:${restaurant.slug}:table-layout`
    const defaultPositions = useMemo(() => getDefaultPositions(tables), [tables])
    const [positions, setPositions] = useState<Record<string, LayoutPosition>>(defaultPositions)
    const [isEditing, setIsEditing] = useState(true)
    const [savedLabel, setSavedLabel] = useState('Saved locally')
    const [dragging, setDragging] = useState<{
        tableId: string
        offsetX: number
        offsetY: number
    } | null>(null)

    useEffect(() => {
        queueMicrotask(() => {
            const savedLayout = window.localStorage.getItem(storageKey)

            if (!savedLayout) {
                setPositions(defaultPositions)
                return
            }

            try {
                const parsed = JSON.parse(savedLayout) as Record<string, LayoutPosition>
                setPositions({ ...defaultPositions, ...parsed })
            } catch {
                setPositions(defaultPositions)
            }
        })
    }, [defaultPositions, storageKey])

    useEffect(() => {
        if (!dragging) {
            return
        }

        const activeDrag = dragging

        function handlePointerMove(event: PointerEvent) {
            const board = boardRef.current

            if (!board) {
                return
            }

            const rect = board.getBoundingClientRect()
            const nextX = ((event.clientX - rect.left - activeDrag.offsetX) / rect.width) * 100
            const nextY = ((event.clientY - rect.top - activeDrag.offsetY) / rect.height) * 100

            setPositions((current) => ({
                ...current,
                [activeDrag.tableId]: {
                    x: Math.min(Math.max(nextX, 1), BOARD_WIDTH - TABLE_WIDTH - 1),
                    y: Math.min(Math.max(nextY, 1), BOARD_HEIGHT - TABLE_HEIGHT - 1),
                },
            }))
            setSavedLabel('Unsaved layout')
        }

        function handlePointerUp() {
            setDragging(null)
        }

        window.addEventListener('pointermove', handlePointerMove)
        window.addEventListener('pointerup', handlePointerUp)

        return () => {
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerup', handlePointerUp)
        }
    }, [dragging])

    const activeTables = tables.filter((table) => table.activeSession)
    const openOrders = activeTables.reduce((sum, table) => sum + (table.activeSession?.orderCount ?? 0), 0)
    const runningTotal = activeTables.reduce((sum, table) => sum + (table.activeSession?.total ?? 0), 0)

    function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>, tableId: string) {
        if (!isEditing) {
            return
        }

        const board = boardRef.current
        const target = event.currentTarget

        if (!board) {
            return
        }

        const boardRect = board.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()

        setDragging({
            tableId,
            offsetX: event.clientX - targetRect.left,
            offsetY: event.clientY - targetRect.top,
        })
        target.setPointerCapture(event.pointerId)

        const current = positions[tableId]

        if (!current) {
            setPositions((existing) => ({
                ...existing,
                [tableId]: {
                    x: ((targetRect.left - boardRect.left) / boardRect.width) * 100,
                    y: ((targetRect.top - boardRect.top) / boardRect.height) * 100,
                },
            }))
        }
    }

    function saveLayout() {
        window.localStorage.setItem(storageKey, JSON.stringify(positions))
        setSavedLabel('Saved locally')
    }

    function resetLayout() {
        window.localStorage.removeItem(storageKey)
        setPositions(defaultPositions)
        setSavedLabel('Default layout')
    }

    return (
        <main className="min-h-screen bg-zinc-100 text-zinc-950">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <header className="flex flex-col gap-4 border-b border-zinc-300 pb-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-orange-700">
                            <LayoutDashboard className="h-4 w-4" />
                            Restaurant dashboard
                        </div>
                        <h1 className="mt-2 text-3xl font-bold tracking-normal text-zinc-950">
                            {restaurant.name}
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-zinc-600">{restaurant.address}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsEditing((value) => !value)}
                            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition ${
                                isEditing
                                    ? 'border-orange-300 bg-orange-100 text-orange-800'
                                    : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
                            }`}
                        >
                            <Move className="h-4 w-4" />
                            {isEditing ? 'Editing layout' : 'View layout'}
                        </button>
                        <button
                            type="button"
                            onClick={resetLayout}
                            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={saveLayout}
                            className="inline-flex items-center gap-2 rounded-md bg-zinc-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                        >
                            <Save className="h-4 w-4" />
                            Save
                        </button>
                    </div>
                </header>

                <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Metric label="Tables" value={tables.length.toString()} icon={<Grid3X3 className="h-5 w-5" />} />
                    <Metric label="Occupied" value={activeTables.length.toString()} icon={<Users className="h-5 w-5" />} />
                    <Metric label="Open orders" value={openOrders.toString()} icon={<Armchair className="h-5 w-5" />} />
                    <Metric
                        label="Running total"
                        value={`RM ${runningTotal.toFixed(2)}`}
                        icon={<BadgeDollarSign className="h-5 w-5" />}
                    />
                </section>

                <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-sm">
                        <div className="flex flex-col gap-2 border-b border-zinc-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-zinc-950">Floor Layout</h2>
                                <p className="text-sm text-zinc-500">
                                    Drag tables into place, then save the layout on this device.
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500">
                                <Check className="h-4 w-4 text-emerald-600" />
                                {savedLabel}
                            </div>
                        </div>

                        <div
                            ref={boardRef}
                            className="relative h-[560px] overflow-hidden bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:32px_32px]"
                        >
                            <div className="absolute left-5 top-5 h-20 w-28 rounded-md border border-dashed border-zinc-400 bg-zinc-50/80 px-3 py-2 text-xs font-semibold text-zinc-500">
                                Entrance
                            </div>
                            <div className="absolute bottom-5 right-5 h-24 w-36 rounded-md border border-dashed border-zinc-400 bg-zinc-50/80 px-3 py-2 text-xs font-semibold text-zinc-500">
                                Kitchen
                            </div>

                            {tables.map((table) => {
                                const position = positions[table.id] ?? defaultPositions[table.id] ?? { x: 4, y: 4 }
                                const isActive = Boolean(table.activeSession)

                                return (
                                    <button
                                        key={table.id}
                                        type="button"
                                        onPointerDown={(event) => handlePointerDown(event, table.id)}
                                        className={`absolute flex select-none flex-col justify-between rounded-md border px-3 py-2 text-left shadow-sm transition ${
                                            isEditing ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                                        } ${
                                            isActive
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                                                : 'border-zinc-300 bg-white text-zinc-800'
                                        }`}
                                        style={{
                                            left: `${position.x}%`,
                                            top: `${position.y}%`,
                                            width: `${TABLE_WIDTH}%`,
                                            height: `${TABLE_HEIGHT}%`,
                                            touchAction: 'none',
                                        }}
                                        title={`Table ${table.tableNumber}`}
                                    >
                                        <span className="text-xs font-medium uppercase text-zinc-500">
                                            Table
                                        </span>
                                        <span className="text-2xl font-bold leading-none">
                                            {table.tableNumber}
                                        </span>
                                        <span
                                            className={`mt-1 w-fit rounded px-2 py-0.5 text-xs font-semibold ${
                                                isActive
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-zinc-200 text-zinc-600'
                                            }`}
                                        >
                                            {isActive ? 'Occupied' : 'Available'}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <aside className="rounded-lg border border-zinc-300 bg-white shadow-sm">
                        <div className="border-b border-zinc-200 px-4 py-3">
                            <h2 className="text-lg font-bold text-zinc-950">Tables</h2>
                            <p className="text-sm text-zinc-500">Live table session summary.</p>
                        </div>

                        <div className="divide-y divide-zinc-200">
                            {tables.map((table) => (
                                <div key={table.id} className="px-4 py-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-bold text-zinc-950">Table {table.tableNumber}</h3>
                                            <p className="mt-1 text-sm text-zinc-500">
                                                {table.activeSession
                                                    ? `${table.activeSession.itemCount} items ordered`
                                                    : 'Ready for next session'}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded px-2 py-1 text-xs font-bold ${
                                                table.activeSession
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-zinc-100 text-zinc-500'
                                            }`}
                                        >
                                            {table.activeSession ? 'Active' : 'Empty'}
                                        </span>
                                    </div>

                                    {table.activeSession && (
                                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                            <div className="rounded-md bg-zinc-100 px-3 py-2">
                                                <div className="text-xs font-medium text-zinc-500">Orders</div>
                                                <div className="font-bold text-zinc-950">
                                                    {table.activeSession.orderCount}
                                                </div>
                                            </div>
                                            <div className="rounded-md bg-zinc-100 px-3 py-2">
                                                <div className="text-xs font-medium text-zinc-500">Total</div>
                                                <div className="font-bold text-zinc-950">
                                                    RM {table.activeSession.total.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </aside>
                </section>
            </div>
        </main>
    )
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="rounded-lg border border-zinc-300 bg-white px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-zinc-500">{label}</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-950">{value}</p>
                </div>
                <div className="rounded-md bg-orange-100 p-2 text-orange-700">{icon}</div>
            </div>
        </div>
    )
}
