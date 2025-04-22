"use client"

import { useI18n } from "./i18n-provider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqSection() {
  const { t } = useI18n()

  return (
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
  )
}
