"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import enTranslations from "@/i18n/locales/en.json"
import arTranslations from "@/i18n/locales/ar.json"

type Locale = "en" | "ar"
type TranslationValue = string | Record<string, any>
type Translations = Record<string, TranslationValue>

interface I18nContextType {
  locale: Locale
  t: (key: string) => string
  changeLocale: (locale: Locale) => void
  dir: "ltr" | "rtl"
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = locale
  }, [locale])

  const translations: Record<Locale, Translations> = {
    en: enTranslations,
    ar: arTranslations,
  }

  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = translations[locale]
    
    for (const k of keys) {
      if (value === undefined) break
      value = value[k]
    }
    
    return typeof value === 'string' ? value : key
  }

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && (savedLocale === "en" || savedLocale === "ar")) {
      setLocale(savedLocale)
    }
  }, [])

  return (
    <I18nContext.Provider
      value={{
        locale,
        t,
        changeLocale,
        dir: locale === "ar" ? "rtl" : "ltr",
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
