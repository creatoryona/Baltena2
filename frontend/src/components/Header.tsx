"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/context/LanguageProvider"
import { translations } from "@/lib/translations/translations"
import LanguageSwitcher from "@/components/LanguageSwitcher"

type CustomerInfo = {
  id?: number
  name: string
  email: string
}

export default function Header() {
  const pathname = usePathname()

  const { language } = useLanguage()
  const t = translations[language]

  const [customer, setCustomer] = useState<CustomerInfo | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    function checkLogin() {
      const customerToken = localStorage.getItem("baltena_customer_token")
      const adminToken = localStorage.getItem("baltena_admin_token")

      if (adminToken) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }

      if (customerToken) {
        try {
          const rawCustomer = localStorage.getItem("baltena_customer")
          if (rawCustomer) {
            setCustomer(JSON.parse(rawCustomer))
          } else {
            setCustomer({ name: "Account", email: "" })
          }
        } catch {
          setCustomer({ name: "Account", email: "" })
        }
      } else {
        setCustomer(null)
      }
    }

    checkLogin()
  }, [pathname])

  function handleLogout() {
    localStorage.removeItem("baltena_customer_token")
    localStorage.removeItem("baltena_customer")
    localStorage.removeItem("baltena_admin_token")
    localStorage.removeItem("baltena_admin")
    window.location.href = "/"
  }

  // Do not render customer storefront header inside admin or login pages.
  // Also hide during SSR hydration (pathname is null) to avoid a flash.
  if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null
  }

  const initial = customer?.name ? customer.name.charAt(0).toUpperCase() : "U"

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link
          href="/"
          className="site-logo"
        >
          <img
            src="/logo.jpg"
            alt="Bealtena Logo"
            className="site-logo-image"
          />
          <span>Bealtena</span>
        </Link>

        <nav className="site-nav">
          {/* Only show customer nav links when a customer (not admin) is logged in */}
          {!isAdmin && (
            <>
              <Link href="/">{t.nav.home}</Link>
              <Link href="/products">{t.nav.products}</Link>
              <Link href="/cart">{t.nav.cart}</Link>
            </>
          )}

          {/* Customer Logged In: Show Account Name & Profile Pill */}
          {customer ? (
            <div className="header-user-menu">
              <Link href="/profile" className="header-profile-link" title="My Account">
                <span className="header-user-avatar">{initial}</span>
                <span className="header-user-name">{customer.name.split(" ")[0]}</span>
              </Link>
              <button
                type="button"
                className="header-logout-btn"
                onClick={handleLogout}
                title="Log out"
              >
                {t.nav.logout}
              </button>
            </div>
          ) : isAdmin ? (
            <div className="header-user-menu">
              <Link href="/admin" className="header-profile-link admin-pill">
                <span className="header-user-avatar admin-avatar">⚙</span>
                <span className="header-user-name">Admin</span>
              </Link>
              <button
                type="button"
                className="header-logout-btn"
                onClick={handleLogout}
              >
                {t.nav.logout}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="admin-login-button"
            >
              {t.nav.login}
            </Link>
          )}

          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}
