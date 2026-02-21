const express = require('express')
const router = express.Router()
const { menuItems } = require('../data/mockData')

// GET all menu items
router.get('/', (req, res) => {
  res.json(menuItems)
})

// GET single menu item by id
router.get('/:id', (req, res) => {
  const item = menuItems.find(item => item.id === parseInt(req.params.id))

  if (!item) {
    return res.status(404).json({ message: 'Menu item not found' })
  }

  res.json(item)
})

module.exports = router