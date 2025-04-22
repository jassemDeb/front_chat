"use client"

import { useState } from "react"
import Link from "next/link"
import { useI18n } from "@/components/i18n-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Github, Mail } from "lucide-react"

export default function SignUp() {
  const { t, dir } = useI18n()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }
    
    if (!agreedToTerms) {
      alert("You must agree to the terms and conditions")
      return
    }
    
    setIsLoading(true)
    
    // Here you would implement your actual registration logic
    // This is just a placeholder
    try {
      console.log("Signing up with:", name, email, password)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to chat page on success
      window.location.href = "/chat"
    } catch (error) {
      console.error("Sign up error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col" dir={dir}>
      <Navbar showChatButton={false} />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{t("auth.createAccount")}</h1>
            <p className="text-muted-foreground mt-2">{t("auth.signUpDescription")}</p>
          </div>
          
          <div className="space-y-4">
            <Button variant="outline" className="w-full" disabled={isLoading}>
              <Github className="mr-2 h-4 w-4" />
              {t("auth.signInWithGithub")}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("auth.or")}
                </span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("auth.name")}</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                >
                  {t("auth.termsAgree")}{" "}
                  <Link href="#" className="text-primary hover:underline">
                    {t("auth.termsOfService")}
                  </Link>{" "}
                  {t("auth.and")}{" "}
                  <Link href="#" className="text-primary hover:underline">
                    {t("auth.privacyPolicy")}
                  </Link>
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !agreedToTerms}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t("auth.signUp")}...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    {t("auth.signUp")}
                  </span>
                )}
              </Button>
            </form>
          </div>
          
          <div className="text-center text-sm">
            <span className="text-muted-foreground">{t("auth.haveAccount")}</span>{" "}
            <Link href="/signin" className="text-primary hover:underline">
              {t("auth.signIn")}
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
