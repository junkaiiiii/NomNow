import 'dotenv/config'
import prisma from '../lib/prisma'

async function main() {
  console.log('Seeding database...')

  // Create restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'Mamak Bistro',
      slug: 'mamak-bistro',
      address: 'Jalan Ipoh, Kuala Lumpur',
      isApproved: true,
      sst: 0,
      serviceTax: 0,
      sstInclusive: false,
      menuItems: {
        create: [
          {
            name: 'Teh Tarik',
            description: 'Classic pulled milk tea',
            price: 3.5,
            category: 'Drinks',
            isAvailable: true,
            imageUrl: '',
            preferenceHints: ['Less Sweet', 'No Sugar', 'Hot', 'Iced'],
            addOns: {
              create: [
                { name: 'Extra Thick', price: 0.50 },
                { name: 'Jumbo Size', price: 1.00 },
              ]
            }
          },
          {
            name: 'Roti Canai',
            description: 'Crispy flatbread with dhal curry',
            price: 3,
            category: 'Bread',
            isAvailable: true,
            imageUrl: '',
            preferenceHints: ['Extra Crispy', 'Less Oil'],
            addOns: {
              create: [
                { name: 'Extra Dhal', price: 0.50 },
                { name: 'Curry Chicken', price: 2.00 },
              ]
            }
          },
          {
            name: 'Mee Goreng Mamak',
            description: 'Spicy fried noodles with egg',
            price: 10,
            category: 'Noodles',
            isAvailable: true,
            imageUrl: '',
            preferenceHints: ['Less Spicy', 'No Spicy', 'Extra Spicy'],
            addOns: {
              create: [
                { name: 'Extra Egg', price: 1.50 },
                { name: 'Extra Meat', price: 3.00 },
              ]
            }
          },
          {
            name: 'Maggi Goreng',
            description: 'Fried instant noodles mamak style',
            price: 8,
            category: 'Noodles',
            isAvailable: true,
            imageUrl: '',
            preferenceHints: ['Less Spicy', 'Extra Spicy'],
            addOns: {
              create: [
                { name: 'Extra Egg', price: 1.50 },
              ]
            }
          },
        ]
      },
      tables: {
        create: [
          { tableNumber: 1 },
          { tableNumber: 2 },
          { tableNumber: 3 },
          { tableNumber: 4 },
          { tableNumber: 5 },
        ]
      }
    }
  })

  console.log(`✅ Created restaurant: ${restaurant.name}`)

  // Create second restaurant
  const restaurant2 = await prisma.restaurant.create({
    data: {
      name: 'Nasi Kandar Pelita',
      slug: 'nasi-kandar-pelita',
      address: 'Jalan Ampang, Kuala Lumpur',
      isApproved: true,
      sst: 0.06,
      serviceTax: 0.10,
      sstInclusive: false,
      menuItems: {
        create: [
          {
            name: 'Nasi Kandar',
            description: 'Rice with curry and mixed sides',
            price: 12,
            category: 'Rice',
            isAvailable: true,
            imageUrl: '',
            preferenceHints: ['Less Gravy', 'Extra Gravy'],
            addOns: {
              create: [
                { name: 'Ayam Goreng', price: 4.00 },
                { name: 'Telur Separuh Masak', price: 1.50 },
              ]
            }
          },
          {
            name: 'Teh Ais',
            description: 'Iced milk tea',
            price: 3,
            category: 'Drinks',
            isAvailable: true,
            imageUrl: '',
            preferenceHints: ['Less Sweet', 'No Ice'],
            addOns: {
                create: [
                    { name: 'Extra Sweet', price: 0.50 },
                    { name: 'Lemon Slice', price: 0.75 },
                ]
            }
          },
        ]
      },
      tables: {
        create: [
          { tableNumber: 1 },
          { tableNumber: 2 },
          { tableNumber: 3 },
        ]
      }
    }
  })

  console.log(`✅ Created restaurant: ${restaurant2.name}`)
  console.log('🌱 Seeding complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })