"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasAdminSession = Boolean(
        localStorage.getItem("baltena_admin_token"),
      )

      if (hasAdminSession) {
        router.replace("/admin")
        return
      }
    }

    router.replace("/login?role=admin")
  }, [router])

  return null
}
