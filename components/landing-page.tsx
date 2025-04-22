"use client"

import { useI18n } from "./i18n-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Languages, Moon, Sun, ArrowRight, MessageSquare, Sparkles, Globe, Lock, Zap, Brain } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ChatPreview from "./chat-preview"

export default function LandingPage() {
  const { t, changeLocale, locale, dir } = useI18n()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const toggleLanguage = () => {
    changeLocale(locale === "en" ? "ar" : "en")
  }

  return (
    <div className="flex min-h-screen flex-col" dir={dir}>
      {/* Header */}
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
            <Button asChild>
              <Link href="/chat">{t("landingPage.startChatting")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
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
                <Button size="lg" onClick={() => router.push("/chat")}>
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

      {/* Features Section */}
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
                  <Link href="/chat">{t("features.tryItNow")}</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Models Section */}
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

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t("faq.faqTitle")}</h2>
            <p className="text-xl text-muted-foreground">{t("faq.faqSubtitle")}</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{t("faq.faqQuestion1")}</AccordionTrigger>
              <AccordionContent>{t("faq.faqAnswer1")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>{t("faq.faqQuestion2")}</AccordionTrigger>
              <AccordionContent>{t("faq.faqAnswer2")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>{t("faq.faqQuestion3")}</AccordionTrigger>
              <AccordionContent>{t("faq.faqAnswer3")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>{t("faq.faqQuestion4")}</AccordionTrigger>
              <AccordionContent>{t("faq.faqAnswer4")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>{t("faq.faqQuestion5")}</AccordionTrigger>
              <AccordionContent>{t("faq.faqAnswer5")}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">{t("cta.ctaTitle")}</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">{t("cta.ctaSubtitle")}</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/chat">
              {t("landingPage.startChatting")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  )
}
