'use client'

import { useEffect, useState } from 'react'

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5001/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenuItems(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="p-8">Loading menu...</p>

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Our Menu 🍽️</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map(item => (
          <div key={item.id} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{item.category}</p>
            <p className="text-gray-600 mt-2">{item.description}</p>
            <p className="text-lg font-bold mt-3">RM {item.price.toFixed(2)}</p>
            <button className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}