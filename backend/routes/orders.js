const express = require('express')
const router = express.Router()
const { orders, menuItems, restaurants } = require('../data/mockData')

// GET all orders of a table
// GET orders by slug and table — cleaner for frontend
router.get('/restaurant/:slug/table/:table', (req, res) => {

  const restaurant = restaurants.find(r => r.slug === req.params.slug)

  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' })
  }

  const result = orders.filter(o => {
    return o.restaurantId === restaurant.id && o.table === parseInt(req.params.table)
  })

  res.json(result)
})

// GET order by id
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id))
  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }
  res.json(order)
})

// GET order by id
router.get('/', (req, res) => {

  res.json(orders)
})

// {
//   restaurantId: restaurant.id,
//   table: parseInt(tableNumber),
//   items: items,
//   sstAmount: priceBreakdown.sstAmount,
//   serviceTaxAmount: priceBreakdown.serviceTaxAmount,
//   subtotal: priceBreakdown.subtotal,
//   total: priceBreakdown.total
// }
// POST create new order
router.post('/', (req, res) => {
  const { restaurantId, table, items, sstAmount, serviceTaxAmount, subtotal, total } = req.body
  // items expected as array: [{ menuItemId: 1, quantity: 2, unitPrice?: 12, selectedAddOns?: [], preference?: "" }]

  if (!restaurantId || table === undefined || table === null || !items || items.length === 0) {
    return res.status(400).json({ message: 'slug, table and items are required' })
  }

  const orderItems = items.map(i => {
    const menuItem = menuItems.find(m => m.id === i.menuItemId) //mock data
    if (!menuItem) {
      throw new Error(`Menu item ${i.menuItemId} not found`)
    }

    const unitPrice = typeof i.unitPrice === 'number' ? i.unitPrice : menuItem.price

    return {
      menuItem,
      quantity: i.quantity,
      unitPrice,
      selectedAddOns: Array.isArray(i.selectedAddOns) ? i.selectedAddOns : [],
      preference: typeof i.preference === 'string' ? i.preference : '',
      subtotal: unitPrice * i.quantity
    }
  })

  // const total = orderItems.reduce((sum, i) => sum + i.subtotal, 0)
//   export type Order = {
//     id: string
//     restaurantId: string
//     tableNumber: number
//     items: OrderItem[]
//     status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered'
//     createdAt: string
//     sstAmount: number
//     serviceTaxAmount: number
//     subtotal: number //subtotal = total without tax
//     total: number //total = sum(sst,serviceTax,subtotal)
// }

  const newOrder = {
    id: (orders.length + 1).toString(),
    restaurantId: restaurantId,
    table: table,
    items: orderItems,
    subtotal: subtotal,
    status: 'Pending',
    createdAt: new Date(),
    sstAmount: sstAmount,
    serviceTaxAmount: serviceTaxAmount,
    subtotal: subtotal,
    total: total
  }

  orders.push(newOrder)
  res.status(201).json(newOrder)
})

// PATCH update order status
router.patch('/:id/status', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id))

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  const { status } = req.body
  const validStatuses = ['Pending', 'Preparing', 'Ready', 'Delivered']

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }

  order.status = status
  res.json(order)
})

module.exports = router
