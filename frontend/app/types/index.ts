export type taxConfig = {
    sst: number //rate
    serviceTax: number //rate
    taxInclusive: boolean
}

export type Restaurant = {
    id: string
    name: string
    slug: string
    address: string
    isApproved: boolean
    taxConfig: taxConfig
}

export type MenuItem = {
    id: string
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
    id: string
    restaurantId: string
    tableNumber: number
    items: OrderItem[]
    total: number
    status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered'
    createdAt: string
}

export type Table = {
    id: string
    restaurantId: string
    tableNumber: number
    currentSessionId: string
}


export type TableSession = {
    id: string        // ← UUID/CUID, this goes in the QR code
    tableId: string
    restaurantId: string
    tableNumber: number
    status: 'active' | 'billed' | 'closed'
    createdAt: string
    closedAt: string | null
  }

// const tableSessions = [
//     { 
//       id: 'abcstring
//       tableId: 1, 
//       tableNumber: 1,
//       restaurantId: 1, 
//       status: 'active',
//       createdAt: new Date()
//     }
//   ]