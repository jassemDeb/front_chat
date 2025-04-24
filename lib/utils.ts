import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function nanoid() {
  return Math.random().toString(36).substring(2, 10)
}

export function formatDistanceToNow(date: Date, locale?: string) {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return locale === "ar" ? "الآن" : "just now"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    if (locale === "ar") {
      return `منذ ${diffInMinutes} ${diffInMinutes === 1 ? "دقيقة" : "دقائق"}`
    }
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    if (locale === "ar") {
      return `منذ ${diffInHours} ${diffInHours === 1 ? "ساعة" : "ساعات"}`
    }
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    if (locale === "ar") {
      return `منذ ${diffInDays} ${diffInDays === 1 ? "يوم" : "أيام"}`
    }
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    if (locale === "ar") {
      return `منذ ${diffInMonths} ${diffInMonths === 1 ? "شهر" : "أشهر"}`
    }
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  if (locale === "ar") {
    return `منذ ${diffInYears} ${diffInYears === 1 ? "سنة" : "سنوات"}`
  }
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`
}
