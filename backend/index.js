const express = require('express')
const cors = require('cors')

const menuRoutes = require('./routes/menu')
const orderRoutes = require('./routes/orders')
const restaurantRoutes = require('./routes/restaurant.js')

const app = express()
const PORT = process.env.PORT || 5002;


app.use(cors())
app.use(express.json())

// Routes
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/restaurant', restaurantRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'NomNow API is running 🍽️' })
})

app.listen(PORT, () => {
  console.log(`NomNow backend running on http://localhost:${PORT}`)
})