"use client"

import { useI18n } from "./i18n-provider"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CtaSection() {
  const { t } = useI18n()

  return (
    <section className="py-20 px-4 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-4">{t("cta.ctaTitle")}</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">{t("cta.ctaSubtitle")}</p>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/signin">
            {t("landingPage.startChatting")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
