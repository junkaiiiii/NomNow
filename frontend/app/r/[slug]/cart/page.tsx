'use client'

import RestaurantHeader from "@/components/RestaurantHeader"
import CartItemCard from "@/components/CartItemCard";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore"
import { useRouter } from "next/navigation";
import { calculateTax } from "@/lib/taxCalculator";
import { CartItem, ItemCustomization } from "@/types";

export default function CartPage() {
    const { cart, tableNumber, restaurant, clearCart, updateCartItemCustomization } = useCartStore()
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<CartItem | null>(null);

    const cartTotal = cart.reduce((sum, i) => (sum + i.unitPrice * i.quantity), 0)


    // Guard — if no restaurant in store, redirect back
    if (!restaurant) {
        return (
            <div className="min-h-screen bg-gray-50 pb-32">
                <RestaurantHeader
                    name="View Cart"
                    address=""
                    goBack={true}
                />
                <div className="max-w-2xl mx-auto px-4 py-5 space-y-8 ">
                    <div className="flex justify-center items-center min-h-screen flex-col space-y-5">
                        <h1 className='text-xl font-bold'>Cart is Empty...</h1>
                        <button className="p-2 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition rounded-lg cursor-pointer"
                            onClick={() => { router.back() /*router.push(`/r/${slug}?table=${tableNumber}`)*/ }}>
                            Go Back to Menu
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    console.log(restaurant)
    const priceBreakdown = calculateTax(cartTotal, restaurant.taxConfig);
    console.log(priceBreakdown)

    console.log(cart)

    // submit order
    async function handleSubmitOrder() {
        setSubmitting(true);

        if (!restaurant) {
            setError("Slug is needed to submit order.")
            setSubmitting(false);
            return
        }
        if (!tableNumber) {
            setError("Table number is needed to submit order")
            setSubmitting(false);
            return
        }

        const items = cart.map(item => {
            return (
                {
                    menuItemId: item.menuItemId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    selectedAddOns: item.selectedAddOns,
                    preference: item.preference,
                }
            )
        })

        try {
            // POST create new order
            // router.post('/', (req, res) => {
            //     const { slug, table, items } = req.body

            // const res = await fetch(`http://localhost:5001/api/menu/${slug}`)
            const res = await fetch(`http://localhost:5002/api/orders`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(
                    {
                        restaurantId: restaurant.id,
                        table: parseInt(tableNumber),
                        items: items,
                        sstAmount: priceBreakdown.sstAmount,
                        serviceTaxAmount: priceBreakdown.serviceTaxAmount,
                        subtotal: priceBreakdown.subtotal,
                        total: priceBreakdown.total
                    }
                )
            })

            if (!res.ok) throw new Error('Failed to place order')

            const order = await res.json()
            setSubmitting(false);
            console.log(order);
            clearCart()
            // router.push(`/r/${slug}/order/${order.id}`)
        } catch (error) {
            setError('Something went wrong. Please try again.')
            setSubmitting(false)
        }

    }

    if (cart.length < 1) {
        return (
            <div className="min-h-screen bg-gray-50 pb-32">
                <RestaurantHeader
                    name="View Cart"
                    address=""
                    goBack={true}
                />
                <div className="max-w-2xl mx-auto px-4 py-5 space-y-8 ">
                    <div className="flex justify-center items-center min-h-screen flex-col space-y-5">
                        <h1 className='text-xl font-bold'>Cart is Empty...</h1>
                        <button className="p-2 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition rounded-lg cursor-pointer"
                            onClick={() => { router.back() /*router.push(`/r/${slug}?table=${tableNumber}`)*/ }}>
                            Go Back to Menu
                        </button>
                    </div>
                </div>
            </div>
        )
    }


    return (

        <div className="min-h-screen bg-gray-50 pb-32">
            <div className="max-w-2xl mx-auto px-4 py-30 space-y-8 ">
                <RestaurantHeader
                    name="View Cart"
                    address=""
                    goBack={true}
                />

                <div className="flex flex-col rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    {
                        cart.map((item, index) => (
                            <CartItemCard
                                item={item}
                                key={item.id}
                                index={index}
                                onEdit={setEditingItem}
                            />
                        ))
                    }
                </div>


                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
                    <h2 className="font-bold text-lg mb-3">Order Summary</h2>
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-sm text-gray-600">
                            <span>{item.name} x{item.quantity}</span>
                            <span>RM {(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}

                    <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between text-sm text-gray-600">
                        <span>SST ({restaurant.taxConfig.sst * 100}%) {priceBreakdown.sstInclusive ? ' (Inclusive)' : ''}: </span>
                        <span>RM {priceBreakdown.sstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Service Tax ({restaurant.taxConfig.serviceTax * 100})%: </span>
                        <span>RM {priceBreakdown.serviceTaxAmount.toFixed(2)}</span>
                    </div>

                    <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>RM {priceBreakdown.total.toFixed(2)}</span>
                    </div>

                    <button className="w-full bg-orange-500 text-white text-lg font-semibold rounded-lg py-1 mt-2 cursor-pointer hover:bg-orange-600 transition"
                        onClick={() => handleSubmitOrder()}
                    >
                        {submitting ? 'Placing Order...' : 'Place Order'}
                    </button>
                </div>
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
            </div>
        </div>

    )
}
