const menuItems = [
    { id: 1, name: "Nasi Lemak", category: "Rice", price: 12, description: "Fragrant rice with sambal, anchovies, egg and peanuts" },
    { id: 2, name: "Mee Goreng Mamak", category: "Noodles", price: 10, description: "Spicy fried noodles with egg and vegetables" },
    { id: 3, name: "Roti Canai", category: "Bread", price: 3, description: "Crispy flatbread served with dhal curry" },
    { id: 4, name: "Teh Tarik", category: "Drinks", price: 3.5, description: "Classic pulled milk tea" },
    { id: 5, name: "Ayam Goreng", category: "Chicken", price: 8, description: "Crispy fried chicken with secret spices" },
  ]
  
  let orders = []
  
  module.exports = { menuItems, orders }  // ← make sure this line exists