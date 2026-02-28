// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Restaurant, MenuItem, CartItem } from '@/types'
import MenuCard from '@/components/MenuCard'

export default function RestaurantPage() {
    const { slug } = useParams<{ slug: string }>()
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
    const [menu, setMenu] = useState<MenuItem[]>([])
    const [cart, setCart] = useState<CartItem[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        fetch(`http://localhost:5001/api/menu/${slug}`)
            .then(res => res.json())
            .then(data => {
                setRestaurant(data.restaurant)
                setMenu(data.menu)
                setLoading(false)
            })
    }, [slug])

    const addToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id)
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
            }
            return [...prev, { ...item, quantity: 1 }]
        })
    }

    const removeFromCart = (itemId: number) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === itemId)
            if (!existing) return prev
            if (existing.quantity === 1) {
                return prev.filter(i => i.id !== itemId)
            }
            return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i)
        })
    }

    const getQuantity = (itemId: number): number => {
        const item = cart.find(i => i.id === itemId)
        return item ? item.quantity : 0
    }

    const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

    const categories = [...new Set(menu.map(item => item.category))]

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Loading menu...</p>
        </div>
    )

    if (!restaurant) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Restaurant not found</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 pb-32">

            {/* Restaurant Header */}
            <div className="bg-black text-white p-6">
                <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                <p className="text-gray-400 text-sm mt-1">{restaurant.address}</p>
            </div>

            {/* Menu grouped by category */}
            <div className="max-w-2xl mx-auto p-4 space-y-8">
                {categories.map(category => (
                    <div key={category}>
                        <h2 className="text-lg font-bold mb-3 text-gray-700">{category}</h2>
                        <div className="space-y-3">
                            {menu.filter(item => item.category === category).map(item => 
                            <MenuCard
                                key={item.id}
                                item={item}
                                quantity={getQuantity(item.id)}
                                onAdd={addToCart}
                                onRemove={removeFromCart}
                            />)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sticky Cart Bar */}
            {cartCount > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
                    <div className="max-w-2xl mx-auto">
                        <button className="w-full bg-black text-white py-3 rounded-xl font-semibold flex justify-between items-center px-4 hover:bg-gray-800 transition">
                            <span className="bg-gray-700 text-white text-sm px-2 py-0.5 rounded-full">{cartCount}</span>
                            <span>View Cart</span>
                            <span>RM {cartTotal.toFixed(2)}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
