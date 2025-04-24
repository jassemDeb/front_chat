"use client"

import { useI18n } from "./i18n-provider"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function Footer() {
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)

  // After hydration, we can show the logo
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <footer className="py-12 px-4 border-t bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            {mounted ? (
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo.png"
                  alt={t("general.appTitle")} 
                  width={200} 
                  height={200} 
                  className="h-16 w-auto" 
                  priority
                />
              </Link>
            ) : (
              <div className="h-12 w-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t("footer.footerLink1")}
            </Link>
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t("footer.footerLink2")}
            </Link>
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t("footer.footerLink3")}
            </Link>
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t("footer.footerLink4")}
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {t("general.appTitle")}. {t("footer.footerRights")}
          </p>
        </div>
      </div>
    </footer>
  )
}
