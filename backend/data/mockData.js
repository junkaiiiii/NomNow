const restaurants = [
    {
      id: '1',
      name: 'Mamak Bistro',
      slug: 'mamak-bistro',
      address: 'Jalan Ipoh, Kuala Lumpur',
      isApproved: true,
      taxConfig: {
        sst: 0,           
        serviceTax: 0,    
        taxInclusive: false  
      }
    },
    {
      id: '2', 
      name: 'Nasi Kandar Pelita',
      slug: 'nasi-kandar-pelita',
      address: 'Jalan Ampang, Kuala Lumpur',
      isApproved: true,
      taxConfig: {
        sst: 0.06,        
        serviceTax: 0.10,   
        taxInclusive: false
      }
    },
    {
      id: '3',
      name: 'Chilis Restaurant',
      slug: 'chilis',
      address: 'KLCC, Kuala Lumpur',
      isApproved: true,
      taxConfig: {
        sst: 0.06,
        serviceTax: 0.10,
        taxInclusive: true  
      }
    }
  ]

const menuItems = [
    // Mamak Bistro menu
    { id: '1', restaurantId: '1', name: "Roti Canai", category: "Bread", price: 3, description: "Crispy flatbread with dhal curry", isAvailable: true },
    { id: '2', restaurantId: '1', name: "Teh Tarik", category: "Drinks", price: 3.5, description: "Classic pulled milk tea", isAvailable: true },
    { id: '3', restaurantId: '1', name: "Mee Goreng Mamak", category: "Noodles", price: 10, description: "Spicy fried noodles with egg", isAvailable: true },
    { id: '4', restaurantId: '1', name: "Maggi Goreng", category: "Noodles", price: 8, description: "Fried instant noodles mamak style", isAvailable: true },

    // Nasi Kandar Pelita menu
    { id: '5', restaurantId: '2', name: "Nasi Kandar", category: "Rice", price: 12, description: "Rice with curry and mixed sides", isAvailable: true },
    { id: '6', restaurantId: '2', name: "Ayam Goreng", category: "Chicken", price: 8, description: "Crispy fried chicken", isAvailable: true },
    { id: '7', restaurantId: '2', name: "Teh Ais", category: "Drinks", price: 3, description: "Iced milk tea", isAvailable: true },
    { id: '8', restaurantId: '2', name: "Dhal Curry", category: "Sides", price: 5, description: "Slow cooked lentil curry", isAvailable: true },
]

const tables = [
    { id: '1', restaurantId: '1', tableNumber: 1, currentSessionId: '1' },
    { id: '2', restaurantId: '1', tableNumber: 2, currentSessionId: '1' },
    { id: '3', restaurantId: '1', tableNumber: 3, currentSessionId: 'abc123' },
    { id: '4', restaurantId: '2', tableNumber: 1, currentSessionId: '1' },
    { id: '5', restaurantId: '2', tableNumber: 2, currentSessionId: '1' },
]

let orders = [
    {
        id: '1',
        restaurantId: '1',
        table: 3,
        items: [
            {
                menuItem: {
                    id: '2',
                    restaurantId: '1',
                    name: "Teh Tarik",
                    category: "Drinks",
                    price: 3.5,
                    description: "Classic pulled milk tea",
                    isAvailable: true
                },
                quantity: 4,
                subtotal: 14
            }
        ],
        total: 14,
        status: "Pending",
        createdAt: "2026-02-25T10:34:48.440Z"
    },

    {
        id: '2',
        restaurantId: '1',
        table: 3,
        items: [
            {
                menuItem: {
                    id: '2',
                    restaurantId: '1',
                    name: "Teh Tarik",
                    category: "Drinks",
                    price: 3.5,
                    description: "Classic pulled milk tea",
                    isAvailable: true
                },
                quantity: 4,
                subtotal: 14
            }
        ],
        total: 14,
        status: "Pending",
        createdAt: "2026-02-25T10:34:48.440Z"
    },
    {
        id: '3',
        restaurantId: '1',
        table: 3,
        items: [
            {
                menuItem: {
                    id: '1',
                    restaurantId: '1',
                    name: "Roti Canai",
                    category: "Bread",
                    price: 3,
                    description: "Crispy flatbread with dhal curry",
                    isAvailable: true
                },
                quantity: 3,
                subtotal: 9
            }
        ],
        total: 9,
        status: "Pending",
        createdAt: "2026-02-25T10:34:52.483Z"
    },
    {
        id: '4',
        restaurantId: '1',
        table: 3,
        items: [
            {
                menuItem: {
                    id: '4',
                    restaurantId: '1',
                    name: "Maggi Goreng",
                    category: "Noodles",
                    price: 8,
                    description: "Fried instant noodles mamak style",
                    isAvailable: true
                },
                quantity: 3,
                subtotal: 24
            }
        ],
        total: 24,
        status: "Pending",
        createdAt: "2026-02-25T10:34:55.783Z"
    },
    {
        id: '5',
        restaurantId: '1',
        table: 3,
        items: [
            {
                menuItem: {
                    id: '3',
                    restaurantId: '1',
                    name: "Mee Goreng Mamak",
                    category: "Noodles",
                    price: 10,
                    description: "Spicy fried noodles with egg",
                    isAvailable: true
                },
                quantity: 1,
                subtotal: 10
            }
        ],
        total: 10,
        status: "Pending",
        createdAt: "2026-02-25T10:34:59.186Z"
    }
]



const tableSessions = [
    {
        id: 'abc123',
        tableId: 3,
        tableNumber: 3,
        restaurantId: 1,
        status: 'active',
        createdAt: new Date()
    }
]

module.exports = { restaurants, menuItems, tables, orders, tableSessions }