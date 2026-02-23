const restaurants = [
    {
        id: 1,
        name: "Mamak Bistro",
        slug: "mamak-bistro",
        address: "Jalan Ipoh, Kuala Lumpur",
        isApproved: true
    },
    {
        id: 2,
        name: "Nasi Kandar Pelita",
        slug: "nasi-kandar-pelita",
        address: "Jalan Ampang, Kuala Lumpur",
        isApproved: true
    }
]

const menuItems = [
    // Mamak Bistro menu
    { id: 1, restaurantId: 1, name: "Roti Canai", category: "Bread", price: 3, description: "Crispy flatbread with dhal curry", isAvailable: true },
    { id: 2, restaurantId: 1, name: "Teh Tarik", category: "Drinks", price: 3.5, description: "Classic pulled milk tea", isAvailable: true },
    { id: 3, restaurantId: 1, name: "Mee Goreng Mamak", category: "Noodles", price: 10, description: "Spicy fried noodles with egg", isAvailable: true },
    { id: 4, restaurantId: 1, name: "Maggi Goreng", category: "Noodles", price: 8, description: "Fried instant noodles mamak style", isAvailable: true },

    // Nasi Kandar Pelita menu
    { id: 5, restaurantId: 2, name: "Nasi Kandar", category: "Rice", price: 12, description: "Rice with curry and mixed sides", isAvailable: true },
    { id: 6, restaurantId: 2, name: "Ayam Goreng", category: "Chicken", price: 8, description: "Crispy fried chicken", isAvailable: true },
    { id: 7, restaurantId: 2, name: "Teh Ais", category: "Drinks", price: 3, description: "Iced milk tea", isAvailable: true },
    { id: 8, restaurantId: 2, name: "Dhal Curry", category: "Sides", price: 5, description: "Slow cooked lentil curry", isAvailable: true },
]

const tables = [
    { id: 1, restaurantId: 1, tableNumber: 1 },
    { id: 2, restaurantId: 1, tableNumber: 2 },
    { id: 3, restaurantId: 1, tableNumber: 3 },
    { id: 4, restaurantId: 2, tableNumber: 1 },
    { id: 5, restaurantId: 2, tableNumber: 2 },
]

let orders = []

module.exports = { restaurants, menuItems, tables, orders }