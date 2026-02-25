'use client'

import { OrderItem, Order, MenuItem } from "@/app/types"


type Props = {
    orders: Order[]
    table: string
}

export default function OrdersClient({orders, table}:Props){
    console.log(orders, table)

    return (
        <>
            <h1>Table: {table}</h1>
            {orders.map(order => (
                <p key={order.id}>{order.total}</p>
            ))}
        </>
    )
}