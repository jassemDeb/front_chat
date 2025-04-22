"use client"

import { useI18n } from "./i18n-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ModelsSection() {
  const { t } = useI18n()

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t("supportedModels.supportedModelsTitle")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("supportedModels.supportedModelsSubtitle")}</p>
        </div>

        <Tabs defaultValue="openai" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
          </TabsList>
          <TabsContent value="openai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>GPT-4</CardTitle>
                <CardDescription>{t("supportedModels.gpt4Description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t("supportedModels.modelFeature1")}</li>
                  <li>{t("supportedModels.modelFeature2")}</li>
                  <li>{t("supportedModels.modelFeature3")}</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>GPT-3.5 Turbo</CardTitle>
                <CardDescription>{t("supportedModels.gpt35Description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t("supportedModels.modelFeature4")}</li>
                  <li>{t("supportedModels.modelFeature5")}</li>
                  <li>{t("supportedModels.modelFeature6")}</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="anthropic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Claude 3 Opus</CardTitle>
                <CardDescription>{t("supportedModels.claudeOpusDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t("supportedModels.modelFeature7")}</li>
                  <li>{t("supportedModels.modelFeature8")}</li>
                  <li>{t("supportedModels.modelFeature9")}</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Claude 3 Sonnet</CardTitle>
                <CardDescription>{t("supportedModels.claudeSonnetDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t("supportedModels.modelFeature10")}</li>
                  <li>{t("supportedModels.modelFeature11")}</li>
                  <li>{t("supportedModels.modelFeature12")}</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="google" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gemini Pro</CardTitle>
                <CardDescription>{t("supportedModels.geminiDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t("supportedModels.modelFeature13")}</li>
                  <li>{t("supportedModels.modelFeature14")}</li>
                  <li>{t("supportedModels.modelFeature15")}</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
