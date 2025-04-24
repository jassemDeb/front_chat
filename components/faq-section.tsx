"use client"

import { useI18n } from "./i18n-provider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { HelpCircle } from "lucide-react"

export default function FaqSection() {
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
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <section className="py-24 px-4 relative">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-blue-950 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="container mx-auto max-w-3xl relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
            {t("faq.faqTitle")}
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            {t("faq.faqSubtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6"
        >
          <Accordion type="single" collapsible className="w-full">
            <motion.div variants={item}>
              <AccordionItem value="item-1" className="border-b border-gray-200 dark:border-gray-800">
                <AccordionTrigger className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-4">
                  {t("faq.faqQuestion1")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 pb-4">
                  {t("faq.faqAnswer1")}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
            
            <motion.div variants={item}>
              <AccordionItem value="item-2" className="border-b border-gray-200 dark:border-gray-800">
                <AccordionTrigger className="text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-4">
                  {t("faq.faqQuestion2")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 pb-4">
                  {t("faq.faqAnswer2")}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
            
            <motion.div variants={item}>
              <AccordionItem value="item-3" className="border-b border-gray-200 dark:border-gray-800">
                <AccordionTrigger className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-4">
                  {t("faq.faqQuestion3")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 pb-4">
                  {t("faq.faqAnswer3")}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
            
            <motion.div variants={item}>
              <AccordionItem value="item-4" className="border-b border-gray-200 dark:border-gray-800">
                <AccordionTrigger className="text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-4">
                  {t("faq.faqQuestion4")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 pb-4">
                  {t("faq.faqAnswer4")}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
            
            <motion.div variants={item}>
              <AccordionItem value="item-5" className="border-b-0">
                <AccordionTrigger className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-4">
                  {t("faq.faqQuestion5")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 pb-4">
                  {t("faq.faqAnswer5")}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
