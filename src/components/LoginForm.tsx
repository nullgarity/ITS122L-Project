"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import { login } from "@/services/authService"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await login(email, password)
    if (res.success) {
      router.push("/user/Dashboard") // or /admin/Dashboard if admin
    } else {
        setError(res.message || "Login failed")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  )
}
