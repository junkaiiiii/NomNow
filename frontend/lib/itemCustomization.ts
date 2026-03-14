import { AddOnOption, MenuItem, ItemCustomization } from "@/types";

export function resolveAddOns(item: MenuItem): AddOnOption[] {
    return item.addOns ?? [];
}

export function computeUnitPrice(basePrice: number, selectedAddOns: AddOnOption[]): number {
    const addOnTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
    return basePrice + addOnTotal;
}

export function buildCustomizationSignature(menuItemId: string, customization: ItemCustomization): string {
    const addOnSignature = customization.selectedAddOns
        .map((addOn) => addOn.id)
        .sort()
        .join("|");
    const preference = customization.preference.trim().toLowerCase();
    return `${menuItemId}::${addOnSignature}::${preference}`;
}

export function resolveCustomizationSignature(signature: string){
    const [itemId, addOns, preference] = signature.split('::');
    return {
        id: itemId,
        addOns: addOns.split('|'),
        preference: preference
    }
}