'use client'

import { useEffect, useState } from "react"
import { useCartStore } from "@/store/cartStore"
import { useRouter } from "next/navigation"
import { buildCustomizationSignature } from "@/lib/itemCustomization"
import Link from "next/link"

type Props = {
    itemId: string
    isShow: boolean
    onClose: () => void
}


// export type ItemCustomization = {
//     selectedAddOns: AddOnOption[]
//     preference: string
// }

export default function ItemCustomizationChoice({ itemId, isShow, onClose }: Props) {
    const [isMounted, setIsMounted] = useState(false)
    const { restaurant, cart, decrementCartItem, incrementCartItem } = useCartStore()
    const router = useRouter();

    useEffect(() => {
        if (isShow) {
            setIsMounted(true)
        }
    }, [isShow])

    const handleClose = () => {
        setIsMounted(false)
        setTimeout(() => onClose(), 10)
    }

    // dynamic and not predefined key, so we use object instead of map
    const customizationGroups: { [key: string]: typeof cart } = {}

    const createCustomizationGroups = () => {
        if (!cart || cart.length === 0) return; // Ensure cart is not empty
        cart.forEach((item) => {
            if (item.menuItemId === itemId) {
                const itemCustomization = {
                    selectedAddOns: item.selectedAddOns ?? [],
                    preference: item.preference ?? "",
                }
                const signature = buildCustomizationSignature(itemId, itemCustomization)
                if (!customizationGroups[signature]) {
                    customizationGroups[signature] = []
                }
                customizationGroups[signature].push(item) // Add the item to the group
            }
        })
    }
    createCustomizationGroups()
    console.log(customizationGroups);



    return (
        <div
            className={`fixed inset-0 flex flex-col justify-end items-center transition-colors duration-200 z-50 ${
                isShow ? 'bg-black/50' : 'bg-black/0 pointer-events-none'
            }`}
            onClick={handleClose}
        >
            <div
                className={`bg-white rounded-t-lg p-6 flex flex-col justify-center max-w-2xl w-full shadow-lg space-y-3 transition-transform duration-200 ${
                    isShow ? 'translate-y-0' : 'translate-y-full'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">Existing Customizations</h2>
                {Object.entries(customizationGroups).map(([signature, items]) => (

                    items.length > 0 && (
                        <div key={items[0].id} className="flex justify-between item-center p-3">
                            <div className="flex justify-start space-x-2">
                                <img src={items[0].imageUrl || ''} className="w-16 h-16 rounded-md object-cover"></img>
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold">{items[0].name}</p>
                                    <p className="text-sm text-gray-500">Addons: {items[0].selectedAddOns && (
                                        items[0].selectedAddOns.map(addOn => addOn.name).join(", ")
                                    )}</p>
                                    <Link className="text-sm text-orange-500" href={`/r/${restaurant?.slug}/item/${itemId}?signature=${buildCustomizationSignature(itemId, {
                                        selectedAddOns: items[0].selectedAddOns ?? [],
                                        preference: items[0].preference ?? "",
                                    })}`}>
                                        Tap to edit
                                    </Link>
                                </div>

                            </div>

                            <div className="w-auto flex justify-even items-center space-x-2">
                                <button
                                    onClick={() => decrementCartItem(items[0].id)}
                                    className="w-8 h-8 rounded-full bg-white text-orange-500 font-bold hover:bg-orange-200 transition"
                                >
                                    −
                                </button>
                                <span className="w-4 text-center font-semibold">{items[0].quantity}</span>
                                <button
                                    onClick={() => incrementCartItem(items[0].id)}
                                    className="w-8 h-8 rounded-full bg-white text-orange-500 font-bold hover:bg-orange-200 transition flex justify-center items-center"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )
                ))
                }

                <div>
                    <p className="text-sm text-gray-500">Don't see the customization you're looking for? </p>
                    <button className="bg-orange-500 text-white py-1 px-2 cursor-pointer hover:bg-orange-600 transition rounded-lg mt-2"
                        onClick={() => { router.push(`/r/${restaurant?.slug}/item/${itemId}`) }}>
                        Add a new one
                    </button>
                </div>

                <button className="bg-orange-500 text-white rounded-md w-full py-3 mt-4 font-bold hover:bg-orange-600 transition"
                    onClick={() => onClose()}>
                    Save Changes
                </button>
            </div>

        </div>

    )
}