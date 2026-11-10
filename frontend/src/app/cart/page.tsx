"use client"

import Link from "next/link"
import { useCart } from "@/components/CartProvider"
import { useLanguage } from "@/context/LanguageProvider"
import { translations } from "@/lib/translations/translations"

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
  } = useCart()

  const { language } = useLanguage()
  const t = translations[language]

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  )

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  if (items.length === 0) {
    return (
      <main className="container cart-page">
        <div className="empty-cart">
          <h1>{t.cart.title}</h1>

          <p>
            {t.cart.empty}
          </p>

          <Link
            href="/products"
            className="primary-button"
          >
            {t.cart.continueShopping}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container cart-page">
      <div className="cart-header">
        <div>
          <h1>{t.cart.title}</h1>

          <p>
            {totalItems}{" "}
            {totalItems === 1
              ? language === "am"
                ? "ምርት"
                : "item"
              : language === "am"
                ? "ምርቶች"
                : "items"}{" "}
            {language === "am"
              ? "በጋሪዎ ውስጥ አሉ"
              : "in your cart"}
          </p>
        </div>

        <Link
          href="/products"
          className="secondary-button"
        >
          {t.cart.continueShopping}
        </Link>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="cart-item"
            >
              <div className="cart-item-image">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.productName}
                  />
                ) : (
                  <span>
                    {t.products.noImage}
                  </span>
                )}
              </div>

              <div className="cart-item-details">
                <h2>
                  {item.productName}
                </h2>

                <p>
                  {t.products.size}:{" "}
                  <strong>
                    {item.size}
                  </strong>
                </p>

                <p className="cart-item-price">
                  {Number(item.price).toFixed(2)}{" "}
                  {t.common.etb}
                </p>

                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.variantId,
                          Math.max(
                            1,
                            item.quantity - 1
                          )
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.variantId,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() =>
                      removeItem(
                        item.variantId
                      )
                    }
                  >
                    {t.cart.remove}
                  </button>
                </div>
              </div>

              <div className="cart-item-total">
                {(
                  Number(item.price) *
                  item.quantity
                ).toFixed(2)}{" "}
                {t.common.etb}
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>
            {language === "am"
              ? "የትዕዛዝ ማጠቃለያ"
              : "Order Summary"}
          </h2>

          <div className="summary-row">
            <span>
              {language === "am"
                ? "ምርቶች"
                : "Products"}
            </span>

            <span>
              {totalItems}
            </span>
          </div>

          <div className="summary-row">
            <span>
              {t.cart.subtotal}
            </span>

            <span>
              {total.toFixed(2)}{" "}
              {t.common.etb}
            </span>
          </div>

          <div className="summary-row">
            <span>
              {language === "am"
                ? "መላኪያ"
                : "Delivery"}
            </span>

            <span>
              {language === "am"
                ? "የሚዘጋጅ"
                : "To be arranged"}
            </span>
          </div>

          <div className="summary-row total-row">
            <strong>
              {t.cart.total}
            </strong>

            <strong>
              {total.toFixed(2)}{" "}
              {t.common.etb}
            </strong>
          </div>

          <Link
            href="/checkout"
            className="primary-button checkout-button"
          >
            {t.cart.checkout}
          </Link>
        </aside>
      </div>
    </main>
  )
}
