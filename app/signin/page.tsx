"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useI18n } from "@/components/i18n-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Github, Mail, LogIn } from "lucide-react"
import { toast } from "sonner"
import { storeTokens } from "@/utils/auth"
import { login } from "@/api/auth"
import { motion } from "framer-motion"

export default function SignIn() {
  const { t, dir, locale } = useI18n()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Use the login API function
      const data = await login({ email, password })
      
      // Store tokens using the auth utility
      storeTokens(data.access, data.refresh)
      
      // Store user data
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      
      // Show success message
      toast.success(data.message || t("auth.loginSuccess"))
      
      // Redirect to chat page
      router.push("/chat")
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error(error instanceof Error ? error.message : t("auth.loginError"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col" dir={dir}>
      <Navbar showChatButton={false} />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-gray-950 dark:to-purple-950 -z-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <motion.h1 
              className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {locale === "ar" ? "مرحبًا بعودتك" : "Welcome Back"}
            </motion.h1>
            <motion.p 
              className="text-gray-600 dark:text-gray-400 mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {locale === "ar" ? "سجل دخولك للوصول إلى حسابك" : "Sign in to access your account"}
            </motion.p>
          </div>
          
          <motion.div 
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Button 
                variant="outline" 
                className="w-full border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                disabled={isLoading}
              >
                <Github className="mr-2 h-4 w-4 text-gray-700 dark:text-gray-300" />
                {locale === "ar" ? "تسجيل الدخول باستخدام جيثب" : "Sign in with GitHub"}
              </Button>
            </motion.div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                  {locale === "ar" ? "أو" : "OR"}
                </span>
              </div>
            </div>
            
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">{locale === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={locale === "ar" ? "name@example.com" : "name@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-200 dark:border-gray-800 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">{locale === "ar" ? "كلمة المرور" : "Password"}</Label>
                  <Link 
                    href="#" 
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                  >
                    {locale === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-200 dark:border-gray-800 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {locale === "ar" ? "جاري تسجيل الدخول..." : "Signing in..."}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    {locale === "ar" ? "تسجيل الدخول" : "Sign in"}
                  </span>
                )}
              </Button>
            </motion.form>
          </motion.div>
          
          <motion.div 
            className="text-center text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <span className="text-gray-600 dark:text-gray-400">{locale === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}</span>{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors">
              {locale === "ar" ? "إنشاء حساب" : "Sign up"}
            </Link>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}
