'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useSearchParams } from 'next/navigation'
import { Restaurant, MenuItem, ItemCustomization, CartItem } from '@/types'
import { useRouter } from 'next/navigation'
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
    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

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

    function removeOneItem(itemId: string) {
        const plainLine = cart.find((line) =>
            line.menuItemId === itemId
            && line.selectedAddOns.length === 0
            && !line.preference.trim()
        )
        const fallbackLine = cart.find((line) => line.menuItemId === itemId)
        const targetLine = plainLine ?? fallbackLine

        if (targetLine) {
            decrementCartItem(targetLine.id)
        }
    }

    function openItemDetail(item: MenuItem) {
        setSelectedItem(item)
        setIsDetailOpen(true)
    }

    function closeItemDetail() {
        setIsDetailOpen(false)
        setSelectedItem(null)
    }

    function addCustomizedItem(customization: ItemCustomization) {
        if (!selectedItem) return
        addToCart(selectedItem, customization)
        closeItemDetail()
    }

    // add at menu client instead of here :>
  function handleAddItem(item: MenuItem){
    if (cart.some(line => line.menuItemId === item.id )){
        // comfirmation popup if item already in cart
        return
    }
        // navigate to item detail page for customization
        router.push(`/r/${restaurant.slug}/item/${item.id}`) 
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
                                        onRemove={removeOneItem}
                                        onOpenDetail={openItemDetail}
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
