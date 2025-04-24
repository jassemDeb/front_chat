"use client"

import { useI18n } from "./i18n-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function ModelsSection() {
  const { locale } = useI18n()

  return (
    <section className="py-24 px-4 relative">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-50 via-white to-blue-50 dark:from-purple-950 dark:via-gray-950 dark:to-blue-950 -z-10"></div>
      
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            {locale === "ar" ? "النماذج المدعومة" : "Supported Models"}
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            {locale === "ar" ? "استكشف النماذج المتقدمة التي تدعمها منصةنا" : "Explore the advanced models supported by our platform"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="facebook" className="w-full max-w-3xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <TabsTrigger 
                value="facebook" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-md transition-all duration-300"
              >
                Facebook
              </TabsTrigger>
              <TabsTrigger 
                value="mbzuai" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-300"
              >
                MBZUAI
              </TabsTrigger>
              <TabsTrigger 
                value="deepseek" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-md transition-all duration-300"
              >
                DeepSeek
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="facebook" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border border-blue-100 dark:border-blue-900 overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                  <div className="absolute h-1 w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-blue-700 dark:text-blue-300">BlenderBot</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          {locale === "ar" 
                            ? "نموذج محادثة متقدم من فيسبوك مصمم للمحادثات الطبيعية والتفاعلية"
                            : "Facebook's advanced conversational model designed for natural, engaging dialogue"
                          }
                        </CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800">400M Parameters</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2 text-blue-500 dark:text-blue-400">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {locale === "ar" 
                            ? "محادثات طبيعية مع ذاكرة سياق طويلة المدى"
                            : "Natural conversations with long-term context memory"
                          }
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-blue-500 dark:text-blue-400">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {locale === "ar" 
                            ? "مدرب على بيانات محادثة متنوعة لاستجابات أكثر إنسانية"
                            : "Trained on diverse conversation data for more human-like responses"
                          }
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-blue-500 dark:text-blue-400">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {locale === "ar" 
                            ? "يعمل بشكل جيد مع الأسئلة العامة والمحادثات اليومية"
                            : "Excels at general questions and everyday conversations"
                          }
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="mbzuai" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border border-purple-100 dark:border-purple-900 overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                  <div className="absolute h-1 w-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-purple-700 dark:text-purple-300">LaMini-T5</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          {locale === "ar" 
                            ? "نموذج لغة متعدد اللغات من جامعة محمد بن زايد للذكاء الاصطناعي"
                            : "Multilingual language model from Mohamed bin Zayed University of AI"
                          }
                        </CardDescription>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800">248M Parameters</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2 text-purple-500 dark:text-purple-400">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {locale === "ar" 
                            ? "دعم متميز للغة العربية والإنجليزية ولغات أخرى"
                            : "Superior support for Arabic, English, and other languages"
                          }
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-purple-500 dark:text-purple-400">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {locale === "ar" 
                            ? "مبني على هيكلية T5 المتقدمة للفهم والإنشاء"
                            : "Built on advanced T5 architecture for understanding and generation"
                          }
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-purple-500 dark:text-purple-400">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {locale === "ar" 
                            ? "مثالي للمهام متعددة اللغات والترجمة"
                            : "Ideal for multilingual tasks and translation"
                          }
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="deepseek" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border border-teal-100 dark:border-teal-900 overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                  <div className="absolute h-1 w-full bg-gradient-to-r from-teal-400 to-teal-600"></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-teal-700 dark:text-teal-300">DeepSeek Coder</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          {locale === "ar" 
                            ? "نموذج متخصص في فهم وإنشاء التعليمات البرمجية بمختلف اللغات"
                            : "Specialized model for understanding and generating code in various languages"
                          }
                        </CardDescription>
                      </div>
                      <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-800">1.3B Parameters</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2 text-teal-500 dark:text-teal-400">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {locale === "ar" 
                            ? "فهم متقدم للغات البرمجة المختلفة وهياكل الكود"
                            : "Advanced understanding of various programming languages and code structures"
                          }
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-teal-500 dark:text-teal-400">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {locale === "ar" 
                            ? "يمكنه شرح الكود وتحسينه واقتراح الحلول البرمجية"
                            : "Can explain, optimize, and suggest solutions for code"
                          }
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-teal-500 dark:text-teal-400">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {locale === "ar" 
                            ? "مثالي للمساعدة في حل المشكلات البرمجية والتطوير"
                            : "Ideal for programming assistance, problem-solving, and development"
                          }
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}
