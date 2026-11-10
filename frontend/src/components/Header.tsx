"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/context/LanguageProvider"
import { translations } from "@/lib/translations/translations"
import LanguageSwitcher from "@/components/LanguageSwitcher"

export default function Header() {
  const pathname = usePathname()

  const { language } = useLanguage()
  const t = translations[language]

  const [loggedIn, setLoggedIn] =
    useState(false)

  useEffect(() => {
    function checkLogin() {
      const customerToken =
        localStorage.getItem(
          "baltena_customer_token",
        )

      const adminToken =
        localStorage.getItem(
          "baltena_admin_token",
        )

      setLoggedIn(
        Boolean(customerToken || adminToken),
      )
    }

    checkLogin()
  }, [pathname])

  function handleLogout() {
    localStorage.removeItem(
      "baltena_customer_token",
    )

    localStorage.removeItem(
      "baltena_customer",
    )

    localStorage.removeItem(
      "baltena_admin_token",
    )

    localStorage.removeItem(
      "baltena_admin",
    )

    window.location.href = "/"
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link
          href="/"
          className="site-logo"
        >
          Baltena Market
        </Link>

        <nav className="site-nav">
          <Link href="/">
            {t.nav.home}
          </Link>

          <Link href="/products">
            {t.nav.products}
          </Link>

          <Link href="/cart">
            {t.nav.cart}
          </Link>

          {loggedIn ? (
            <button
              type="button"
              className="admin-login-button"
              onClick={handleLogout}
            >
              {t.nav.logout}
            </button>
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
