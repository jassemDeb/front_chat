"use client"

import { useI18n } from "./i18n-provider"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="py-12 px-4 border-t">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">{t("general.appTitle")}</span>
          </div>
          <div className="flex space-x-6">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.footerLink1")}
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.footerLink2")}
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.footerLink3")}
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.footerLink4")}
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {t("general.appTitle")}. {t("footer.footerRights")}
          </p>
        </div>
      </div>
    </footer>
  )
}
