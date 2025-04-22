"use client"

import { useI18n } from "./i18n-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import ChatPreview from "./chat-preview"

export default function HeroSection() {
  const { t } = useI18n()
  const router = useRouter()

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <Badge variant="outline" className="px-3 py-1 text-sm">
              {t("landingPage.betaVersion")}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {t("landingPage.heroTitle")}
              <span className="text-primary"> {t("landingPage.heroTitleHighlight")}</span>
            </h1>
            <p className="text-xl text-muted-foreground">{t("landingPage.heroSubtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" onClick={() => router.push("/signin")}>
                {t("landingPage.startChatting")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                {t("landingPage.learnMore")}
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md border rounded-lg shadow-lg overflow-hidden bg-background">
            <ChatPreview />
          </div>
        </div>
      </div>
    </section>
  )
}
