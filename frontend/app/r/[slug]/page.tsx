import MenuClient from '@/components/MenuClient'
import { Restaurant, MenuItem } from '@/app/types'
import Loading from './loading'

type PageProps = {
    params: Promise<{ slug: string }>
}

export default async function MenuPage({ params }: PageProps) {
    const {slug} = await params

    const res = await fetch(`http://localhost:5001/api/menu/${slug}`)

    if (!res.ok) {
        return (
            <div className='flex items-center justify-center inset-0 absolute'>
                <h1 className='text-xl font-bold'>Restaurant Not Found... 404</h1>
            </div>
        )
    }

    const data: {restaurant: Restaurant; menu : MenuItem[]} = await res.json()

    return  (
        <>
        <MenuClient
            restaurant={data.restaurant}
            menu={data.menu}
        />
        </>
        
    )
}