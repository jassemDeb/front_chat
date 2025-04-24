"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/components/i18n-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { isAuthenticated } from "@/utils/auth"
import { getUserProfile, updateUserProfile, changePassword } from "@/api/profile"
import type { UserProfile, ProfileUpdateData, PasswordChangeData } from "@/api/profile"
import { motion } from "framer-motion"
import { User, Shield, Save, KeyRound } from "lucide-react"

export default function ProfilePage() {
  const { t, dir, locale, changeLocale } = useI18n()
  const router = useRouter()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Profile form state
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [language, setLanguage] = useState("")
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      router.push("/signin")
      return
    }
    
    // Fetch user profile
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const profileData = await getUserProfile()
        setProfile(profileData)
        
        // Set form values
        setFullname(profileData.fullname || "")
        setEmail(profileData.email || "")
        setLanguage(profileData.language_preference || locale)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error(error instanceof Error ? error.message : t("profile.fetchError"))
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProfile()
  }, [router, locale, t])
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    if (!fullname.trim() || fullname.trim().length < 3) {
      toast.error(t("profile.fullnameRequired"))
      return
    }
    
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(t("profile.invalidEmail"))
      return
    }
    
    setIsSaving(true)
    
    try {
      const profileData: ProfileUpdateData = {
        fullname,
        email,
        language_preference: language
      }
      
      const updatedProfile = await updateUserProfile(profileData)
      setProfile(updatedProfile)
      
      // Update language if changed
      if (language !== locale) {
        changeLocale(language as "en" | "ar")
      }
      
      // Update user data in localStorage
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        user.fullname = fullname
        user.email = email
        user.language_preference = language
        localStorage.setItem('user', JSON.stringify(user))
      }
      
      toast.success(t("profile.updateSuccess"), {
        style: {
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
          color: 'white',
          border: 'none',
          fontWeight: 'bold',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        icon: '✅',
        duration: 5000, // Show for 5 seconds
        position: 'top-center',
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error instanceof Error ? error.message : t("profile.updateError"), {
        style: {
          background: '#fee2e2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        },
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error(t("auth.passwordsDoNotMatch"))
      return
    }
    
    setIsChangingPassword(true)
    
    try {
      const passwordData: PasswordChangeData = {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      }
      
      await changePassword(passwordData)
      
      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      
      toast.success(t("profile.passwordChangeSuccess"))
    } catch (error) {
      console.error("Error changing password:", error)
      toast.error(error instanceof Error ? error.message : t("profile.passwordChangeError"))
    } finally {
      setIsChangingPassword(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col" dir={dir}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-gray-950 dark:to-purple-950 -z-10"></div>
          
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-transparent border-blue-600 dark:border-blue-400 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-lg text-gray-700 dark:text-gray-300">{t("profile.loading")}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen flex-col" dir={dir}>
      <Navbar />
      
      <main className="flex-1 container mx-auto py-10 px-4 relative overflow-hidden">
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
          className="max-w-3xl mx-auto"
        >
          <motion.h1 
            className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("user.userProfile")}
          </motion.h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-1 rounded-lg border border-gray-100 dark:border-gray-800">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <User className="w-4 h-4 mr-2" />
                {t("profile.personalInfo")}
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                {t("profile.security")}
              </TabsTrigger>
            </TabsList>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <TabsContent value="profile">
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                      {t("profile.personalInfo")}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {t("profile.updateProfileInfo")}
                    </CardDescription>
                  </CardHeader>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullname" className="text-base">
                        {t("profile.fullName")}
                      </Label>
                      <Input
                        id="fullname"
                        placeholder={t("profile.fullNamePlaceholder")}
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        className="h-12 text-base bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-blue-100 dark:border-blue-900 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500/20"
                        required
                        minLength={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base">
                        {t("profile.email")}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("profile.emailPlaceholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 text-base bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-blue-100 dark:border-blue-900 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-base">
                        {t("profile.language")}
                      </Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language" className="h-12 text-base bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-blue-100 dark:border-blue-900 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500/20">
                          <SelectValue placeholder={t("profile.selectLanguage")} />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-900 border-blue-100 dark:border-blue-900">
                          <SelectItem value="en" className="text-base">English</SelectItem>
                          <SelectItem value="ar" className="text-base">العربية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t("profile.saving")}
                        </div>
                      ) : (
                        <>
                          <Save className="mr-2 h-5 w-5" />
                          {t("profile.saveChanges")}
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </TabsContent>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <TabsContent value="security">
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                      {t("profile.changePassword")}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {t("profile.updateYourPassword")}
                    </CardDescription>
                  </CardHeader>
                  
                  <form onSubmit={handlePasswordChange}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password" className="text-gray-700 dark:text-gray-300">
                          {t("profile.currentPassword")}
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          className="border-gray-200 dark:border-gray-800 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white/90 dark:bg-gray-800/90"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-gray-700 dark:text-gray-300">
                          {t("profile.newPassword")}
                        </Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="border-gray-200 dark:border-gray-800 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white/90 dark:bg-gray-800/90"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-gray-700 dark:text-gray-300">
                          {t("profile.confirmNewPassword")}
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="border-gray-200 dark:border-gray-800 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white/90 dark:bg-gray-800/90"
                        />
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        type="submit" 
                        disabled={isChangingPassword}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        {isChangingPassword ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t("profile.updating")}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <KeyRound className="mr-2 h-4 w-4" />
                            {t("profile.updatePassword")}
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </motion.div>
          </Tabs>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}
