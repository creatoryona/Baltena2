"use client"

import { useLanguage } from "@/context/LanguageProvider"

export default function LanguageSwitcher() {
  const {
    language,
    setLanguage,
  } = useLanguage()

  return (
    <div
      className="language-switcher"
      aria-label="Language"
    >
      <button
        type="button"
        className={
          language === "en"
            ? "language-button active"
            : "language-button"
        }
        onClick={() => setLanguage("en")}
      >
        EN
      </button>

      <span className="language-divider">
        |
      </span>

      <button
        type="button"
        className={
          language === "am"
            ? "language-button active"
            : "language-button"
        }
        onClick={() => setLanguage("am")}
      >
        አማ
      </button>
    </div>
  )
}
