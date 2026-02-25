'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useSearchParams } from 'next/navigation'
import { Restaurant, MenuItem, CartItem } from '@/app/types'
import MenuCard from '@/components/MenuCard'
import RestaurantHeader from '@/components/RestaurantHeader'
import CartBar from '@/components/CartBar'

type Props = {
    restaurant: Restaurant
    menu: MenuItem[]
}

export default function MenuClient({ restaurant, menu }: Props) {
    const searchParams = useSearchParams()
    const tableNumber = searchParams.get('table')

    const { cart, addToCart, removeFromCart, setTable, clearTable } = useCartStore()

    useEffect(() => {
        if (tableNumber) {
            setTable(tableNumber, restaurant)
        } else {
            clearTable();
        }
    }, [tableNumber, restaurant])

    function getQuantity(itemId: number) {
        const item = cart.find(i => i.id === itemId)
        return item ? item.quantity : 0
    }

    const categories = [...new Set(menu.map(item => item.category))]


    return (
        <>

            <div className="min-h-screen bg-gray-50 pb-32">
                <div className="max-w-2xl mx-auto px-4 py-30 space-y-8 ">
                    <RestaurantHeader
                        name={restaurant.name}
                        address={restaurant.address}
                        goBack={false}
                    />
                    {categories.map(cat => (
                        <div key={cat}>
                            <h2 className='text-lg font-bold mb-3'>{cat}</h2>
                            <div className="space-y-3">
                                {menu.filter(item => item.category === cat).map(item => (
                                    // item, quantity, onAdd, onRemove
                                    <MenuCard
                                        key={item.id}
                                        item={item}
                                        quantity={getQuantity(item.id)}
                                        onAdd={addToCart}
                                        onRemove={removeFromCart}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                    }

                    <CartBar />
                </div>
            </div>
        </>


    )
}