import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, ItemCustomization, MenuItem, Restaurant } from "@/types";
import { buildCustomizationSignature, computeUnitPrice, resolveAddOns } from "@/lib/itemCustomization";

type CartStore = {
    cart: CartItem[]
    tableNumber: string | null
    restaurant: Restaurant | null
    setTable: (table: string, restaurant: Restaurant) => void
    addToCart: (item: MenuItem, customization?: ItemCustomization) => void
    incrementCartItem: (lineId: string) => void
    decrementCartItem: (lineId: string) => void
    updateCartItemCustomization: (lineId: string, customization: ItemCustomization) => void
    removeCartItem: (lineId: string) => void
    clearCart: () => void
    clearTable: () => void
}

function buildCartLine(item: MenuItem, customization: ItemCustomization): CartItem {
    return {
        id: `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        menuItemId: item.id,
        restaurantId: item.restaurantId,
        name: item.name,
        description: item.description,
        category: item.category,
        isAvailable: item.isAvailable,
        addOns: item.addOns,
        selectedAddOns: customization.selectedAddOns,
        preference: customization.preference.trim(),
        basePrice: item.price,
        unitPrice: computeUnitPrice(item.price, customization.selectedAddOns),
        quantity: 1,
        imageUrl: item.imageUrl
    };
}

function getDefaultCustomization(): ItemCustomization {
    return {
        selectedAddOns: [],
        preference: "",
    };
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            cart: [],
            tableNumber: null,
            restaurant: null,

            setTable: (table, restaurant) => set({ tableNumber: table, restaurant }),

            addToCart: (item, customization) => set((state) => {
                // Normalize customization (use default if none provided)
                const normalizedCustomization = customization ?? getDefaultCustomization();

                // Generate a unique signature for the item with its customization
                const newSignature = buildCustomizationSignature(item.id, normalizedCustomization);

                // Check if an item with the same signature already exists in the cart
                const existingLine = state.cart.find((line) => {
                    const lineSignature = buildCustomizationSignature(line.menuItemId, {
                        selectedAddOns: line.selectedAddOns,
                        preference: line.preference,
                    });
                    return lineSignature === newSignature;
                });

                // If the item already exists, increment its quantity
                if (existingLine) {
                    return {
                        ...state,
                        cart: state.cart.map((line) =>
                            line.menuItemId === existingLine.menuItemId
                                ? { ...line, quantity: line.quantity + 1 }
                                : line
                        ),
                    };
                }

                // If the item does not exist, add it to the cart
                return {
                    ...state,
                    cart: [
                        ...state.cart,
                        buildCartLine(item, normalizedCustomization),
                    ],
                };
            }),

            incrementCartItem: (lineId) => set((state) => ({
                cart: state.cart.map((line) =>
                    line.id === lineId ? { ...line, quantity: line.quantity + 1 } : line
                ),
            })),

            decrementCartItem: (lineId) => set((state) => {
                const existing = state.cart.find((line) => line.id === lineId);
                if (!existing) return state;
                if (existing.quantity === 1) {
                    return { cart: state.cart.filter((line) => line.id !== lineId) };
                }
                return {
                    cart: state.cart.map((line) =>
                        line.id === lineId ? { ...line, quantity: line.quantity - 1 } : line
                    ),
                };
            }),

            updateCartItemCustomization: (lineId, customization) => set((state) => {
                const line = state.cart.find((cartLine) => cartLine.id === lineId);
                if (!line) return state;

                const selectedAddOns = customization.selectedAddOns
                    .filter((selected) => (line.addOns ?? []).some((available) => available.id === selected.id));
                const updatedLine: CartItem = {
                    ...line,
                    selectedAddOns,
                    preference: customization.preference.trim(),
                    unitPrice: computeUnitPrice(line.basePrice, selectedAddOns),
                };

                const updatedSignature = buildCustomizationSignature(updatedLine.menuItemId, {
                    selectedAddOns: updatedLine.selectedAddOns,
                    preference: updatedLine.preference,
                });

                const duplicateLine = state.cart.find((cartLine) => {
                    if (cartLine.id === lineId) return false;
                    const signature = buildCustomizationSignature(cartLine.menuItemId, {
                        selectedAddOns: cartLine.selectedAddOns,
                        preference: cartLine.preference,
                    });
                    return signature === updatedSignature;
                });

                if (duplicateLine) {
                    return {
                        cart: state.cart
                            .filter((cartLine) => cartLine.id !== lineId)
                            .map((cartLine) =>
                                cartLine.id === duplicateLine.id
                                    ? { ...cartLine, quantity: cartLine.quantity + updatedLine.quantity }
                                    : cartLine
                            ),
                    };
                }

                return {
                    cart: state.cart.map((cartLine) => (cartLine.id === lineId ? updatedLine : cartLine)),
                };
            }),

            removeCartItem: (lineId) => set((state) => ({
                cart: state.cart.filter((line) => line.id !== lineId),
            })),

            clearCart: () => set({ cart: [], tableNumber: null, restaurant: null }),

            clearTable: () => set({ tableNumber: null }),
        }),
        {
            name: "nomnow-cart",
        }
    )
);
