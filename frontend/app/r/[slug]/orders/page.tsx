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
    const response = await fetch(`http://localhost:5001/api/orders/restaurant/${slug}/table/${table}`)
    const orders = await response.json();

    return (
        <OrdersClient 
            orders={orders}
            table = {table}
        />
    )
}