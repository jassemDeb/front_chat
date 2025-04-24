"use client"

import { useI18n } from "./i18n-provider"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CtaSection() {
  const { t, locale } = useI18n()

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-20"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
      </div>
      
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white">
            {t("cta.ctaTitle")}
          </h2>
          <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
            {t("cta.ctaSubtitle")}
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button 
              size="lg" 
              asChild 
              className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg font-medium"
            >
              <Link href="/signin" className="flex items-center">
                {t("landingPage.startChatting")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
          
          <p className="mt-6 text-white/80 text-sm">
            {locale === "ar" ? "لا حاجة لإنشاء حساب. ابدأ المحادثة الآن!" : "No account needed. Start chatting right away!"}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
