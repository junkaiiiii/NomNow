'use client'

import { useRouter } from "next/navigation"

type Props = {
    title: string
    subtitle?: string
    goBack: boolean
}

export default function RestaurantHeader({ title, subtitle, goBack }: Props) {
    const router = useRouter();

    return (
        <div className="bg-white p-6 fixed top-0 left-0 right-0 shadow-md flex justify-between items-center h-20 space-x-5">


            <div className="flex space-x-5">
                {
                    goBack && (
                        <button onClick={() => router.back()} className="cursor-pointer">
                            &larr;
                        </button>
                    )
                }
                <div>
                    <h1 className="text-black text-xl font-bold ">{title}</h1>
                    <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
                </div>
            </div>

           

        </div>
    )
}