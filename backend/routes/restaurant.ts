import { Router, Request, Response } from "express"
import prisma from "../lib/prisma"

const router = Router()

const getSingleQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

// `${process.env.NEXT_PUBLIC_API_URL}/api/restaurant/${restaurantSlug}/session/availability?${query.toString()}`

router.get("/:slug/session/availability", async (req, res) => {
  const slug = req.params.slug as string
  const table = getSingleQueryValue(req.query.table as string | string[] | undefined)
  const sessionId = getSingleQueryValue(
    req.query.sessionId as string | string[] | undefined,
  )

  if (!table || !sessionId) {
    return res.status(400).json({ message: "table and sessionId are required" })
  }
  try {
    // const restaurant = restaurants.find((entry) => entry.slug === slug)
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: slug }
    })

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    const tableNumber = Number.parseInt(table, 10)

    if (Number.isNaN(tableNumber)) {
      return res.status(400).json({ message: "table must be a valid number" })
    }

    // const matchedTable = tables.find(
    //   (entry) => entry.restaurantId === restaurant.id && entry.tableNumber === tableNumber,
    // )
    const matchedTable = await prisma.table.findFirst({
      where: {
        restaurantId: restaurant.id,
        tableNumber: tableNumber,
      },
    })

    if (!matchedTable) {
      return res.status(404).json({
        available: false,
        message: "Table not found",
      })
    }

    // const session = tableSessions.find(
    //   (entry) =>
    //     entry.id === sessionId &&
    //     entry.restaurantId === restaurant.id &&
    //     entry.tableNumber === tableNumber &&
    //     entry.status === "active",
    // )
    const session = await prisma.tableSession.findFirst({
      where: {
        id: sessionId,
        restaurantId: restaurant.id,
        tableNumber: tableNumber,
        status: "active",
      },
    })

    const available = Boolean(session) && matchedTable.currentSessionId === sessionId

    return res.json({
      available,
      table: {
        id: matchedTable.id,
        tableNumber: matchedTable.tableNumber,
      },
      session: session
        ? {
          id: session.id,
          status: session.status,
          createdAt: session.createdAt,
        }
        : null,
      message: available
        ? "Session is active for this table"
        : "Session is not available for this table",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
})

router.get("/:slug", async (req, res) => {
  const slug = req.params.slug as string

  try {
    // const restaurant = restaurants.find((entry) => entry.slug === req.params.slug)
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: slug }
    })

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    if (!restaurant.isApproved) {
      return res.status(403).json({ message: "Restaurant not approved" })
    }

    return res.json(restaurant)
  }
  catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
})


export default router
