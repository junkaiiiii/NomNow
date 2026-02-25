import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, MenuItem, Restaurant } from "@/app/types"

type CartStore = {
    cart: CartItem[]
    tableNumber: string | null
    restaurant: Restaurant | null

    setTable: (table: string, restaurant: Restaurant) => void
    addToCart: (item: MenuItem) => void
    removeFromCart: (itemId: number) => void
    clearCart: () => void
    clearTable: () => void
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            cart: [],
            tableNumber: null,
            restaurant: null,

            setTable: (table, restaurant) => set({ tableNumber: table, restaurant: restaurant }),

            addToCart: (item) => set((state) => {
                const existing = state.cart.find(ci => ci.id === item.id)

                if (existing) {
                    return { cart: state.cart.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci) }
                }

                return { cart: [...state.cart, { ...item, quantity: 1 }] }
            }),



            removeFromCart: (itemId) => set((state) => {
                const existing = state.cart.find(i => i.id === itemId)
                if (!existing) return state
                if (existing.quantity === 1) {
                    return { cart: state.cart.filter(i => i.id !== itemId) }
                }
                return {
                    cart: state.cart.map(i =>
                        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
                    )
                }
            }),

            clearCart: () => set({ cart: [], tableNumber: null, restaurant: null }),

            clearTable: () => set({tableNumber:null})
        }),
        {
            name: 'nomnow-cart', // localStorage key
          }
    )
)

// //helper functions
// function addToCart(item: MenuItem) {
//     setCart(prev => {
//         const existing = prev.find(ci => ci.id === item.id)

//         if (existing) {
//             return prev.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci)
//         }

//         return [...prev, { ...item, quantity: 1 }]
//     })
// }