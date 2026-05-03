'use client'

import type { Restaurant, DashboardTable } from "@/types"
import { useRef, useState, useMemo, useEffect } from "react"

type Props = {
    restaurant: Pick<Restaurant, 'id' | 'name' | 'slug' | 'address'>
    tables: DashboardTable[]
}

type LayoutPosition = {
    x: number
    y: number
}

type TDragging = {
    tableId: string
    offsetX: number
    offsetY: number
}

const BOARD_WIDTH = 500
const BOARD_HEIGHT = 500
const TABLE_WIDTH_PERCENT = 20
const TABLE_HEIGHT_PERCENT = 20


const getDefaultPositions = (tables: DashboardTable[]) => {
    let positions: Record<string, LayoutPosition> = {}

    const columns = 4
    const gapXPercent = (100 / columns) - 3

    const rows = Math.ceil(tables.length / columns)
    const gapYPercent = rows > 1 ? (100 / rows) - 3 : 20

    tables.forEach((table, index) => {
        console.log(index)

        const x = 8 + (index % columns) * gapXPercent
        const y = 8 + Math.floor(index / columns) * gapYPercent

        positions[table.id] = {
            x: Math.min(x, 100 - TABLE_WIDTH_PERCENT),
            y: Math.min(y, 100 - TABLE_HEIGHT_PERCENT)
        }

        console.log(positions[table.id], columns, rows)
    });

    return positions
}

export default function AdminDashboardClient({ restaurant, tables }: Props) {
    const boardRef = useRef<HTMLDivElement | null>(null)
    const defaultPositions = useMemo(() => getDefaultPositions(tables), [tables])
    const [positions, setPositions] = useState<Record<string, LayoutPosition>>(defaultPositions)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [dragging, setDragging] = useState<TDragging | null>(null)

    function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>, tableId: string) {
        if (!isEditing) {
            return
        }

        const board = boardRef.current
        const target = e?.currentTarget

        if (!board) {
            return
        }

        const boardRect = board.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()

        const offsetX = ((e.clientX - targetRect.left) / boardRect.width) * 100
        const offsetY = ((e.clientY - targetRect.top) / boardRect.height) * 100


        setDragging({
            tableId, offsetX, offsetY
        })

        target.setPointerCapture(e.pointerId)

        if (!positions[tableId]) {
            setPositions(prev => ({
                ...prev,
                [tableId]: {
                    x: ((targetRect.left - boardRect.left) / boardRect.width) * 100,
                    y: ((targetRect.top - boardRect.top) / boardRect.height) * 100,
                }
            }))
        }

    }


    return (
        <div>
            <button onClick={() => setIsEditing(edit => (!edit))} className="bg-green-300 cursor-pointer">
                {isEditing ? 'Cancel Edit' : 'Edit Table'}
            </button>
            <div ref={boardRef} className={`bg-orange-500 relative overflow-hidden`} style={{ width: `${BOARD_WIDTH}px`, height: `${BOARD_HEIGHT}px` }}>
                {tables.map((table) => {
                    const position = positions[table?.id] ?? { x: 4, y: 4 }
                    return (
                        <button style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            width: `${TABLE_WIDTH_PERCENT}%`,
                            height: `${TABLE_HEIGHT_PERCENT}%`,
                            touchAction: 'none',
                            position: 'absolute'
                        }}
                            className={`border-1 
                            ${isEditing ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                                }`}
                            key={table.id}
                            onPointerDown={(e) => handlePointerDown(e, table.id)}
                        >
                            Table {table.tableNumber}
                        </button>)
                }
                )}
            </div>
        </div>
    )
}