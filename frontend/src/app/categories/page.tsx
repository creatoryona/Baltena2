import Link from "next/link"
import { getCategories } from "@/lib/api"
import CategoryCoverImage from "@/components/CategoryCoverImage"
import type { Category } from "@/lib/types"

export default async function CategoriesPage() {
  const categories: Category[] = await getCategories()

  return (
    <section className="section products-page">
      <div className="container">

        <div className="page-heading">
          <span className="eyebrow">BROWSE</span>
          <h1>Categories</h1>
          <p>Explore products by category at Baltena Market.</p>
        </div>

        {categories.length > 0 ? (
          <div className="product-grid">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="category-card"
              >
                <div className="category-card-cover">
                  <CategoryCoverImage
                    image={category.image}
                    name={category.name}
                  />
                </div>

                <div className="category-card-content">
                  <h2>{category.name}</h2>
                  <div className="category-card-count">
                    {category._count?.products ?? 0}{" "}
                    {category._count?.products === 1 ? "product" : "products"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-box">
            No categories yet. Check back soon.
          </div>
        )}

      </div>
    </section>
  )
}
