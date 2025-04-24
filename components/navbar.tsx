"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "./i18n-provider"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Languages, Moon, Sparkles, Sun, UserCircle, LogOut, MessageCircle, LogIn } from "lucide-react"
import { isAuthenticated, logout } from "@/utils/auth"
import { toast } from "sonner"

interface NavbarProps {
  showChatButton?: boolean
}

export default function Navbar({ showChatButton = true }: NavbarProps) {
  const { t, changeLocale, locale, dir } = useI18n()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [mounted, setMounted] = useState(false)

  // After hydration, we can show the theme toggle
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsLoggedIn(authenticated)
      
      // Get user data if authenticated
      if (authenticated) {
        try {
          const userData = localStorage.getItem('user')
          if (userData) {
            const user = JSON.parse(userData)
            setUserName(user.fullname || user.email || t("user.userProfile"))
          }
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }
    }
    
    checkAuth()
    
    // Add event listener for storage changes (for cross-tab login/logout)
    window.addEventListener('storage', checkAuth)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
    }
  }, [t])

  const toggleLanguage = () => {
    changeLocale(locale === "en" ? "ar" : "en")
  }
  
  const handleLogout = async () => {
    try {
      await logout()
      toast.success(t("auth.logoutSuccess") || "Logged out successfully")
      setIsLoggedIn(false)
      setUserName("")
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error(t("auth.logoutError") || "Error logging out")
    }
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            {mounted ? (
              <Image 
                src="/logo.png"
                alt={t("general.appTitle")} 
                width={400} 
                height={400} 
                className="h-16 w-auto" 
                priority
              />
            ) : (
              // During SSR and before hydration, always use the logo to match server rendering
              <Image 
                src="/logo.png"
                alt={t("general.appTitle")} 
                width={400} 
                height={400} 
                className="h-16 w-auto"
                priority
              />
            )}
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Languages className="h-5 w-5" />
          </Button>
          {mounted && (
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
          
          {isLoggedIn ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  >
                    <UserCircle className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 overflow-hidden border-none shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                  <div className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white">{userName}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <UserCircle className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                      {t("user.userProfile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("auth.logout") || "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {showChatButton && (
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <Link href="/chat" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    {t("landingPage.startChatting")}
                  </Link>
                </Button>
              )}
            </>
          ) : (
            showChatButton && (
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none shadow-md hover:shadow-lg transition-all duration-300">
                <Link href="/signin" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  {t("landingPage.startChatting")}
                </Link>
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  )
}
