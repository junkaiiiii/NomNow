import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to NomNow 🍽️</h1>
      <p className="text-gray-500 mb-8">Fresh food, fast delivery</p>
      <Link href="/r/mamak-bistro" className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition">
        Try Demo Restaurant
      </Link>
    </main>
  )
}