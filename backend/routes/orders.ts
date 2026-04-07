import { Router, Request, Response } from "express"
import prisma from "../lib/prisma"

// Define or import the OrderItem type

type OrderItem = {
  id: string
  orderId: string
  menuItemId: string
  quantity: number
  basePrice: number
  unitPrice: number
  addOnsPrice: number
  preference: string
  subtotal: number
  selectedAddOns: Array<{ id: string; name: string; price: number }>
}

type AddOnOption = {
  id: string
  name: string
  price: number
}




const router = Router()

type CreateOrderRequestBody = {
  restaurantId: string
  sessionId: string
  tableNumber: number
  items: {
    menuItemId: string
    quantity: number
    unitPrice?: number
    selectedAddOns?: AddOnOption[]
    preference?: string
  }[]
  sstAmount?: number
  serviceTaxAmount?: number
  subtotal?: number
  total?: number
}

router.get("/restaurant/:slug/table/:table", async (req, res) => {
  // const restaurant = restaurants.find((entry) => entry.slug === req.params.slug)
  const slug = req.params.slug as string
  const table = req.params.table as string

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: slug }
    })

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    const tableNumber = Number.parseInt(req.params.table, 10)

    if (Number.isNaN(tableNumber)) {
      return res.status(400).json({ message: "Table must be a valid number" })
    }

    const result = await prisma.order.findFirst({
      where: {
        restaurantId: restaurant?.id,
        tableNumber: tableNumber
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    })

    // model Order {
    //   id               String        @id @default(cuid())
    //   sessionId        String
    //   session          TableSession  @relation(fields: [sessionId], references: [id])
    //   restaurantId     String
    //   restaurant       Restaurant    @relation(fields: [restaurantId], references: [id])
    //   tableNumber      Int
    //   status           OrderStatus   @default(Pending)
    //   subtotal         Float
    //   sstAmount        Float         @default(0)
    //   serviceTaxAmount Float         @default(0)
    //   total            Float
    //   items            OrderItem[]
    //   createdAt        DateTime      @default(now())
    // }

    return res.json(result)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
})

router.get("/:id", async (req, res) => {
  const id = req.params.id as string
  try {
    // const order = orders.find((entry) => entry.id === req.params.id)
    const order = await prisma.order.findUnique({
      where: { id: id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    return res.json(order)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
})

router.get("/", async (req, res) => {
  const orders = await prisma.order.findMany()

  return res.json(orders)
})

router.post("/", async (req: Request, res: Response) => {
  const {
    restaurantId,
    sessionId,
    tableNumber,
    items,
    sstAmount,
    serviceTaxAmount,
    subtotal,
    total,
  } = req.body as CreateOrderRequestBody

  // body: JSON.stringify(
  //   {
  //       restaurantId: restaurant.id,
  //       table: parseInt(tableNumber),
  //       items: items,
  //       sstAmount: priceBreakdown.sstAmount,
  //       serviceTaxAmount: priceBreakdown.serviceTaxAmount,
  //       subtotal: priceBreakdown.subtotal,
  //       total: priceBreakdown.total
  //   }

  if (!restaurantId || !sessionId || tableNumber === undefined || tableNumber === null || !items || items.length === 0) {
    return res.status(400).json({ message: "restaurantId, sessionId, tableNumber and items are required" })
  }

  try {
    // Verify restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    })

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    // Verify session exists and is active
    const session = await prisma.tableSession.findUnique({
      where: { id: sessionId }
    })

    if (!session) {
      return res.status(404).json({ message: "Session not found" })
    }

    if (session.status !== "active") {
      return res.status(403).json({ message: "Session is no longer active" })
    }

    // Fetch all menu items in one query instead of one by one
    const menuItemIds = items.map(item => item.menuItemId)
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        restaurantId,
        isAvailable: true
      }
    })

    // Validate all items exist
    for (const item of items) {
      const menuItem = menuItems.find(m => m.id === item.menuItemId)
      if (!menuItem) {
        return res.status(400).json({ message: `Menu item ${item.menuItemId} not found` })
      }
      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        return res.status(400).json({ message: `Invalid quantity for item ${item.menuItemId}` })
      }
    }

    // Compute subtotal from items
    const computedSubtotal = items.reduce((sum, item) => {
      const unitPrice = typeof item.unitPrice === "number" ? item.unitPrice : menuItems.find(m => m.id === item.menuItemId)!.price
      return sum + unitPrice * item.quantity
    }, 0)

    // Create order with items in one Prisma query
    const newOrder = await prisma.order.create({
      data: {
        restaurantId,
        sessionId,
        tableNumber,
        status: "Pending",
        subtotal: subtotal ?? computedSubtotal,
        sstAmount: sstAmount ?? 0,
        serviceTaxAmount: serviceTaxAmount ?? 0,
        total: total ?? computedSubtotal,
        items: {
          create: items.map(item => {
            const menuItem = menuItems.find(m => m.id === item.menuItemId)!
            const unitPrice = typeof item.unitPrice === "number" ? item.unitPrice : menuItem.price
            const addOnsPrice = unitPrice - menuItem.price
            return {
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              basePrice: menuItem.price,
              unitPrice,
              addOnsPrice: addOnsPrice > 0 ? addOnsPrice : 0,
              preference: typeof item.preference === "string" ? item.preference : "",
              selectedAddOns: Array.isArray(item.selectedAddOns) ? item.selectedAddOns : [],
              subtotal: unitPrice * item.quantity,
            }
          })
        }
      },
      include: {
        items: {
          include: { menuItem: true }
        }
      }
    })

    return res.status(201).json(newOrder)

  } catch (error) {
    console.error(error)
    const message = error instanceof Error ? error.message : "Failed to create order"
    return res.status(400).json({ message })
  }
})

export default router
