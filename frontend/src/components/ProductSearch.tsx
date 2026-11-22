"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ProductSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("search") || ""
  const [query, setQuery] = useState(initialQuery)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set("search", query.trim())
    } else {
      params.delete("search")
    }
    router.push(`/products?${params.toString()}`)
  }

  function handleClear() {
    setQuery("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    router.push(`/products?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="product-search-form">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search spices, butter, shiro..."
          className="search-input"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear-btn"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <button type="submit" className="search-submit-btn">
        Search
      </button>
    </form>
  )
}

