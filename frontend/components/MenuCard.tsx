'use client'

import { MenuItem } from '@/types'

const FALLBACK_IMAGE_URL = "https://www.theflavorbender.com/wp-content/uploads/2021/09/Roti-Canai-6501-2.jpg";

type Props = {
  item: MenuItem
  quantity: number
  onAdd: (item: MenuItem) => void
  onRemove: (itemId: string) => void
  onOpenDetail: (item: MenuItem) => void
}

export default function MenuCard({ item, quantity, onAdd, onRemove, onOpenDetail }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">

      <button
        type="button"
        className="flex flex-1 justify-start items-center space-x-5 text-left"
        onClick={() => onOpenDetail(item)}
      >
        <div className=''>
          <img
            className='w-20 h-20 rounded-md object-cover'
            src={item.imageUrl || FALLBACK_IMAGE_URL}
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE_URL;
            }}
          />
        </div>
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-gray-500 text-sm mt-0.5">{item.description}</p>
          <p className="text-black font-bold mt-1">RM {item.price.toFixed(2)}</p>
          <p className="text-xs text-orange-500 mt-1">Tap to customize</p>
        </div>
      </button>

      <div className="flex items-center gap-2 ml-4">
        {quantity > 0 ? (
          <>
            <button
              onClick={() => onRemove(item.id)}
              className="w-8 h-8 rounded-full bg-white text-orange-500 font-bold hover:bg-orange-200 transition"
            >
              −
            </button>
            <span className="w-4 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => onAdd(item)}
              className="w-8 h-8 rounded-full bg-white text-orange-500 font-bold hover:bg-orange-200 transition flex justify-center items-center"
            >
              +
            </button>
          </>
        ) : (
          <button
            onClick={() => onAdd(item)}
            className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition"
          >
            +
          </button>
        )}
      </div>
    </div>
  )
}
