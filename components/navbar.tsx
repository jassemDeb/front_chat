"use client"

import { useI18n } from "./i18n-provider"
import { Button } from "@/components/ui/button"
import { Languages, Moon, Sun, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"

interface NavbarProps {
  showChatButton?: boolean
}

export default function Navbar({ showChatButton = true }: NavbarProps) {
  const { t, changeLocale, locale, dir } = useI18n()
  const { theme, setTheme } = useTheme()

  const toggleLanguage = () => {
    changeLocale(locale === "en" ? "ar" : "en")
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">{t("general.appTitle")}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Languages className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          {showChatButton && (
            <Button asChild>
              <Link href="/signin">{t("landingPage.startChatting")}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
