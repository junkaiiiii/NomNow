const express = require('express')
const router = express.Router()
const { menuItems, restaurants } = require('../data/mockData')

// GET restaurant by slug + their menu
router.get('/:slug', (req, res) => {
    const restaurant = restaurants.find(r => r.slug === req.params.slug)
  
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }
  
    if (!restaurant.isApproved) {
      return res.status(403).json({ message: 'Restaurant not approved' })
    }
  
  
    res.json(restaurant)
  })

module.exports = router