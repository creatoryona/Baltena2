"use client"

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react"
import {
  useRouter,
  useSearchParams,
} from "next/navigation"
import Link from "next/link"

import {
  customerLogin,
  customerRegister,
} from "@/lib/customer-api"
import { adminLogin } from "@/lib/admin-api"

import { useLanguage } from "@/context/LanguageProvider"

import {
  translations,
} from "@/lib/translations/translations"

import LanguageSwitcher from "@/components/LanguageSwitcher"

import "./login.css"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { language } = useLanguage()
  const t = translations[language]

  const redirect =
    searchParams.get("redirect") || "/"
  const requestedRole =
    searchParams.get("role") === "admin"
      ? "admin"
      : "customer"

  const [mode, setMode] = useState<
    "login" | "register"
  >("login")
  const [role, setRole] = useState<
    "customer" | "admin"
  >(requestedRole)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasAdminSession = Boolean(
        localStorage.getItem("baltena_admin_token"),
      )

      if (requestedRole === "admin" && hasAdminSession) {
        router.replace("/admin")
        return
      }
    }

    setRole(requestedRole)
    setMode("login")
  }, [requestedRole, router])

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError("")
    setMessage("")
    setLoading(true)

    try {
      if (role === "admin") {
        if (mode === "register") {
          setError("Admin accounts cannot be registered here.")
          return
        }

        await adminLogin(email.trim(), password)
        router.push("/admin")
        router.refresh()
        return
      }

      if (mode === "register") {
        await customerRegister(
          name.trim(),
          email.trim(),
          password,
        )

        router.push(redirect)
        router.refresh()

        return
      }

      const data = await customerLogin(
        email.trim(),
        password,
      )

      if (data.role === "admin") {
        router.push("/admin")
        router.refresh()

        return
      }

      router.push(redirect)
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : language === "am"
            ? "አንድ ችግር ተፈጥሯል።"
            : "Something went wrong",
      )
    } finally {
      setLoading(false)
    }
  }

  function switchMode() {
    if (role === "admin") {
      setMode("login")
      setError("")
      setMessage("")
      return
    }

    setError("")
    setMessage("")

    setMode((current) =>
      current === "login"
        ? "register"
        : "login",
    )
  }

  function handleForgotPassword() {
    setError("")

    setMessage(
      language === "am"
        ? "የይለፍ ቃል መመለሻ በኋላ ይጨመራል።"
        : "Password recovery will be added later.",
    )
  }

  return (
    <main
      className="login-page"
      style={{
        backgroundImage:
          'url("/login-background.png?v=20261118")',
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f7f6f2",
      }}
    >
      <header className="login-header">
        <div className="login-header-inner">
          <Link
            href="/"
            className="login-logo"
          >
            <img
              src="/login-logo.png"
              alt="Bealtena Logo"
              className="login-logo-image"
            />

            <span>Bealtena</span>
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <LanguageSwitcher />

            <Link
              href="/"
              className="login-back"
            >
              {t.common.back}
            </Link>
          </div>
        </div>
      </header>

      <section className="login-content">
        <div className="login-wrapper">
          <div className="login-badge-logo">
            <img
              src="/login-logo.png"
              alt="Bealtena Traditional Ethiopian Provisions"
              className="login-card-logo"
            />
          </div>

          <div className="login-heading">
            <h1>
              {role === "admin"
                ? "Admin Login"
                : mode === "login"
                  ? t.auth.login
                  : t.auth.register}
            </h1>

            <p>
              {role === "admin"
                ? "Sign in to the Bealtena admin dashboard."
                : mode === "login"
                  ? language === "am"
                    ? "ወደ ባልትና ወጤቶች ለመቀጠል ይግቡ።"
                    : "Sign in to continue to Bealtena."
                  : language === "am"
                    ? "የባልትና ወጤቶች የደንበኛ መለያዎን ይፍጠሩ።"
                    : "Create your Bealtena customer account."}
            </p>
          </div>

          <div className="login-card">
            <div className="login-role-switch">
              <button
                type="button"
                className={`login-role-option ${role === "customer" ? "is-active" : ""}`}
                onClick={() => {
                  setRole("customer")
                  setMode("login")
                  setError("")
                  setMessage("")
                }}
              >
                Customer
              </button>
              <button
                type="button"
                className={`login-role-option ${role === "admin" ? "is-active" : ""}`}
                onClick={() => {
                  setRole("admin")
                  setMode("login")
                  setError("")
                  setMessage("")
                }}
              >
                Admin
              </button>
            </div>
            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            {message && (
              <div className="login-message" role="status">
                {message}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="login-form"
              aria-busy={loading}
            >
              {role === "customer" && mode === "register" && (
                <div className="login-field">
                  <label htmlFor="name">
                    {t.auth.name}
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder={
                      language === "am"
                        ? "ስምዎን ያስገቡ"
                        : "Your name"
                    }
                    autoComplete="name"
                    required
                    disabled={loading}
                  />
                </div>
              )}

              <div className="login-field">
                <label htmlFor="email">
                  {t.auth.email}
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="login-field">
                <div className="login-label-row">
                  <label htmlFor="password">
                    {t.auth.password}
                  </label>

                  {role === "customer" && mode === "login" && (
                    <button
                      type="button"
                      className="login-forgot"
                      onClick={
                        handleForgotPassword
                      }
                    >
                      {language === "am"
                        ? "የይለፍ ቃል ረሱ?"
                        : "Forgot password?"}
                    </button>
                  )}
                </div>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder={
                    language === "am"
                      ? "የይለፍ ቃልዎን ያስገቡ"
                      : "Enter your password"
                  }
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
                aria-busy={loading}
              >
                {loading
                  ? language === "am"
                    ? "እባክዎ ይጠብቁ..."
                    : "Please wait..."
                  : role === "admin"
                    ? "Admin Login"
                    : mode === "login"
                      ? t.auth.loginButton
                      : t.auth.registerButton}
              </button>
            </form>

            {role === "customer" && (
              <div className="login-switch">
                <p>
                  {mode === "login"
                    ? t.auth.noAccount
                    : t.auth.haveAccount}

                  <button
                    type="button"
                    onClick={switchMode}
                  >
                    {mode === "login"
                      ? t.auth.createAccount
                      : t.auth.loginHere}
                  </button>
                </p>
              </div>
            )}
          </div>

          <div className="login-footer">
            <p>
              Bealtena · Traditional Ethiopian Provisions
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
