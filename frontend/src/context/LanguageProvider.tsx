"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

export type Language = "en" | "am"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
}

const LanguageContext =
  createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [language, setLanguageState] =
    useState<Language>("en")

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("baltena-language")

    if (
      savedLanguage === "en" ||
      savedLanguage === "am"
    ) {
      setLanguageState(savedLanguage)
    }
  }, [])

  function setLanguage(language: Language) {
    setLanguageState(language)
    localStorage.setItem(
      "baltena-language",
      language,
    )
  }

  function toggleLanguage() {
    setLanguage(
      language === "en" ? "am" : "en",
    )
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider",
    )
  }

  return context
}
