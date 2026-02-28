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
    const response = await fetch(`http://localhost:5002/api/orders/restaurant/${slug}/table/${table}`)
    const orders = await response.json()
    
    const restaurantResponse = await fetch(`http://localhost:5002/api/restaurant/${slug}`)
    const restaurant = await restaurantResponse.json()

    return (
        <OrdersClient 
            restaurant={restaurant}
            orders={orders}
            table = {table}
        />
    )
}