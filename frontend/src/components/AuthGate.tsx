"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isCustomerLoggedIn } from "@/lib/customer-api"

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  // null = still checking, true = allowed, false = redirecting
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    const adminToken = localStorage.getItem("baltena_admin_token")
    const customerToken = isCustomerLoggedIn()

    if (!adminToken && !customerToken) {
      router.replace("/login")
      setAllowed(false)
    } else {
      setAllowed(true)
    }
  }, [router])

  // Still checking
  if (allowed === null) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "inherit",
          color: "#666",
        }}
      >
        <p>Loading Bealtena...</p>
      </div>
    )
  }

  // Redirecting — render nothing so there's no flash
  if (!allowed) return null

  return <>{children}</>
}

