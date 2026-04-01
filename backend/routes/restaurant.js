const express = require('express')
const router = express.Router()
const { restaurants, tables, tableSessions } = require('../data/mockData')

// Verify whether a table session is currently valid for a restaurant
router.get('/:slug/session/availability', (req, res) => {
    const { slug } = req.params
    const { table, sessionId } = req.query

    if (!table || !sessionId) {
      return res.status(400).json({ message: 'table and sessionId are required' })
    }

    const restaurant = restaurants.find(r => r.slug === slug)

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }

    const tableNumber = Number.parseInt(table, 10)

    if (Number.isNaN(tableNumber)) {
      return res.status(400).json({ message: 'table must be a valid number' })
    }

    const matchedTable = tables.find(t => t.restaurantId === restaurant.id && t.tableNumber === tableNumber)

    if (!matchedTable) {
      return res.status(404).json({
        available: false,
        message: 'Table not found'
      })
    }

    const session = tableSessions.find(s => (
      s.id === sessionId &&
      s.restaurantId.toString() === restaurant.id.toString() &&
      s.tableNumber === tableNumber &&
      s.status === 'active'
    ))

    const available = Boolean(session) && matchedTable.currentSessionId === sessionId

    return res.json({
      available,
      table: {
        id: matchedTable.id,
        tableNumber: matchedTable.tableNumber
      },
      session: session ? {
        id: session.id,
        status: session.status,
        createdAt: session.createdAt
      } : null,
      message: available ? 'Session is active for this table' : 'Session is not available for this table'
    })
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
  
  
    res.json(restaurant)
  })

module.exports = router
