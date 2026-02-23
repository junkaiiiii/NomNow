'use client'

type Props = {
    name: string
    address: string
}

export default function RestaurantHeader({ name, address }: Props) {
    return (
        <div className="bg-white p-6 fixed top-0 left-0 right-0 shadow-md flex justify-between items-center">
            <div>
                <h1 className="text-black text-2xl font-bold ">{name}</h1>
                <p className="text-gray-500 text-sm mt-1">{address}</p>
            </div>



        </div>
    )
}