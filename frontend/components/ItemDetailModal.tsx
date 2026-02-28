'use client'

import { useEffect, useMemo, useState } from "react";
import { AddOnOption, ItemCustomization, MenuItem } from "@/types";
import { computeUnitPrice, resolveAddOns, resolvePreferenceHints } from "@/lib/itemCustomization";

type Props = {
    isOpen: boolean
    item: MenuItem | null
    initialCustomization: ItemCustomization
    submitLabel: string
    onClose: () => void
    onSubmit: (customization: ItemCustomization) => void
}

export default function ItemDetailModal({
    isOpen,
    item,
    initialCustomization,
    submitLabel,
    onClose,
    onSubmit,
}: Props) {
    const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
    const [preference, setPreference] = useState("");

    useEffect(() => {
        if (!isOpen || !item) return;
        setSelectedAddOns(initialCustomization.selectedAddOns);
        setPreference(initialCustomization.preference);
    }, [isOpen, item, initialCustomization.preference, initialCustomization.selectedAddOns]);

    const addOnOptions = useMemo(() => (item ? resolveAddOns(item) : []), [item]);
    const preferenceHints = useMemo(() => (item ? resolvePreferenceHints(item) : []), [item]);
    const unitPrice = useMemo(() => {
        if (!item) return 0;
        return computeUnitPrice(item.price, selectedAddOns);
    }, [item, selectedAddOns]);

    if (!isOpen || !item) return null;

    function toggleAddOn(addOn: AddOnOption) {
        setSelectedAddOns((prev) => {
            const exists = prev.some((selected) => selected.id === addOn.id);
            if (exists) {
                return prev.filter((selected) => selected.id !== addOn.id);
            }
            return [...prev, addOn];
        });
    }

    function applyHint(hint: string) {
        setPreference((prev) => {
            if (!prev.trim()) return hint;
            if (prev.includes(hint)) return prev;
            return `${prev}, ${hint}`;
        });
    }

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center sm:justify-center"
            onClick={onClose}
        >
            <div
                className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl p-5 max-h-[85vh] overflow-y-auto"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 text-sm">Close</button>
                </div>

                {addOnOptions.length > 0 && (
                    <div className="mt-5">
                        <h4 className="font-semibold mb-2">Add-ons</h4>
                        <div className="space-y-2">
                            {addOnOptions.map((addOn) => {
                                const checked = selectedAddOns.some((selected) => selected.id === addOn.id);
                                return (
                                    <label
                                        key={addOn.id}
                                        className="flex justify-between items-center border border-gray-200 rounded-lg px-3 py-2 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggleAddOn(addOn)}
                                            />
                                            <span>{addOn.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {addOn.price > 0 ? `+RM ${addOn.price.toFixed(2)}` : "Free"}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="mt-5">
                    <h4 className="font-semibold mb-2">Preference</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {preferenceHints.map((hint) => (
                            <button
                                key={hint}
                                type="button"
                                onClick={() => applyHint(hint)}
                                className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-200"
                            >
                                {hint}
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={preference}
                        onChange={(event) => setPreference(event.target.value)}
                        placeholder="e.g. no onion, extra spicy"
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[90px]"
                        maxLength={150}
                    />
                </div>

                <button
                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold mt-5 hover:bg-orange-600 transition"
                    onClick={() => onSubmit({ selectedAddOns, preference })}
                >
                    {submitLabel} · RM {unitPrice.toFixed(2)}
                </button>
            </div>
        </div>
    );
}
