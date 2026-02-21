const express = require('express')
const router = express.Router()
const { orders, menuItems } = require('../data/mockData')

// GET all orders
router.get('/', (req, res) => {
  res.json(orders)
})

// POST create new order
router.post('/', (req, res) => {
  const { customerName, items } = req.body
  // items expected as array: [{ menuItemId: 1, quantity: 2 }]

  if (!customerName || !items || items.length === 0) {
    return res.status(400).json({ message: 'customerName and items are required' })
  }

  const orderItems = items.map(i => {
    const menuItem = menuItems.find(m => m.id === i.menuItemId)
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
    customerName,
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
