"use client"

import { useI18n } from "./i18n-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import ChatPreview from "./chat-preview"
import { motion } from "framer-motion"

export default function HeroSection() {
  const { t } = useI18n()
  const router = useRouter()

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 dark:from-indigo-950 dark:via-purple-950 dark:to-blue-900 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-indigo-400 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto max-w-6xl px-4 relative">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            className="flex-1 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="px-3 py-1 text-sm bg-white/80 dark:bg-black/30 backdrop-blur-sm border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
              {t("landingPage.betaVersion")}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {t("landingPage.heroTitle")}{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                {t("landingPage.heroTitleHighlight")}
              </span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">{t("landingPage.heroSubtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-600/20" onClick={() => router.push("/signin")}>
                {t("landingPage.startChatting")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950">
                {t("landingPage.learnMore")}
              </Button>
            </div>
          </motion.div>
          <motion.div 
            className="flex-1 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="border rounded-xl shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border-indigo-100 dark:border-indigo-900">
              <ChatPreview />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
