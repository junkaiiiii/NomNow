'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useSearchParams } from 'next/navigation'
import { Restaurant, MenuItem, ItemCustomization, CartItem } from '@/types'
import { useRouter } from 'next/navigation'
import RestaurantHeader from '@/components/RestaurantHeader'
import CartBar from '@/components/CartBar'
import ItemCustomizationChoice from '@/components/ItemCustomizationChoice'

type Props = {
    restaurant: Restaurant
    menu: MenuItem[]
}

export default function MenuClient({ restaurant, menu }: Props) {
    const searchParams = useSearchParams()
    const tableNumber = searchParams.get('table')
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [selectedItemId, setSelectedItemId] = useState<string>('')
    const [showExistingCustomization, setShowExistingCustomization] = useState<boolean>(false)


    const { cart, addToCart, decrementCartItem, setTable, clearTable } = useCartStore()

    useEffect(() => {
        if (tableNumber) {
            setTable(tableNumber, restaurant)
        } else {
            clearTable();
        }
    }, [tableNumber, restaurant])


    function getQuantity(itemId: string) {
        return cart
            .filter((line) => line.menuItemId === itemId)
            .reduce((sum, line) => sum + line.quantity, 0)
    }



    // add at menu client instead of here :>
    function handleAddItem(item: MenuItem) {
        if (cart.some(line => line.menuItemId === item.id)) {
            // existing customization options if item already in cart
            setSelectedItemId(item.id)
            setShowExistingCustomization(true)
            return
        }
        // navigate to item detail page for customization
        router.push(`/r/${restaurant.slug}/item/${item.id}`)
    }

    function handleRemoveItem(itemId: string) {
        // if (cart.some(line => line.menuItemId === itemId)) {
        //     // comfirmation popup if item already in cart
        //     setSelectedItemId(itemId)
        //     setShowExistingCustomization(true)
        //     return
        // }
        console.log("Removing item with id:", itemId)
        let customizationGroupCount = 0
        cart.forEach(line => {
            if (line.menuItemId === itemId) {
                customizationGroupCount += 1
            }
        })
        console.log(customizationGroupCount);

        if (customizationGroupCount > 1) {
            // comfirmation popup if item already in cart
            setSelectedItemId(itemId)
            setShowExistingCustomization(true)
            return
        }
        console.log("No need to show customization choice, directly decrementing")
        decrementCartItem(cart.find(line => line.menuItemId === itemId)?.id || '')
    }

    const categories = [...new Set(menu.map(item => item.category))]

    console.log(cart)
    console.log(selectedItemId)


    return (
        <>

            <div className="min-h-screen bg-gray-50 ">
                <div className="max-w-2xl mx-auto px-4 py-30 space-y-8">
                    <RestaurantHeader
                        restaurant={restaurant}
                        goBack={false}
                    />
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                            className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === '' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 shadow-sm'}`}
                            onClick={() => setSelectedCategory('')}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === cat ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 shadow-sm'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {(selectedCategory === '' ? categories : [selectedCategory]).map(cat => (
                        <div key={cat}>
                            <h2 className='text-lg font-bold mb-3'>{cat}</h2>
                            <div className="space-y-3">
                                {menu.filter(item => item.category === cat).map(item => (
                                    <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">

                                        <button
                                            type="button"
                                            className="flex flex-1 justify-start items-center space-x-5 text-left"
                                            onClick={() => handleAddItem(item)}
                                        >
                                            <div className=''>
                                                <img
                                                    className='w-20 h-20 rounded-md object-cover'
                                                    src={item.imageUrl}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{item.name}</h3>
                                                <p className="text-gray-500 text-sm mt-0.5">{item.description}</p>
                                                <p className="text-black font-bold mt-1">RM {item.price.toFixed(2)}</p>
                                            </div>
                                        </button>

                                        <div className="flex items-center gap-2 ml-4">
                                            {getQuantity(item.id) > 0 ? (
                                                <>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="w-8 h-8 rounded-full bg-white text-orange-500 font-bold hover:bg-orange-200 transition"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-4 text-center font-semibold">{getQuantity(item.id)}</span>
                                                    <button
                                                        onClick={() => handleAddItem(item)}
                                                        className="w-8 h-8 rounded-full bg-white text-orange-500 font-bold hover:bg-orange-200 transition flex justify-center items-center"
                                                    >
                                                        +
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleAddItem(item)}
                                                    className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition"
                                                >
                                                    +
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                    }


                    <CartBar />
                    <ItemCustomizationChoice
                        itemId={selectedItemId}
                        isShow={showExistingCustomization}
                        onClose={() => setShowExistingCustomization(false)}
                    />


                </div>
            </div>
        </>


    )
}
