import OrdersClient from "@/components/OrdersClient"

type PageProps = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ table: string }>
}

export default async function OrdersPage({params, searchParams}:PageProps){
    const {slug} = await params
    const {table} = await searchParams

    console.log(slug, table)


    // /restaurant/:slug/table/:table
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/restaurant/${slug}/table/${table}`)
    const orders = await response.json()
    
    const restaurantResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurant/${slug}`)
    const restaurant = await restaurantResponse.json()

    return (
        <OrdersClient 
            restaurant={restaurant}
            orders={orders}
            table = {table}
        />
    )
}