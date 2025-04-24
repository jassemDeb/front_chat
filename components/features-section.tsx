"use client"

import { useI18n } from "./i18n-provider"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Brain, MessageSquare, Zap, Lock, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function FeaturesSection() {
  const { t } = useI18n()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-950 dark:to-indigo-950 -z-10"></div>
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5 -z-10"></div>
      
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            {t("features.featuresTitle")}
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            {t("features.featuresSubtitle")}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={item}>
            <Card className="border border-indigo-100 dark:border-indigo-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300 hover:border-indigo-300 dark:hover:border-indigo-700">
              <CardHeader>
                <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 w-fit mb-4">
                  <Globe className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-xl text-indigo-700 dark:text-indigo-300">{t("features.featureMultilingualTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">{t("features.featureMultilingualDescription")}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border border-purple-100 dark:border-purple-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300 hover:border-purple-300 dark:hover:border-purple-700">
              <CardHeader>
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50 w-fit mb-4">
                  <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl text-purple-700 dark:text-purple-300">{t("features.featureMultiModelTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">{t("features.featureMultiModelDescription")}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border border-blue-100 dark:border-blue-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300 hover:border-blue-300 dark:hover:border-blue-700">
              <CardHeader>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 w-fit mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl text-blue-700 dark:text-blue-300">{t("features.featureChatHistoryTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">{t("features.featureChatHistoryDescription")}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border border-pink-100 dark:border-pink-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300 hover:border-pink-300 dark:hover:border-pink-700">
              <CardHeader>
                <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/50 w-fit mb-4">
                  <Zap className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                </div>
                <CardTitle className="text-xl text-pink-700 dark:text-pink-300">{t("features.featureSpeedTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">{t("features.featureSpeedDescription")}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border border-teal-100 dark:border-teal-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300 hover:border-teal-300 dark:hover:border-teal-700">
              <CardHeader>
                <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/50 w-fit mb-4">
                  <Lock className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle className="text-xl text-teal-700 dark:text-teal-300">{t("features.featureSecurityTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">{t("features.featureSecurityDescription")}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border border-amber-100 dark:border-amber-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300 hover:border-amber-300 dark:hover:border-amber-700">
              <CardHeader>
                <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/50 w-fit mb-4">
                  <Sparkles className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-xl text-amber-700 dark:text-amber-300">{t("features.featureAITitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">{t("features.featureAIDescription")}</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/signin">{t("features.tryItNow")}</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
