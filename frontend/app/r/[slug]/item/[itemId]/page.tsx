import ItemDetailClient from "@/components/ItemDetailClient";

type PageProps = {
    params: Promise<{ slug:string, itemId: string }>
    searchParams: Promise<{ signature: string }>
}

export default async function ItemDetail({params, searchParams}: PageProps){
    const {slug, itemId} = await params;
    const {signature} = await searchParams

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/restaurant/${slug}/itemId/${itemId}`);
    const item = await response.json()
// '/restaurant/:slug/itemId/:itemId'
    return (
        <ItemDetailClient 
            item = {item}
            existingSignature= {signature}
        />
    )
}