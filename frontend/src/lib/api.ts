const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export async function getProducts(categorySlug?: string, search?: string) {
  try {
    const params = new URLSearchParams()
    if (categorySlug) params.append("category", categorySlug)
    if (search?.trim()) params.append("search", search.trim())

    const queryStr = params.toString()
    const url = queryStr ? `${API_URL}/products?${queryStr}` : `${API_URL}/products`

    const response = await fetch(url, {
      cache: "no-store",
    })

    if (!response.ok) {
      return []
    }

    return response.json()
  } catch {
    return []
  }
}

export async function getProduct(id: string) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch {
    return null
  }
}

export async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return []
    }

    return response.json()
  } catch {
    return []
  }
}

export async function createOrder(data: {
  customerName: string
  phone: string
  customerId?: number
  region?: string
  city?: string
  subCity?: string
  woreda?: string
  houseNumber?: string
  address?: string
  note?: string
  items: {
    variantId: number
    quantity: number
  }[]
}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("baltena_customer_token")
      : null

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to place order"
    )
  }

  return result
}