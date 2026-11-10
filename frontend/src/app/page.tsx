import Link from "next/link"
import { getProducts } from "@/lib/api"
import ProductCard from "@/components/ProductCard"

export default async function HomePage() {
  const products = await getProducts()

  return (
    <main className="home-page">

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-inner">

          <div className="home-hero-content">
            <span className="home-eyebrow">
              BALTENA MARKET · ETHIOPIA
            </span>

            <h1>
              Good food.
              <br />
              <span>Good choice.</span>
            </h1>

            <p>
              Discover quality Ethiopian products, choose what you need,
              and order easily from Baltena Market.
            </p>

            <div className="home-hero-actions">
              <Link href="/products" className="home-primary-button">
                Shop Products
              </Link>

              <Link href="/categories" className="home-secondary-button">
                Explore Categories
              </Link>
            </div>
          </div>

          <div className="home-hero-decoration">
            <div className="home-circle home-circle-one"></div>
            <div className="home-circle home-circle-two"></div>

            <div className="home-product-showcase">
              <div className="showcase-card showcase-card-one">
                <span>🌶️</span>
                <strong>Berbere</strong>
                <small>Authentic Ethiopian spice</small>
              </div>

              <div className="showcase-card showcase-card-two">
                <span>🧈</span>
                <strong>Nitir Kibbeh</strong>
                <small>Traditional Ethiopian butter</small>
              </div>

              <div className="showcase-card showcase-card-three">
                <span>🌾</span>
                <strong>Shiro</strong>
                <small>Made for everyday cooking</small>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* FEATURED PRODUCTS */}
      <section className="home-products-section">
        <div className="container">

          <div className="home-section-heading">

            <div>
              <span className="home-eyebrow">
                SHOP OUR COLLECTION
              </span>

              <h2>
                Featured Products
              </h2>
            </div>

            <Link
              href="/products"
              className="home-view-all"
            >
              View all →
            </Link>

          </div>


          {products.length > 0 ? (
            <div className="product-grid">
              {products.slice(0, 6).map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="empty-box">
              Products will appear here when the admin adds them.
            </div>
          )}

        </div>
      </section>


      {/* HOW IT WORKS */}
      <section className="home-how-section">
        <div className="container">

          <div className="home-section-heading centered">
            <span className="home-eyebrow">
              SIMPLE SHOPPING
            </span>

            <h2>
              From our market to you
            </h2>
          </div>


          <div className="home-steps">

            <div className="home-step">
              <div className="home-step-number">
                01
              </div>

              <h3>
                Choose
              </h3>

              <p>
                Browse our collection and find the Ethiopian products you need.
              </p>
            </div>


            <div className="home-step">
              <div className="home-step-number">
                02
              </div>

              <h3>
                Add to Cart
              </h3>

              <p>
                Select your preferred size and quantity, then add it to your cart.
              </p>
            </div>


            <div className="home-step">
              <div className="home-step-number">
                03
              </div>

              <h3>
                Place Your Order
              </h3>

              <p>
                Enter your contact information and send your order easily.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="home-cta-section">
        <div className="container">

          <div className="home-cta-box">

            <div>
              <span className="home-eyebrow">
                BALTENA MARKET
              </span>

              <h2>
                Bring authentic Ethiopian
                <br />
                flavors to your table.
              </h2>

              <p>
                Explore our products and order what you love.
              </p>
            </div>

            <Link
              href="/products"
              className="home-cta-button"
            >
              Browse Products →
            </Link>

          </div>

        </div>
      </section>


      {/* FOOTER */}
      <footer className="bm-footer">

        <div className="bm-footer-container">

          <div className="bm-footer-grid">

            <div className="bm-footer-brand">

              <Link
                href="/"
                className="bm-footer-logo"
              >
                Baltena Market
              </Link>

              <p className="bm-footer-description">
                Your trusted online marketplace for quality
                products in Ethiopia.
              </p>

              <div className="bm-footer-contact-title">
                Contact Us
              </div>

              <div className="bm-footer-social">

                <a
                  href="https://wa.me/251925792929"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bm-social-button bm-whatsapp"
                >
                  <span className="bm-social-icon">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.56 0 .26 5.3.26 11.82c0 2.08.54 4.11 1.57 5.9L.16 24l6.42-1.64a11.78 11.78 0 0 0 5.5 1.36h.01c6.52 0 11.82-5.3 11.82-11.82 0-3.16-1.23-6.13-3.39-8.42ZM12.09 21.7h-.01a9.84 9.84 0 0 1-5.02-1.37l-.36-.21-3.81.97 1.02-3.71-.23-.38a9.83 9.83 0 1 1 8.41 4.7Zm5.4-7.37c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.23-.65.08-1.76-.88-2.92-1.57-4.08-3.55-.31-.54.31-.5.89-1.66.1-.2.05-.37-.03-.52-.08-.15-.68-1.64-.93-2.25-.25-.59-.5-.51-.68-.52h-.58c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.44.25-.71.25-1.32.17-1.44-.07-.13-.27-.2-.57-.35Z" />
                    </svg>
                  </span>

                  <span className="bm-social-text">
                    <strong>WhatsApp</strong>
                    <small>+251 925 792 929</small>
                  </span>
                </a>


                <a
                  href="https://t.me/Summer1444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bm-social-button bm-telegram"
                >
                  <span className="bm-social-icon">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M21.94 3.03 18.5 20.1c-.26 1.2-.98 1.5-1.98.94l-5.48-4.04-2.65 2.55c-.29.29-.53.53-1.09.53l.39-5.59L17.87 5.9c.47-.42-.1-.65-.73-.23L4.1 13.95l-5.3-1.66c-1.15-.36-1.17-1.15.24-1.68L20.02 2.8c.97-.36 1.82.24 1.92.23Z" />
                    </svg>
                  </span>

                  <span className="bm-social-text">
                    <strong>Telegram</strong>
                    <small>@Summer1444</small>
                  </span>
                </a>

              </div>

            </div>


            <div className="bm-footer-column">

              <h3>Quick Links</h3>

              <Link href="/">Home</Link>
              <Link href="/products">Products</Link>
              <Link href="/categories">Categories</Link>
              <Link href="/cart">Cart</Link>

            </div>


            <div className="bm-footer-column">

              <h3>Shop</h3>

              <Link href="/products">All Products</Link>
              <Link href="/categories">Browse Categories</Link>
              <Link href="/cart">Shopping Cart</Link>

            </div>


            <div className="bm-footer-column">

              <h3>Contact Us</h3>

              <p>
                Have a question or need help?
              </p>

              <a
                href="https://wa.me/251925792929"
                target="_blank"
                rel="noopener noreferrer"
                className="bm-footer-contact-link"
              >
                <strong>WhatsApp</strong>
                <span>+251 925 792 929</span>
              </a>

              <a
                href="https://t.me/Summer1444"
                target="_blank"
                rel="noopener noreferrer"
                className="bm-footer-contact-link"
              >
                <strong>Telegram</strong>
                <span>@Summer1444</span>
              </a>

            </div>

          </div>


          <div className="bm-footer-bottom">

            <span>
              © {new Date().getFullYear()} Baltena Market
            </span>

            <span>
              All rights reserved.
            </span>

          </div>

        </div>

      </footer>

    </main>
  )
}
