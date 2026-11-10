"use client"

import {
  FormEvent,
  Suspense,
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

  const [mode, setMode] = useState<
    "login" | "register"
  >("login")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError("")
    setMessage("")
    setLoading(true)

    try {
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

      // Admin goes to admin dashboard.
      if (data.role === "admin") {
        router.push("/admin")
        router.refresh()

        return
      }

      // Customer goes back to the page
      // they originally wanted to visit.
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
    <main className="login-page">
      <header className="login-header">
        <div className="login-header-inner">
          <Link
            href="/"
            className="login-logo"
          >
            Baltena Market
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
          <div className="login-heading">
            <h1>
              {mode === "login"
                ? t.auth.login
                : t.auth.register}
            </h1>

            <p>
              {mode === "login"
                ? language === "am"
                  ? "ወደ ባልትና ማርኬት ለመቀጠል ይግቡ።"
                  : "Sign in to continue to Baltena Market."
                : language === "am"
                  ? "የባልትና ማርኬት የደንበኛ መለያዎን ይፍጠሩ።"
                  : "Create your Baltena Market customer account."}
            </p>
          </div>

          <div className="login-card">
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {message && (
              <div className="login-message">
                {message}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="login-form"
            >
              {mode === "register" && (
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
                />
              </div>

              <div className="login-field">
                <div className="login-label-row">
                  <label htmlFor="password">
                    {t.auth.password}
                  </label>

                  {mode === "login" && (
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
                />
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading
                  ? language === "am"
                    ? "እባክዎ ይጠብቁ..."
                    : "Please wait..."
                  : mode === "login"
                    ? t.auth.loginButton
                    : t.auth.registerButton}
              </button>
            </form>

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
          </div>

          <div className="login-footer">
            <p>
              Baltena Market
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
