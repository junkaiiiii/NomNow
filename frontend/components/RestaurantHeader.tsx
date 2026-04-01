'use client'

import { ReceiptText } from "lucide-react"
import { useRouter } from "next/navigation"
import { Restaurant } from "@/types"
import { useCartStore } from "@/store/cartStore"
import { buildSessionPath } from "@/lib/session"

type Props = {
    restaurant: Restaurant
    goBack: boolean
}

export default function RestaurantHeader({ restaurant, goBack }: Props) {
    const router = useRouter();
    const { tableNumber, sessionId } = useCartStore()

    return (
        <div className="bg-white p-6 fixed top-0 left-0 right-0 shadow-md flex justify-between items-center h-20 space-x-5">


            <div className="flex space-x-5">
                {
                    goBack && (
                        <button onClick={() => router.back()} className="cursor-pointer">
                            &larr;
                        </button>
                    )
                }
                <div>
                    <h1 className="text-black text-xl font-bold ">{restaurant.name ?? ""}</h1>
                    <p className="text-gray-500 text-sm mt-1">{restaurant.address}</p>
                </div>
            </div>

            <ReceiptText
                className="cursor-pointer "
                onClick={() => router.push(buildSessionPath(`/r/${restaurant.slug}/orders`, tableNumber, sessionId))}
            />

        </div>
    )
}
