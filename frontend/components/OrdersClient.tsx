'use client'

import { Order, Restaurant } from "@/types"

import GeneralHeader from "@/components/GeneralHeader"
import { useSessionGuard } from "@/hooks/useSessionGuard"

type Props = {
    orders: Order[]
    table: string
    restaurant: Restaurant
}

export default function OrdersClient({ orders, table, restaurant }: Props) {
    const { isChecking: isSessionChecking, error: sessionError } = useSessionGuard({
        restaurantSlug: restaurant.slug,
        restaurant,
    })

    console.log(orders);

    if (isSessionChecking) {
        return (
            <div className="min-h-screen bg-gray-50 pb-32">
                <div className="max-w-2xl mx-auto px-4 py-30 space-y-8 ">
                    <GeneralHeader
                        title='Order History'
                        subtitle='Checking session'
                        goBack={true}
                    />
                    <div className="rounded-xl bg-white p-6 text-center shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">Checking session</h2>
                        <p className="mt-2 text-sm text-gray-500">Verifying table access for order history.</p>
                    </div>
                </div>
            </div>
        )
    }

    if (sessionError) {
        return (
            <div className="min-h-screen bg-gray-50 pb-32">
                <div className="max-w-2xl mx-auto px-4 py-30 space-y-8 ">
                    <GeneralHeader
                        title='Order History'
                        subtitle='Session unavailable'
                        goBack={true}
                    />
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
                        <h2 className="text-lg font-semibold text-red-700">Session unavailable</h2>
                        <p className="mt-2 text-sm text-red-600">{sessionError}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <div className="max-w-2xl mx-auto px-4 py-30 space-y-8 ">
                <GeneralHeader
                    title='Order History'
                    subtitle={`Table ${table}`}
                    goBack={true}
                />

                {/* all orders */}
                <div>
                    {orders.map((order, index) => (
                        <div key={order.id} className="border border-1 border-gray-200 rounded-lg p-5 bg-white shadow-sm mb-5">
                            <h2 className="font-semibold">Order {index + 1}</h2>
                            <p className="text-sm font-light mb-3 text-gray-500">Ordered at: {order.createdAt.replace('T', ' ').substring(0, 19)}</p>

                            <div>
                                {order.items.map((item, itemIndex) => (
                                    <div className="flex justify-between items-center mt-1" key={`${item.menuItem.id}-${itemIndex}`}>
                                        <span>
                                            {item.menuItem.name}
                                            <span className="text-orange-500"> (x{item.quantity})</span>
                                            {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                                                <p className="text-xs text-gray-500">
                                                    Add-ons: {item.selectedAddOns.map((addOn) => addOn.name).join(", ")}
                                                </p>
                                            )}
                                            {item.preference && item.preference.trim() && (
                                                <p className="text-xs text-gray-500">Preference: {item.preference}</p>
                                            )}
                                        </span>
                                        <span className="text-gray-500 ml-2 ">
                                            RM{item.subtotal.toFixed(2)} 
                                        </span>
                                    </div>
                                )

                                )}
                            </div>

                            <div className="flex mt-4 justify-between ">
                                <span className="text-gray-500  ">Subtotal</span>
                                <span className="text-gray-500">RM {order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between ">
                                <span className="text-gray-500  ">SST {restaurant.sstInclusive && '(inclusive)'}</span>
                                <span className="text-gray-500">RM {order.sstAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between ">
                                <span className="text-gray-500  ">Service Charge</span>
                                <span className="text-gray-500">RM {order.serviceTaxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span className="">Total</span>
                                <span className="">RM {order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// export type Order = {
//     id: string
//     restaurantId: string
//     tableNumber: number
//     items: OrderItem[]
//     status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered'
//     createdAt: string
//     sstAmount: number
//     serviceTaxAmount: number
//     subtotal: number //subtotal = total without tax
//     total: number //total = sum(sst,serviceTax,subtotal)
// }
