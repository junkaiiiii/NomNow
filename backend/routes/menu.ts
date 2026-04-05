import { Router, Request, Response } from "express"
import prisma from "../lib/prisma"

const router = Router()

// GET single menu item by slug and itemId
router.get("/restaurant/:slug/itemId/:itemId", async (req: Request, res: Response) => {
  const slug = req.params.slug as string
  const itemId = req.params.itemId as string

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: slug }
    })

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    if (!restaurant.isApproved) {
      return res.status(403).json({ message: "Restaurant not approved" })
    }

    const item = await prisma.menuItem.findFirst({
      where: {
        id: itemId,
        restaurantId: restaurant.id,
        isAvailable: true
      },
      include: {
        addOns: true  // ← include addons in response
      }
    })

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" })
    }

    return res.json(item)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
})

// GET restaurant with full menu by slug
router.get("/:slug", async (req: Request, res: Response) => {
  const slug = req.params.slug as string

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: slug },
      include: {
        menuItems: {
          where: { isAvailable: true },
          include: { addOns: true },  // ← include addons for each item
          orderBy: { category: 'asc' }
        }
      }
    })

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    if (!restaurant.isApproved) {
      return res.status(403).json({ message: "Restaurant not approved" })
    }

    // Separate restaurant info from menu for clean response
    const { menuItems, ...restaurantInfo } = restaurant

    return res.json({
      restaurant: restaurantInfo,
      menu: menuItems
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
})

export default router