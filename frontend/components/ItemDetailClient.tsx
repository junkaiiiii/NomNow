'use client'

import RestaurantHeader from "./RestaurantHeader"
import { useCartStore } from "@/store/cartStore"
import { MenuItem } from "@/types"

type Props = {
    item: MenuItem
}

export default function ItemDetailClient({ item }: Props) {
    const { addToCart, incrementCartItem } = useCartStore();
    console.log(item)

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <div className="max-w-2xl mx-auto px-4 py-30 space-y-8 ">
                <RestaurantHeader
                    name={item.name}
                    address=''
                    goBack={true}
                />
                <div>
                    <img src={item.imageUrl}></img>
                </div>
            </div>
        </div>
    )
}