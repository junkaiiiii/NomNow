import { MenuItem, CartItem } from '@/app/types'

type Props = {
  item: MenuItem
  quantity: number
  onAdd: (item: MenuItem) => void
  onRemove: (itemId: number) => void
}

export default function MenuCard({ item, quantity, onAdd, onRemove }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-500 text-sm mt-0.5">{item.description}</p>
        <p className="text-black font-bold mt-1">RM {item.price.toFixed(2)}</p>
      </div>

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