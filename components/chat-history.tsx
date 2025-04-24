"use client"

import type { Chat } from "@/types"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "@/lib/utils"
import { MessageSquare, Plus, Trash2, Download } from "lucide-react"
import { motion } from "framer-motion"
import { useI18n } from "./i18n-provider"
import { useState, useEffect } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getConversation } from "@/api/chat"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface ChatHistoryProps {
  chats: Chat[]
  onSelectChat: (chat: Chat) => void
  noChatsMessage: string
  onCreateConversation: () => Promise<void>
  currentChatId?: string
  onDeleteChat?: (chatId: string) => Promise<void>
}

export default function ChatHistory({ 
  chats, 
  onSelectChat, 
  noChatsMessage, 
  onCreateConversation, 
  currentChatId,
  onDeleteChat 
}: ChatHistoryProps) {
  const { locale, dir, t } = useI18n()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [pdfChatId, setPdfChatId] = useState<string | null>(null)

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
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  }

  const handleDeleteClick = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation()
    setChatToDelete(chat)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!chatToDelete || !onDeleteChat) return
    
    setIsDeleting(true)
    try {
      await onDeleteChat(chatToDelete.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting chat:", error)
    } finally {
      setIsDeleting(false)
      setChatToDelete(null)
    }
  }

  const handleDownloadPDF = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    
    if (isGeneratingPDF) return
    
    try {
      setIsGeneratingPDF(true)
      setPdfChatId(chatId)
      
      // Fetch the full conversation data if it's a valid ID
      if (!isNaN(Number(chatId))) {
        const conversation = await getConversation(parseInt(chatId))
        
        // Create a temporary div to render the conversation
        const tempDiv = document.createElement('div')
        tempDiv.className = 'pdf-container'
        tempDiv.style.padding = '20px'
        tempDiv.style.fontFamily = 'Arial, sans-serif'
        tempDiv.style.width = '700px'
        tempDiv.style.direction = dir
        
        // Add title
        const title = document.createElement('h1')
        title.textContent = conversation.title || t("chat.untitledConversation")
        title.style.color = '#3b82f6'
        title.style.borderBottom = '1px solid #e5e7eb'
        title.style.paddingBottom = '10px'
        title.style.marginBottom = '20px'
        tempDiv.appendChild(title)
        
        // Add date
        const date = document.createElement('p')
        date.textContent = `${t("chat.exportedOn")}: ${new Date().toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}`
        date.style.color = '#6b7280'
        date.style.marginBottom = '20px'
        tempDiv.appendChild(date)
        
        // Add messages
        conversation.messages.forEach(message => {
          const messageDiv = document.createElement('div')
          messageDiv.style.marginBottom = '15px'
          messageDiv.style.padding = '10px'
          messageDiv.style.borderRadius = '8px'
          
          if (message.is_user_message) {
            messageDiv.style.backgroundColor = '#eff6ff'
            messageDiv.style.borderLeft = '4px solid #3b82f6'
            messageDiv.style.textAlign = locale === 'ar' ? 'right' : 'left'
          } else {
            messageDiv.style.backgroundColor = '#f9fafb'
            messageDiv.style.borderLeft = '4px solid #8b5cf6'
            messageDiv.style.textAlign = locale === 'ar' ? 'right' : 'left'
          }
          
          const sender = document.createElement('div')
          sender.textContent = message.is_user_message ? t("chat.you") : t("chat.assistant")
          sender.style.fontWeight = 'bold'
          sender.style.marginBottom = '5px'
          sender.style.color = message.is_user_message ? '#3b82f6' : '#8b5cf6'
          messageDiv.appendChild(sender)
          
          const content = document.createElement('div')
          content.textContent = message.content
          messageDiv.appendChild(content)
          
          tempDiv.appendChild(messageDiv)
        })
        
        // Append to body temporarily (needed for html2canvas)
        tempDiv.style.position = 'absolute'
        tempDiv.style.left = '-9999px'
        document.body.appendChild(tempDiv)
        
        // Generate PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        })
        
        // Use html2canvas to capture the content
        const canvas = await html2canvas(tempDiv, {
          scale: 1,
          useCORS: true,
          logging: false
        })
        
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = 210 // A4 width in mm
        const pageHeight = 295 // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight
        let position = 0
        
        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
        
        // Add additional pages if needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }
        
        // Save the PDF
        pdf.save(`${conversation.title || 'conversation'}.pdf`)
        
        // Clean up
        document.body.removeChild(tempDiv)
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
      setPdfChatId(null)
    }
  }

  return (
    <div className="space-y-3 px-1">
      {chats.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-10 text-center"
        >
          <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{noChatsMessage}</p>
          <Button 
            onClick={onCreateConversation}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            {locale === "ar" ? "إنشاء محادثة" : "Create Conversation"}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {chats.map((chat, index) => {
            const isActive = currentChatId === chat.id;
            
            return (
              <motion.div key={`chat-${chat.id}-${index}`} variants={item}>
                <div className="relative group">
                  <div 
                    className={`flex items-center w-full justify-start text-left h-auto py-3 px-4 rounded-lg transition-all duration-200 border cursor-pointer 
                      ${isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' 
                        : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 border-transparent hover:border-blue-200 dark:hover:border-blue-800'
                      } group`}
                    onClick={() => onSelectChat(chat)}
                  >
                    <div className={`mr-3 h-8 w-8 rounded-full flex items-center justify-center text-white shrink-0 ${
                      isActive 
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                        : 'bg-gradient-to-br from-blue-500 to-purple-500'
                    }`}>
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="truncate flex-1">
                      <div className={`font-medium truncate ${
                        isActive 
                          ? 'text-blue-700 dark:text-blue-400' 
                          : 'group-hover:text-blue-700 dark:group-hover:text-blue-400'
                      } transition-colors`}>
                        {chat.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(chat.createdAt), locale)}
                      </div>
                    </div>
                    
                    {/* Download button */}
                    <div 
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      onClick={(e) => handleDownloadPDF(e, chat.id)}
                    >
                      {isGeneratingPDF && pdfChatId === chat.id ? (
                        <div className="w-6 h-6 flex items-center justify-center">
                          <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      ) : (
                        <Download className="h-4 w-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" />
                      )}
                    </div>
                    
                    {/* Delete button */}
                    <div 
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      onClick={(e) => handleDeleteClick(e, chat)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {locale === "ar" ? "حذف المحادثة" : "Delete Conversation"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {locale === "ar" 
                ? "هل أنت متأكد من أنك تريد حذف هذه المحادثة؟ لا يمكن التراجع عن هذا الإجراء."
                : "Are you sure you want to delete this conversation? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {locale === "ar" ? "إلغاء" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {locale === "ar" ? "جاري الحذف..." : "Deleting..."}
                </span>
              ) : (
                <span>{locale === "ar" ? "حذف" : "Delete"}</span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
