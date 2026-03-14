export type TaxConfig = {
    sst: number //rate
    serviceTax: number //rate
    sstInclusive: boolean
}

export type Restaurant = {
    id: string
    name: string
    slug: string
    address: string
    isApproved: boolean
    taxConfig: TaxConfig
}

export type MenuItem = {
    id: string
    restaurantId: string | number
    name: string
    description: string
    price: number
    category: string
    isAvailable: boolean
    addOns?: AddOnOption[]
    imageUrl: string
}

export type AddOnOption = {
    id: string
    name: string
    price: number
}

export type ItemCustomization = {
    selectedAddOns: AddOnOption[]
    preference: string
}

export type CartItem = Omit<MenuItem, "id" | "price"> & ItemCustomization & {
    id: string // cart line id
    menuItemId: string
    basePrice: number
    unitPrice: number
    quantity: number
}

export type OrderItem = {
    menuItem: MenuItem
    quantity: number
    unitPrice?: number
    selectedAddOns?: AddOnOption[]
    preference?: string
    subtotal: number
}

export type Order = {
    id: string
    restaurantId: string
    tableNumber: number
    items: OrderItem[]
    status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered'
    createdAt: string
    sstAmount: number
    serviceTaxAmount: number
    subtotal: number //subtotal = total without tax
    total: number //total = sum(sst,serviceTax,subtotal)
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
