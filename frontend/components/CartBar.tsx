'use client'

type Props = {
    cartQuantity: number
    totalAmount: number
    tableNumber: string | null
}

export default function CartBar({ cartQuantity, totalAmount, tableNumber }: Props) {
    return (
        <div className="p-6 fixed bottom-0 left-0 right-0">

            <button className="w-full bg-orange-500 text-white py-3 px-4  rounded-xl font-semibold flex justify-between items-center hover:bg-orange-600 transition">
                <span className="bg-white text-orange-500 text-sm px-2 py-0.5 rounded-full">{cartQuantity}</span>
                <span className="pl-8">View Cart
                    { tableNumber &&
                    <a className="text-grey-300 font-light text-sm"> (Table {tableNumber})</a>
                    }
                    
                </span>

                <span>RM {totalAmount.toFixed(2)}</span>
                
            </button>
        </div>
    )
}