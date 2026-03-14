'use client'

import RestaurantHeader from "./RestaurantHeader"
import { useState } from "react"
import { useCartStore } from "@/store/cartStore"
import { MenuItem, AddOnOption } from "@/types"
import { buildCustomizationSignature } from "@/lib/itemCustomization"

type Props = {
    item: MenuItem
    existingAddOns?: AddOnOption[]
    existingPreference?: string
}

export default function ItemDetailClient({ item }: Props) {
    const { cart, addToCart, incrementCartItem, decrementCartItem } = useCartStore();
    const [ quantity, setQuantity ] = useState<number>(0);
    const [ addOns, setAddOns ] = useState<AddOnOption[]>([]);

    function handleAddtoCart(){

    }

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <div className="max-w-2xl mx-auto px-4 py-30 space-y-8 ">
                <RestaurantHeader
                    name={item.name}
                    address=''
                    goBack={true}
                />
                <div>
                    <img className="w-full h-80 object-cover rounded-lg shadow-md" src={item.imageUrl}></img>
                </div>
                <div className="border-b border-orange-400 p-3 pr-4 mb-2 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-lg ">{item.name}</h2>
                        <p>{item.description}</p>
                    </div>


                    <div className="flex w-25 justify-between items-center">
                        <button className="bg-orange-500 w-8  h-8 rounded-full flex justify-center items-center text-white font-bold text-xl cursor-pointer hover:bg-orange-600 transition"
                        onClick={() => {
                            decrementCartItem(item.id);
                            if (quantity > 0) {
                                setQuantity(quantity - 1)
                            }
                        }}
                        >
                            -
                        </button>
                        <h2>{quantity}</h2>
                        <button  className="bg-orange-500 w-8  h-8 rounded-full flex justify-center items-center text-white font-bold text-xl cursor-pointer hover:bg-orange-600 transition"
                            onClick={() => {
                                setQuantity(quantity + 1)}
                            }
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="border-b border-orange-400 p-3 pb-5 mb-2">
                    {
                        item.addOns && (

                            <div>
                                <h2 className="font-bold text-lg">
                                    Add-On Options
                                </h2>

                                {(item.addOns.map(addOn => (
                                    addOn &&
                                    (
                                        <div key={addOn.id} className="mt-2 flex items-center">
                                            <input className="accent-orange-500 h-5 w-5" type="checkbox" value={addOn.name}></input>
                                            <label className="ml-2">{addOn.name}</label>
                                        </div>

                                    )
                                )))}

                            </div>
                        )
                    }
                </div>
                <div className="p-3">
                    <h2 className="font-bold text-lg mb-1">Special Instructions</h2>
                    <textarea className="border border-gray-400 rounded-md w-full h-30 p-3" placeholder="Add a note (e.g. No ice, extra spicy)"></textarea>
                </div>

                <button className="w-full bg-orange-500 text-white font-bold py-3 px-10 rounded-lg hover:bg-orange-600 transition cursor-pointer">
                    Add to Cart
                </button>
            </div>
        </div>
    )
}