'use client'

import GeneralHeader from "@/components/GeneralHeader"
import { useEffect, useState } from "react"
import { useCartStore } from "@/store/cartStore"
import { useRouter } from "next/navigation"
import { MenuItem, AddOnOption, CartItem } from "@/types"
import { buildCustomizationSignature } from "@/lib/itemCustomization"

type Props = {
    item: MenuItem
    existingSignature?: string
}

export default function ItemDetailClient({ item, existingSignature }: Props) {
    const { tableNumber, restaurant, cart, addToCart, incrementCartItem, decrementCartItem, removeCartItem } = useCartStore();
    const [initialLine, setInitialLine] = useState<CartItem | null>(null);
    const [quantity, setQuantity] = useState<number>(0);
    const [addOns, setAddOns] = useState<AddOnOption[]>([]);
    const [preference, setPreference] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const router = useRouter();

    // export type ItemCustomization = {
    //     selectedAddOns: AddOnOption[]
    //     preference: string
    // }

    useEffect(() => {
        const initialLine = cart.find(line => buildCustomizationSignature(line.menuItemId, { selectedAddOns: line.selectedAddOns ?? [], preference: line.preference ?? "" }) === existingSignature);

        if (initialLine) {
            console.log('found')
            setAddOns(initialLine.selectedAddOns ?? []);
            setPreference(initialLine.preference ?? "");
            setInitialLine(initialLine);
        } else {
            console.log('not found')            
        }
        const initialQuantity = initialLine ? initialLine.quantity : 0;
        setQuantity(initialQuantity);
    }, [cart, existingSignature])

    console.log("existing esignature:",existingSignature)
    console.log("cart:", cart);

    for (const line of cart) {
        console.log("line signature:", buildCustomizationSignature(line.menuItemId, { selectedAddOns: line.selectedAddOns ?? [], preference: line.preference ?? "" }))
    }

    console.log("initial line:", initialLine);
    console.log("initial addons:",initialLine?.selectedAddOns, addOns);

    function handleAddtoCart() {
        const customization = {
            selectedAddOns: addOns,
            preference: preference,
        }

        console.log('customization:', customization)
        const signature = buildCustomizationSignature(item.id, customization)
        if (existingSignature) {

            if (signature === existingSignature) {
                // update existing cart item
                console.log('updating existing item quantity')
                const existingLine = cart.find(line => buildCustomizationSignature(line.menuItemId, {
                    selectedAddOns: line.selectedAddOns ?? [],
                    preference: line.preference ?? "",
                }) === existingSignature);
                if (existingLine) {
                    const quantityDiff = quantity - existingLine.quantity;
                    if (quantityDiff > 0) {
                        for (let i = 0; i < quantityDiff; i++) {
                            incrementCartItem(existingLine.id);
                        }
                    } else if (quantityDiff < 0) {
                        for (let i = 0; i < -quantityDiff; i++) {
                            decrementCartItem(existingLine.id);
                        }
                    }
                }
            }
            else{
                // customization changed, remove old item and add new item
                const existingLine = cart.find(line => buildCustomizationSignature(line.menuItemId, {
                    selectedAddOns: line.selectedAddOns ?? [],
                    preference: line.preference ?? "",
                }) === existingSignature);
                if (existingLine) {
                    removeCartItem(existingLine.id);
                }
                for (let i = 0; i < quantity; i++) {
                    addToCart(item, customization);
                }
            }

        } else {
            // add new cart item
            console.log('new item')
            for (let i = 0; i < quantity; i++) {
                addToCart(item, customization);
            }
        }


    }

    console.log(addOns);

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <div className="max-w-2xl mx-auto px-4 py-30 space-y-8 ">
                <GeneralHeader 
                    title={item.name}
                    subtitle={item.description}
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
                                if (quantity > 0) {
                                    setQuantity(quantity - 1)
                                }
                            }}
                        >
                            -
                        </button>
                        <h2>{quantity}</h2>
                        <button className="bg-orange-500 w-8  h-8 rounded-full flex justify-center items-center text-white font-bold text-xl cursor-pointer hover:bg-orange-600 transition"
                            onClick={() => {
                                setQuantity(quantity + 1)
                            }
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
                                            <input className=" h-5 w-5" type="checkbox" value={addOn.name}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setAddOns([...addOns, addOn])
                                                    } else {
                                                        setAddOns(addOns.filter(a => a.id !== addOn.id))
                                                    }
                                                }}
                                                checked={addOns.some(a => a.id === addOn.id)}
                                            ></input>
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
                    <textarea className="border border-gray-400 rounded-md w-full h-30 p-3" placeholder="Add a note (e.g. No ice, extra spicy)"
                        onInput={(e) => {
                            setPreference(e.currentTarget.value)
                        }}
                        value={preference}
                    ></textarea>
                </div>

                <button className={`w-full ${quantity===0 ? 'bg-gray-500' : 'bg-orange-500'} text-white font-bold py-3 px-10 rounded-lg hover:bg-orange-600 transition cursor-pointer`}
                    disabled={quantity === 0}
                    onClick={() => {
                        handleAddtoCart();
                        setSubmitting(true);
                        setTimeout(() => {
                            setSubmitting(false);
                            router.push(`/r/${restaurant?.slug}?table=${tableNumber}`);
                        }, 250); 
                        // small delay to show the "Updating Cart..." overlay, since the cart update is instantaneous in this implementation. In a real implementation with async API calls, you would set submitting to false after the API call completes.
                    }}
                >
                    {
                        existingSignature ? "Update Cart Item" : "Add to Cart"
                    }
                </button>

                {submitting && (
                    <div
                        className="fixed inset-0 flex justify-center items-center"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    >
                        <div className="bg-white rounded-lg p-5">
                            <h2 className="text-lg font-bold">Updating Cart...</h2>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}