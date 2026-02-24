const express = require('express')
const router = express.Router()
const { orders, menuItems, restaurants } = require('../data/mockData')

// GET all orders of a table
router.get('/slug/:slug/table/:table', (req, res) => {
  const result = orders.filter(o => {
    o.slug === req.params.slug && o.table === parseInt(req.params.table)
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

// POST create new order
router.post('/', (req, res) => {
  const { slug, table, items } = req.body
  // items expected as array: [{ menuItemId: 1, quantity: 2 }]

  if (!slug || !table || !items || items.length === 0) {
    return res.status(400).json({ message: 'slug, table and items are required' })
  }

  const orderItems = items.map(i => {
    const menuItem = menuItems.find(m => m.id === i.menuItemId) //mock data
    return {
      menuItem,
      quantity: i.quantity,
      subtotal: menuItem.price * i.quantity
    }
  })

  let total = 0

  orderItems.forEach((i) => {
    total += i.subtotal;
  });

  // const total = orderItems.reduce((sum, i) => sum + i.subtotal, 0)

  const newOrder = {
    id: orders.length + 1,
    slug,
    table,
    items: orderItems,
    total,
    status: 'Pending',
    createdAt: new Date()
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
