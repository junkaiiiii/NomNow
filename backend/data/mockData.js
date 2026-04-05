const restaurants = [
  {
    id: '1',
    name: 'Mamak Bistro',
    slug: 'mamak-bistro',
    address: 'Jalan Ipoh, Kuala Lumpur',
    isApproved: true,
    taxConfig: {
      sst: 0.06,
      serviceTax: 0.1,
      sstInclusive: true
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
      sstInclusive: true
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
      sstInclusive: true
    }
  }
]

const CATEGORY_ADD_ONS = {
  drinks: [
    { id: "less-ice", name: "Less Ice", price: 0 },
    { id: "extra-milk", name: "Extra Milk", price: 1 },
    { id: "extra-shot", name: "Extra Shot", price: 2 },
  ],
  noodles: [
    { id: "extra-egg", name: "Extra Egg", price: 1.5 },
    { id: "extra-sambal", name: "Extra Sambal", price: 1 },
    { id: "add-cheese", name: "Add Cheese", price: 2 },
  ],
  bread: [
    { id: "double-curry", name: "Double Curry", price: 1.5 },
    { id: "extra-dhal", name: "Extra Dhal", price: 1 },
    { id: "add-egg", name: "Add Egg", price: 1.5 },
  ],
  rice: [
    { id: "extra-rice", name: "Extra Rice", price: 2 },
    { id: "extra-curry", name: "Extra Curry", price: 1.5 },
    { id: "add-egg", name: "Add Egg", price: 1.5 },
  ],
}

const baseMenuItems = [
  // Mamak Bistro menu
  { id: '1', restaurantId: '1', name: "Roti Canai", category: "Bread", price: 3, description: "Crispy flatbread with dhal curry", isAvailable: true, imageUrl: 'https://www.theflavorbender.com/wp-content/uploads/2021/09/Roti-Canai-6501-2.jpg' },
  { id: '2', restaurantId: '1', name: "Teh Tarik", category: "Drinks", price: 3.5, description: "Classic pulled milk tea", isAvailable: true, imageUrl: 'https://www.theflavorbender.com/wp-content/uploads/2021/09/Roti-Canai-6501-2.jpg' },
  { id: '3', restaurantId: '1', name: "Mee Goreng Mamak", category: "Noodles", price: 10, description: "Spicy fried noodles with egg", isAvailable: true, imageUrl: 'https://www.theflavorbender.com/wp-content/uploads/2021/09/Roti-Canai-6501-2.jpg' },
  { id: '4', restaurantId: '1', name: "Maggi Goreng", category: "Noodles", price: 8, description: "Fried instant noodles mamak style", isAvailable: true, imageUrl: 'https://www.theflavorbender.com/wp-content/uploads/2021/09/Roti-Canai-6501-2.jpg' },

  // Nasi Kandar Pelita menu
  { id: '5', restaurantId: '2', name: "Nasi Kandar", category: "Rice", price: 12, description: "Rice with curry and mixed sides", isAvailable: true, imageUrl: 'https://www.theflavorbender.com/wp-content/uploads/2021/09/Roti-Canai-6501-2.jpg' },
  { id: '6', restaurantId: '2', name: "Ayam Goreng", category: "Chicken", price: 8, description: "Crispy fried chicken", isAvailable: true, imageUrl: 'https://www.theflavorbender.com/wp-content/uploads/2021/09/Roti-Canai-6501-2.jpg' },
  { id: '7', restaurantId: '2', name: "Teh Ais", category: "Drinks", price: 3, description: "Iced milk tea", isAvailable: true, imageUrl: 'https://www.theflavorbender.com/wp-content/uploads/2021/09/Roti-Canai-6501-2.jpg' },
  { id: '8', restaurantId: '2', name: "Dhal Curry", category: "Sides", price: 5, description: "Slow cooked lentil curry", isAvailable: true, imageUrl: 'https://www.theflavorbender.com/wp-content/uploads/2021/09/Roti-Canai-6501-2.jpg' },
]

const menuItems = baseMenuItems.map((item) => ({
  ...item,
  addOns: CATEGORY_ADD_ONS[item.category.toLowerCase()] ?? [],
}))

const tables = [
  { id: '1', restaurantId: '1', tableNumber: 1, currentSessionId: '1' },
  { id: '2', restaurantId: '1', tableNumber: 2, currentSessionId: '1' },
  { id: '3', restaurantId: '1', tableNumber: 3, currentSessionId: 'abc123' },
  { id: '4', restaurantId: '2', tableNumber: 1, currentSessionId: 'abc' },
  { id: '5', restaurantId: '2', tableNumber: 2, currentSessionId: '1' },
]

let orders = [

]



const tableSessions = [
  {
    id: 'abc123',
    tableId: 3,
    tableNumber: 3,
    restaurantId: 1,
    status: 'active',
    createdAt: new Date()
  },
  {
    id: 'abc',
    tableId: 4,
    tableNumber: 2,
    restaurantId: 1,
    status: 'active',
    createdAt: new Date()
  }
]

const users = [
  {
    username: 'admin',
    password: 'admin123',
  },
  {
    username: 'mamak-bistro',
    password: 'mamakbistro123',
  }
]

module.exports = {
  restaurants,
  menuItems,
  tables,
  orders,
  tableSessions,
  CATEGORY_ADD_ONS,
  users
}
