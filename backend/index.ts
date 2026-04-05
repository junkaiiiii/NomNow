import cors from "cors"
import express, { Request, Response } from "express"

import menuRoutes from "./routes/menu"
import orderRoutes from "./routes/orders"
import restaurantRoutes from "./routes/restaurant"

const app = express()
const PORT = Number(process.env.PORT) || 5002


app.use(cors())
app.use(express.json())

// Routes
app.use("/api/menu", menuRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/restaurant", restaurantRoutes)

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "NomNow API is running 🍽️" })
})

app.listen(PORT, () => {
  console.log(`NomNow backend running on http://localhost:${PORT}`)
})
