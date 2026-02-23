'use client'

import { useCartStore } from "@/store/cartStore"
import { CartItem } from "@/app/types"
import { Trash } from 'lucide-react'

type Props = {
    item: CartItem
    index: number
}

export default function CartItemCard({ item, index }: Props) {
    const { addToCart, removeFromCart, clearCart } = useCartStore()

    const price = item.quantity * item.price

    return (
        <div className={`w-full bg-white ${index !== 0 && 'border-t-1'}  border-gray-300 flex justify-between items-center p-5`}>
            <div>
                <p className="text-md font-bold">{item.name}</p>
                <p className="text-sm">{item.description}</p>
                <p className="text-sm font-semibold mt-2">RM{price.toFixed(2)}</p>
            </div>

            <div className="flex flex-col items-end space-y-3">
                <button className="-mt-3" onClick={()=>{}}>
                    <Trash 
                        className="w-5 h-5 text-orange-500"
                    />
                </button>

                <div className="flex w-25 items-center justify-between ">
                    <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-full bg-white text-orange-500 font-bold hover:bg-orange-200 transition"
                    >
                        −
                    </button>
                    <span className="w-4 text-center font-semibold">{item.quantity}</span>
                    <button
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 rounded-full bg-white text-orange-500 font-bold hover:bg-orange-200 transition flex justify-center items-center"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    )
}