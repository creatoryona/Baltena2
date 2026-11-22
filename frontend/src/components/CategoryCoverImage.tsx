"use client"

import { useState } from "react"
import { getFullImageUrl } from "@/lib/image-url"

export default function CategoryCoverImage({
  image,
  name,
}: {
  image?: string | null
  name: string
}) {
  const [hasError, setHasError] = useState(false)

  if (!image || hasError) {
    return (
      <div className="category-no-image">
        <span>📁</span>
      </div>
    )
  }

  return (
    <img
      src={getFullImageUrl(image)}
      alt={name}
      onError={() => setHasError(true)}
    />
  )
}

