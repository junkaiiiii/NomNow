import { TaxConfig } from "@/types";

export type TaxBreakdown = {
    subtotal: number
    sstAmount: number
    serviceTaxAmount: number
    total: number
    sstInclusive: boolean
}

// sst can be inclusive or exclusive
// service charge just put value

export function calculateTax(subtotal: number, taxConfig: TaxConfig): TaxBreakdown {
    //subtotal = without tax
    //total = included tax
    const basePrice = subtotal / (1 + (taxConfig?.sstInclusive ? taxConfig.sst : 0 ))

    return {
        subtotal: basePrice,
        sstAmount: basePrice * taxConfig.sst,
        serviceTaxAmount: basePrice * taxConfig.serviceTax,
        total: basePrice + (basePrice*taxConfig.sst) + (basePrice * taxConfig.serviceTax),
        sstInclusive: taxConfig.sstInclusive
    }

}