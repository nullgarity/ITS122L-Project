"use client"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem("token") // or use your method
    if (!isAuthenticated) router.push("/Login")
  }, [])

  return <>{children}</>
}
