"use client"

import { useRouter } from "next/navigation"
import {
  isCustomerLoggedIn,
} from "@/lib/customer-api"

type Variant = {
  id: number
  size: string
  price: string | number
  stock: number
}

type Product = {
  id: number
  name: string
  description?: string
  image?: string
  variants?: Variant[]
}

export default function ProductCard({
  product,
}: {
  product: Product
}) {
  const router = useRouter()

  const availableVariants =
    product.variants?.filter(
      (variant) => variant.stock > 0
    ) || []

  const lowestPrice =
    availableVariants.length > 0
      ? Math.min(
          ...availableVariants.map(
            (variant) => Number(variant.price)
          )
        )
      : null

  function openProduct() {
    const productUrl = `/products/${product.id}`

    if (!isCustomerLoggedIn()) {
      router.push(
        `/login?redirect=${encodeURIComponent(productUrl)}`
      )
      return
    }

    router.push(productUrl)
  }

  return (
    <article className="product-card">
      <button
        type="button"
        onClick={openProduct}
        className="product-card-link"
        style={{
          display: "block",
          width: "100%",
          padding: 0,
          border: 0,
          background: "transparent",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <div className="product-card-image">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
            />
          ) : (
            <div className="product-image-placeholder">
              No Image
            </div>
          )}
        </div>

        <div className="product-card-content">
          <h2>{product.name}</h2>

          {product.description && (
            <p>{product.description}</p>
          )}

          <div className="product-card-price">
            {lowestPrice !== null
              ? `From ${lowestPrice.toFixed(2)} ETB`
              : "Out of stock"}
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={openProduct}
        className="primary-button product-card-button"
      >
        {availableVariants.length > 0
          ? "View Product"
          : "View Details"}
      </button>
    </article>
  )
}
