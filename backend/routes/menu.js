const express = require('express')
const router = express.Router()
const { menuItems, restaurants } = require('../data/mockData')

// GET single item from menu
router.get('/restaurant/:slug/itemId/:itemId', (req, res) => {
  const restaurant = restaurants.find(r => r.slug === req.params.slug)

  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' })
  }

  if (!restaurant.isApproved) {
    return res.status(403).json({ message: 'Restaurant not approved' })
  }

  const item = menuItems.find(item => item.restaurantId === restaurant.id && item.isAvailable && item.id === req.params.itemId)

  res.json(item);
})


// GET restaurant by slug + their menu
router.get('/:slug', (req, res) => {
  const restaurant = restaurants.find(r => r.slug === req.params.slug)

  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' })
  }

  if (!restaurant.isApproved) {
    return res.status(403).json({ message: 'Restaurant not approved' })
  }

  const menu = menuItems.filter(item => item.restaurantId === restaurant.id && item.isAvailable)

  res.json({ restaurant, menu })
})

module.exports = router