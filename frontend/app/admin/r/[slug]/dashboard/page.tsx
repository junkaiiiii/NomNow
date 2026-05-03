import AdminDashboardClient from "@/components/AdminDashboardClient"
import type { DashboardTable, Restaurant } from "@/types"

type PageProps = {
    params : Promise< {slug: string} >
}

export default async function AdminDashboard({params}: PageProps){
    const {slug} = await params
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurant/${slug}/tables`, {
        cache: 'no-store',
    })

    if (!response.ok) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
                <div className="rounded-lg border border-zinc-300 bg-white p-6 text-center shadow-sm">
                    <h1 className="text-xl font-bold text-zinc-950">Dashboard unavailable</h1>
                    <p className="mt-2 text-sm text-zinc-500">
                        Could not load table data for this restaurant.
                    </p>
                </div>
            </div>
        )
    }

    const data: {
        restaurant: Pick<Restaurant, 'id' | 'name' | 'slug' | 'address'>
        tables: DashboardTable[]
    } = await response.json()

    return (
        <AdminDashboardClient restaurant={data.restaurant} tables={data.tables} />
    )
}
