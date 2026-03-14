'use client'

import { useCartStore } from "@/store/cartStore"
import { CartItem } from "@/types"
import { Trash } from 'lucide-react'

const FALLBACK_IMAGE_URL = "https://www.theflavorbender.com/wp-content/uploads/2021/09/Roti-Canai-6501-2.jpg";

type Props = {
    item: CartItem
    index: number
    onEdit: (item: CartItem) => void
}

export default function CartItemCard({ item, index, onEdit }: Props) {
    const { incrementCartItem, decrementCartItem, removeCartItem } = useCartStore()

    const price = item.quantity * item.unitPrice

    return (
        <div className={`w-full bg-white ${index !== 0 && 'border-t-1'}  border-gray-300 flex justify-between items-center p-5`}>
            <button
                type="button"
                className="flex flex-1 justify-start items-center space-x-5 text-left"
                onClick={() => onEdit(item)}
            >
                <div className=''>
                    <img
                        className='w-20 h-20 rounded-md object-cover'
                        src={item.imageUrl}
                        onError={(event) => {
                            event.currentTarget.src = FALLBACK_IMAGE_URL;
                        }}
                    />
                </div>
                <div>
                    <p className="text-md font-bold">{item.name}</p>
                    <p className="text-sm">{item.description}</p>
                    {item.selectedAddOns.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                            Add-ons: {item.selectedAddOns.map((addOn) => addOn.name).join(", ")}
                        </p>
                    )}
                    {item.preference.trim() && (
                        <p className="text-xs text-gray-500 mt-1">Preference: {item.preference}</p>
                    )}
                    <p className="text-sm font-semibold mt-2">RM{price.toFixed(2)}</p>
                    <p className="text-xs text-orange-500 mt-1">Tap to edit</p>
                </div>
            </button>

            <div className="flex flex-col items-end space-y-3">
                <button className="-mt-3" onClick={() => removeCartItem(item.id)}>
                    <Trash
                        className="w-5 h-5 text-orange-500"
                    />
                </button>

                <div className="flex w-25 items-center justify-between ">
                    <button
                        onClick={() => decrementCartItem(item.id)}
                        className="w-8 h-8 rounded-full bg-white text-orange-500 font-bold hover:bg-orange-200 transition"
                    >
                        −
                    </button>
                    <span className="w-4 text-center font-semibold">{item.quantity}</span>
                    <button
                        onClick={() => incrementCartItem(item.id)}
                        className="w-8 h-8 rounded-full bg-white text-orange-500 font-bold hover:bg-orange-200 transition flex justify-center items-center"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    )
}
