'use client'

import { useState } from 'react'
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
    const [cart, setCart] = useState<CartItem[]>([])
    const searchParams = useSearchParams()
    const tableNumber = searchParams.get('table')


    //helper functions
    function addToCart(item: MenuItem) {
        setCart(prev => {
            const existing = prev.find(ci => ci.id === item.id)

            if (existing) {
                return prev.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci)
            }

            return [...prev, { ...item, quantity: 1 }]
        })
    }

    function removeFromCart(itemId: number) {
        setCart(prev => {
            const existing = prev.find(i => i.id === itemId)
            if (!existing) {
                return prev
            }

            if (existing.quantity === 1) {
                return prev.filter(i => i.id !== itemId)
            }

            return prev.map(ci => ci.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci)

        })
    }

    function getQuantity(itemId: number) {
        const item = cart.find(i => i.id === itemId)
        return item ? item.quantity : 0
    }

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
            total += item.price * item.quantity
        });

        return total
    }



    const categories = [...new Set(menu.map(item => item.category))]


    return (
        <>

            <div className="min-h-screen bg-gray-50 pb-32">
                <div className="max-w-2xl mx-auto px-4 py-30 space-y-8 ">
                    <RestaurantHeader
                        name={restaurant.name}
                        address={restaurant.address}
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

                    <CartBar
                        cartQuantity={getCartQuantity()}
                        totalAmount={getTotalAmount()}
                        tableNumber={tableNumber}
                    />
                </div>
            </div>
        </>


    )
}