'use client'
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cartStore";

type Props = {
    cartQuantity: number
    totalAmount: number
    tableNumber: string | null
    slug: string | null
}

export default function CartBar() {
    const { cart, restaurant, tableNumber } = useCartStore();
    const router = useRouter();

    function getCartQuantity() {
        let total = 0

        cart.forEach(item => {
            total += item.quantity
        });

        return total
    }

    function getTotalAmount() {
        let total = 0

        cart.forEach(item => {
            total += item.unitPrice * item.quantity
        });

        return total
    }

    // Hide if cart is empty — this is the main guard
    if (getCartQuantity() === 0) return null

    // Hide if no restaurant session
    if (!restaurant) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 max-w-2xl mx-auto px-4">
            <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-xl font-semibold flex justify-between items-center hover:bg-orange-600 transition"
                onClick={() => {
                    router.push(`/r/${restaurant.slug}/cart?table=${tableNumber}`)
                }}>
                <span className="bg-white text-orange-500 text-sm px-2 py-0.5 rounded-full">{getCartQuantity()}</span>
                <span className="pl-8">View Cart
                    {tableNumber &&
                        <a className="text-grey-300 font-light text-sm"> (Table {tableNumber})</a>
                    }

                </span>

                <span>RM {getTotalAmount().toFixed(2)}</span>

            </button>
        </div>
    )
}
