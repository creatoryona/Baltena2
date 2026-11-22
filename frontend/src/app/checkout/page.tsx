"use client"

import {
  FormEvent,
  useEffect,
  useState,
} from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useCart } from "@/components/CartProvider"
import { createOrder } from "@/lib/api"

import {
  isCustomerLoggedIn,
} from "@/lib/customer-api"

import { useLanguage } from "@/context/LanguageProvider"

import {
  translations,
} from "@/lib/translations/translations"

const regions = [
  "Addis Ababa",
  "Afar",
  "Amhara",
  "Benishangul-Gumuz",
  "Central Ethiopia",
  "Dire Dawa",
  "Gambela",
  "Harari",
  "Oromia",
  "Sidama",
  "Somali",
  "South Ethiopia",
  "Southwest Ethiopia",
  "Tigray",
]

export default function CheckoutPage() {
  const router = useRouter()

  const {
    items,
    clearCart,
  } = useCart()

  const { language } = useLanguage()
  const t = translations[language]

  const [checkingAuth, setCheckingAuth] =
    useState(true)

  const [authorized, setAuthorized] =
    useState(false)

  const [customerName, setCustomerName] =
    useState("")

  const [phone, setPhone] =
    useState("")

  const [customerId, setCustomerId] =
    useState<number | undefined>(undefined)

  const [region, setRegion] =
    useState("")

  const [city, setCity] =
    useState("")

  const [subCity, setSubCity] =
    useState("")

  const [woreda, setWoreda] =
    useState("")

  const [houseNumber, setHouseNumber] =
    useState("")

  const [address, setAddress] =
    useState("")

  const [note, setNote] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      router.replace(
        `/login?redirect=${encodeURIComponent("/checkout")}`
      )

      return
    }

    try {
      const savedCustomer =
        localStorage.getItem(
          "baltena_customer"
        )

      if (savedCustomer) {
        const customer =
          JSON.parse(savedCustomer)

        if (customer?.name) {
          setCustomerName(
            customer.name
          )
        }

        if (customer?.phone) {
          setPhone(customer.phone)
        }

        if (customer?.id) {
          setCustomerId(customer.id)
        }
      }
    } catch {
      // Ignore invalid saved customer data.
    }

    setAuthorized(true)
    setCheckingAuth(false)
  }, [router])

  const total = items.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        item.quantity,
    0
  )

  const totalItems = items.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  )

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!isCustomerLoggedIn()) {
      router.push(
        `/login?redirect=${encodeURIComponent("/checkout")}`
      )
      return
    }

    if (items.length === 0) {
      setError(
        t.cart.empty
      )
      return
    }

    setError("")
    setLoading(true)

    try {
      const order = await createOrder({
        customerName:
          customerName.trim(),

        phone:
          phone.trim(),

        customerId,

        region:
          region.trim(),

        city:
          city.trim(),

        subCity:
          subCity.trim(),

        woreda:
          woreda.trim(),

        houseNumber:
          houseNumber.trim(),

        address:
          address.trim(),

        note:
          note.trim(),

        items: items.map((item) => ({
          variantId:
            item.variantId,
          quantity:
            item.quantity,
        })),
      })

      clearCart()

      router.push(
        `/checkout/success?order=${encodeURIComponent(
          order.orderNumber
        )}`
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : language === "am"
            ? "ትዕዛዙን መላክ አልተቻለም።"
            : "Failed to place order"
      )
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <main className="container checkout-page">
        <div className="empty-cart">
          <h1>
            {language === "am"
              ? "መለያዎን በመፈተሽ ላይ..."
              : "Checking your account..."}
          </h1>

          <p>
            {language === "am"
              ? "እባክዎ መለያዎን እስክናረጋግጥ ይጠብቁ።"
              : "Please wait while we verify your account."}
          </p>
        </div>
      </main>
    )
  }

  if (!authorized) {
    return (
      <main className="container checkout-page">
        <div className="empty-cart">
          <h1>
            {language === "am"
              ? "ወደ መግቢያ በመላክ ላይ..."
              : "Redirecting to login..."}
          </h1>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="container checkout-page">
        <div className="empty-cart">
          <h1>
            {language === "am"
              ? "የግዢ ጋሪዎ ባዶ ነው"
              : "Your Cart Is Empty"}
          </h1>

          <p>
            {language === "am"
              ? "ከትዕዛዝ ማጠናቀቂያ በፊት ምርቶችን ወደ ጋሪዎ ይጨምሩ።"
              : "Add products to your cart before checkout."}
          </p>

          <Link
            href="/products"
            className="primary-button"
          >
            {language === "am"
              ? "ምርቶችን ይመልከቱ"
              : "Browse Products"}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container checkout-page">
      <div className="checkout-header">
        <h1>
          {t.checkout.title}
        </h1>

        <p>
          {language === "am"
            ? "መረጃዎን እና የመላኪያ አድራሻዎን ያስገቡ።"
            : "Enter your information and delivery location."}
        </p>
      </div>

      <div className="checkout-layout">
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >
          <section className="checkout-section">
            <h2>
              {t.checkout.customerInformation}
            </h2>

            <div className="form-group">
              <label htmlFor="customerName">
                {language === "am"
                  ? "ሙሉ ስም *"
                  : "Full Name *"}
              </label>

              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(
                    e.target.value
                  )
                }
                placeholder={
                  language === "am"
                    ? "ሙሉ ስምዎን ያስገቡ"
                    : "Enter your full name"
                }
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                {t.checkout.phone} *
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                placeholder="09xxxxxxxx / +251..."
                autoComplete="tel"
                required
              />
            </div>
          </section>

          <section className="checkout-section">
            <h2>
              {language === "am"
                ? "የኢትዮጵያ የመላኪያ አድራሻ"
                : "Ethiopian Delivery Location"}
            </h2>

            <div className="form-group">
              <label htmlFor="region">
                {t.checkout.region} *
              </label>

              <select
                id="region"
                value={region}
                onChange={(e) =>
                  setRegion(
                    e.target.value
                  )
                }
                required
              >
                <option value="">
                  {language === "am"
                    ? "ክልልዎን ይምረጡ"
                    : "Select your region"}
                </option>

                {regions.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="city">
                  {t.checkout.city} *
                </label>

                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) =>
                    setCity(
                      e.target.value
                    )
                  }
                  placeholder={
                    language === "am"
                      ? "ለምሳሌ፦ አዲስ አበባ"
                      : "e.g. Addis Ababa"
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subCity">
                  {t.checkout.subCity}
                </label>

                <input
                  id="subCity"
                  type="text"
                  value={subCity}
                  onChange={(e) =>
                    setSubCity(
                      e.target.value
                    )
                  }
                  placeholder={
                    language === "am"
                      ? "ለምሳሌ፦ ቦሌ"
                      : "e.g. Bole"
                  }
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="woreda">
                  {t.checkout.woreda}
                </label>

                <input
                  id="woreda"
                  type="text"
                  value={woreda}
                  onChange={(e) =>
                    setWoreda(
                      e.target.value
                    )
                  }
                  placeholder={
                    language === "am"
                      ? "የወረዳ ቁጥር/ስም"
                      : "Woreda number/name"
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="houseNumber">
                  {t.checkout.houseNumber}
                </label>

                <input
                  id="houseNumber"
                  type="text"
                  value={houseNumber}
                  onChange={(e) =>
                    setHouseNumber(
                      e.target.value
                    )
                  }
                  placeholder={
                    language === "am"
                      ? "የቤት ወይም የህንፃ ቁጥር"
                      : "House or building number"
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">
                {t.checkout.address}
              </label>

              <textarea
                id="address"
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                placeholder={
                  language === "am"
                    ? "መንገድ፣ መለያ ቦታ፣ አካባቢ፣ የህንፃ ስም..."
                    : "Street, landmark, area, building name..."
                }
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="note">
                {t.checkout.note}
              </label>

              <textarea
                id="note"
                value={note}
                onChange={(e) =>
                  setNote(
                    e.target.value
                  )
                }
                placeholder={
                  t.checkout.notePlaceholder
                }
                rows={3}
              />
            </div>
          </section>

          {error && (
            <div className="checkout-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button checkout-submit"
            disabled={loading}
          >
            {loading
              ? t.checkout.placingOrder
              : t.checkout.placeOrder}
          </button>

          <p className="payment-note">
            {language === "am"
              ? "የመስመር ላይ ክፍያ አያስፈልግም። በሰጡት ስልክ ቁጥር እናገኝዎታለን።"
              : "No online payment is required. We will contact you using the phone number provided."}
          </p>
        </form>

        <aside className="checkout-summary">
          <h2>
            {t.checkout.orderSummary}
          </h2>

          {items.map((item) => (
            <div
              key={item.variantId}
              className="checkout-item"
            >
              <div>
                <strong>
                  {item.productName}
                </strong>

                <p>
                  {t.products.size}:{" "}
                  {item.size} ×{" "}
                  {item.quantity}
                </p>
              </div>

              <span>
                {(
                  Number(item.price) *
                  item.quantity
                ).toFixed(2)}{" "}
                {t.common.etb}
              </span>
            </div>
          ))}

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
        </aside>
      </div>
    </main>
  )
}
