"use client"

import { useI18n } from "./i18n-provider"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Brain, MessageSquare, Zap, Lock, Sparkles } from "lucide-react"
import Link from "next/link"

export default function FeaturesSection() {
  const { t } = useI18n()

  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t("features.featuresTitle")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("features.featuresSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Globe className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t("features.featureMultilingualTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("features.featureMultilingualDescription")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t("features.featureMultiModelTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("features.featureMultiModelDescription")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t("features.featureChatHistoryTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("features.featureChatHistoryDescription")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t("features.featurePersonalizationTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("features.featurePersonalizationDescription")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t("features.featureSecurityTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("features.featureSecurityDescription")}</p>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <Sparkles className="h-10 w-10 mb-2" />
              <CardTitle>{t("features.featureAITitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("features.featureAIDescription")}</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/signin">{t("features.tryItNow")}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
