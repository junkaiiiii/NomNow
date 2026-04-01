'use client'

import { useState } from "react"


export default function LoginPage() {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    return (
        <div className="h-screen flex flex-col items-center justify-center">


            <div className="flex flex-col justify-center items-center border border-gray-300 shadow-md rounded-lg px-5 py-15 w-100">

                <h1 className="text-2xl font-bold">Login Page</h1>

                <div className="flex flex-col w-full mt-8">
                    <label>Username:</label>
                    <input className="border border-gray-500 rounded-sm px-3 py-1 mt-2" type="text" placeholder="mamak_abc"
                        onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div className="flex flex-col  mt-5 w-full">
                    <label>Password: </label>
                    <input className="border border-gray-500 rounded-sm px-3 py-1 mt-2" type="password" placeholder="Mamak_abc_123"
                        onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button className="bg-orange-500 text-white font-semibold mt-10 py-1 w-full rounded-md cursor-pointer hover:bg-orange-600 transition">Login</button>
                {/* <a href="/register" className="text-sm text-orange-500 mt-2">Don't have an account? Register</a> */}
            </div>
        </div>
    )
}