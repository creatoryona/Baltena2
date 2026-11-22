import Link from "next/link"
import { getProducts, getCategories } from "@/lib/api"
import ProductCard from "@/components/ProductCard"
import ProductSearch from "@/components/ProductSearch"
import type { Product, Category } from "@/lib/types"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const { category, search } = await searchParams

  const [products, categories] = await Promise.all([
    getProducts(category, search),
    getCategories(),
  ])

  const activeCategory = categories.find(
    (c: Category) => c.slug === category
  )

  return (
    <section className="section products-page">
      <div className="container">

        <div className="page-heading">
          <span className="eyebrow">SHOP</span>
          <h1>
            {search
              ? `Results for "${search}"`
              : activeCategory
              ? activeCategory.name
              : "All Products"}
          </h1>
          <p>
            {search
              ? `Found ${products.length} product${products.length === 1 ? "" : "s"} matching your search.`
              : activeCategory
              ? `Showing products in ${activeCategory.name}.`
              : "Browse everything currently available at Baltena Market."}
          </p>
        </div>

        {/* Search Engine Bar */}
        <div className="products-search-container">
          <ProductSearch />
        </div>

        {/* Category filter bar */}
        <div className="category-filter-bar">
          <Link
            href={search ? `/products?search=${encodeURIComponent(search)}` : "/products"}
            className={`category-filter-pill${!category ? " active" : ""}`}
          >
            All
          </Link>

          {(categories as Category[]).map((cat) => {
            const href = search
              ? `/products?category=${cat.slug}&search=${encodeURIComponent(search)}`
              : `/products?category=${cat.slug}`

            return (
              <Link
                key={cat.id}
                href={href}
                className={`category-filter-pill${category === cat.slug ? " active" : ""}`}
              >
                {cat.name}
              </Link>
            )
          })}
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {(products as Product[]).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="empty-box">
            {search ? (
              <div>
                <p>No products found matching <strong>"{search}"</strong>.</p>
                <Link href="/products" className="empty-box-reset-link">
                  View all products →
                </Link>
              </div>
            ) : activeCategory ? (
              `No products in "${activeCategory.name}" yet.`
            ) : (
              "No products available yet."
            )}
          </div>
        )}

      </div>
    </section>
  )
}
