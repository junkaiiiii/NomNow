'use client'

import { useRouter } from "next/navigation"

type Props = {
    name: string
    address: string
    goBack: boolean
}

export default function RestaurantHeader({ name, address, goBack }: Props) {
    const router = useRouter();

    return (
        <div className="bg-white p-6 fixed top-0 left-0 right-0 shadow-md flex flex-start items-center h-20 space-x-5">
            {
                goBack && (
                    <button onClick={()=>router.back()} className="cursor-pointer">
                        &larr;
                    </button>
                )
            }

            <div>
                <h1 className="text-black text-2xl font-bold ">{name}</h1>
                <p className="text-gray-500 text-sm mt-1">{address}</p>
            </div>



        </div>
    )
}