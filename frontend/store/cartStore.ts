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
        preferenceHints: item.preferenceHints,
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
                const normalizedCustomization = customization ?? getDefaultCustomization();
                const newSignature = buildCustomizationSignature(item.id, normalizedCustomization);
                const existingLine = state.cart.find((line) => {
                    const lineSignature = buildCustomizationSignature(line.menuItemId, {
                        selectedAddOns: line.selectedAddOns,
                        preference: line.preference,
                    });
                    return lineSignature === newSignature;
                });

                if (existingLine) {
                    return {
                        cart: state.cart.map((line) =>
                            line.id === existingLine.id ? { ...line, quantity: line.quantity + 1 } : line
                        ),
                    };
                }

                const addOns = resolveAddOns(item);
                const selectedAddOns = normalizedCustomization.selectedAddOns
                    .filter((selected) => addOns.some((available) => available.id === selected.id));
                const line = buildCartLine(item, {
                    selectedAddOns,
                    preference: normalizedCustomization.preference,
                });
                return { cart: [...state.cart, line] };
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
