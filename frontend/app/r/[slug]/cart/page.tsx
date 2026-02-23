'use client'

import RestaurantHeader from "@/components/RestaurantHeader"
import CartItemCard from "@/components/CartItemCard";
import { useCartStore } from "@/store/cartStore"
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { cart, tableNumber, slug, addToCart, removeFromCart, clearCart } = useCartStore();
    const router = useRouter();

    const cartTotal = cart.reduce((sum, i) => (sum + i.price * i.quantity), 0)

    if (cart.length < 1) {
        return (
            <div className='flex flex-col items-center justify-center inset-0 absolute bg-gray-50 space-y-5'>
                <h1 className='text-xl font-bold'>Cart is Empty...</h1>
                <button className="p-2 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition rounded-lg cursor-pointer"
                    onClick={() => { router.push(`/r/${slug}?table=${tableNumber}`) }}>
                    Go Back to Menu
                </button>
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
                            <span>RM {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}

                    <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between text-sm text-gray-600">
                        <span>SST(10%): </span>
                        <span>RM {(cartTotal*0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Service Tax: </span>
                        <span>RM {(cartTotal*0.06).toFixed(2)}</span>
                    </div>

                    <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>RM {(cartTotal+(cartTotal*0.1)+(cartTotal*0.06)).toFixed(2)}</span>
                    </div>

                    <button className="w-full bg-orange-500 text-white text-lg font-bold rounded-lg py-1 mt-2">
                        Submit Order
                    </button>
                </div>
            </div>
        </div>

    )
}