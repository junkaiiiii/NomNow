export type Restaurant = {
    id: number
    name: string
    slug: string
    address: string
    isApproved: boolean
}

export type MenuItem = {
    id: number
    restaurantId: number
    name: string
    description: string
    price: number
    category: string
    isAvailable: boolean
}

export type CartItem = MenuItem & {
    quantity: number
}

export type OrderItem = {
    menuItem: MenuItem
    quantity: number
    subtotal: number
}

export type Order = {
    id: number
    restaurantId: number
    tableId: number
    customerName: string
    items: OrderItem[]
    total: number
    status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered'
    createdAt: string
}