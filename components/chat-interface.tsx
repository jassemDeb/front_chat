"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useI18n } from "./i18n-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Settings, Send, Plus, Save, Trash2, MessageSquare, User, Moon, Sun, Languages, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import ChatMessage from "./chat-message"
import ModelSelector from "./model-selector"
import ChatHistory from "./chat-history"
import type { Message, Chat } from "@/types"
import { nanoid } from "@/lib/utils"
import { sendMessage, getAvailableModels, getUserConversations, getConversation, createConversation, deleteConversation, getChatSummary } from "@/api/chat"
import { AIModel } from "./model-selector"
import { toast } from "sonner"
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ChatInterface() {
  const { t, changeLocale, locale, dir } = useI18n()
  const { theme, setTheme } = useTheme()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentChat, setCurrentChat] = useState<Chat>({
    id: nanoid(),
    name: "",
    messages: [],
    createdAt: new Date().toISOString(),
  })
  const [savedChats, setSavedChats] = useState<Chat[]>([])
  const [selectedModel, setSelectedModel] = useState<AIModel>({
    id: "lamini-t5",
    name: "LaMini-T5",
    provider: "MBZUAI",
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false)
  const [summaryContent, setSummaryContent] = useState("")
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: nanoid(),
      content: input,
      role: "user",
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setCurrentChat((prev) => ({
      ...prev,
      messages: updatedMessages,
      // If this is the first message, use it as the chat name
      name: prev.name || input.substring(0, 30) + (input.length > 30 ? '...' : '')
    }))
    setInput("")
    setIsLoading(true)

    try {
      // Only use the conversation_id if it's a valid backend ID (not a temporary nanoid)
      // We can check if it's a valid ID by checking if it's a number
      const isValidBackendId = currentChat.id && !isNaN(Number(currentChat.id));
      const conversationId = isValidBackendId ? parseInt(currentChat.id) : undefined;
      
      console.log("Sending message with conversation_id:", conversationId);
      
      const response = await sendMessage({
        message: input,
        model: selectedModel.id,
        language: locale,
        conversation_id: conversationId
      });

      console.log("Response from API:", response);

      // If this is a new conversation (we got a new ID from backend)
      if (response.conversation_id) {
        const newConversationId = response.conversation_id.toString();
        console.log("New conversation ID:", newConversationId);
        
        // Only update if we didn't have a valid ID before or if the ID changed
        if (!isValidBackendId || newConversationId !== currentChat.id) {
          // Update current chat with the real conversation ID from backend
          setCurrentChat(prev => ({
            ...prev,
            id: newConversationId
          }));
          
          // Check if this conversation already exists in our saved chats
          const existingChatIndex = savedChats.findIndex(chat => 
            chat.id === newConversationId
          );
          
          if (existingChatIndex === -1) {
            // This is a new conversation, add it to saved chats
            const newChat = {
              id: newConversationId,
              name: currentChat.name || input.substring(0, 30) + (input.length > 30 ? '...' : ''),
              messages: updatedMessages,
              createdAt: new Date().toISOString()
            };
            
            setSavedChats(prev => [newChat, ...prev]);
            console.log("Added new chat to saved chats:", newChat);
          }
        }
      }

      const aiResponse: Message = {
        id: nanoid(),
        content: response.ai_response.content,
        role: "assistant",
        timestamp: new Date().toISOString(),
        model: selectedModel.id,
      }

      const newMessages = [...updatedMessages, aiResponse]
      setMessages(newMessages)
      setCurrentChat((prev) => ({
        ...prev,
        messages: newMessages,
      }))
    } catch (error) {
      console.error("Error sending message:", error)
      // Add error message
      const errorMessage: Message = {
        id: nanoid(),
        content: t("errors.errorMessage"),
        role: "system",
        timestamp: new Date().toISOString(),
      }

      setMessages([...updatedMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    // Create a completely new empty chat with a new ID
    setMessages([]);
    setCurrentChat({
      id: nanoid(), // Generate a new temporary ID
      name: "",
      messages: [],
      createdAt: new Date().toISOString(),
    });
    // Clear the input field
    setInput("");
    
    console.log("Created new chat with temporary ID");
  }

  const handleClearChat = async () => {
    // If this is a conversation from the backend (has a numeric ID)
    if (currentChat.id && !isNaN(Number(currentChat.id))) {
      // Show confirmation dialog
      setIsDeleteDialogOpen(true);
    } else {
      // Just clear the messages for a local chat
      setMessages([]);
      // Don't change the ID, just clear the messages
      setCurrentChat(prev => ({
        ...prev,
        messages: [],
      }));
    }
  };

  const handleSaveChat = async () => {
    if (messages.length === 0) {
      toast.error(
        locale === "ar" ? "لا يمكن تصدير محادثة فارغة" : "Cannot export an empty conversation",
        {
          style: {
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          },
        }
      );
      return;
    }
    
    try {
      // Show loading toast
      toast.loading(
        locale === "ar" ? "جاري تحضير ملف PDF..." : "Preparing PDF file...",
        { id: "pdf-export" }
      );
      
      // Create a container for PDF content
      const container = document.createElement('div');
      container.style.width = '700px';
      container.style.padding = '20px';
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.backgroundColor = 'white';
      container.style.direction = dir;
      container.style.color = '#000000'; // Set default text color for container
      document.body.appendChild(container);
      
      // Add title
      const titleElement = document.createElement('h1');
      titleElement.innerText = currentChat.name || (locale === "ar" ? "محادثة بدون عنوان" : "Untitled Conversation");
      titleElement.style.color = '#3b82f6';
      titleElement.style.borderBottom = '1px solid #e5e7eb';
      titleElement.style.paddingBottom = '10px';
      titleElement.style.marginBottom = '20px';
      container.appendChild(titleElement);
      
      // Add export date
      const dateElement = document.createElement('p');
      dateElement.innerText = `${locale === "ar" ? "تم التصدير في" : "Exported on"}: ${new Date().toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}`;
      dateElement.style.color = '#6b7280';
      dateElement.style.marginBottom = '20px';
      container.appendChild(dateElement);
      
      // Add messages
      for (const message of messages) {
        console.log("Processing message for PDF:", message);
        
        // Create message container
        const messageElement = document.createElement('div');
        messageElement.style.marginBottom = '15px';
        messageElement.style.padding = '10px';
        messageElement.style.borderRadius = '8px';
        messageElement.style.position = 'relative';
        messageElement.style.color = '#000000'; // Set default text color for message
        
        // Style based on role
        if (message.role === "user") {
          messageElement.style.backgroundColor = '#eff6ff';
          messageElement.style.borderLeft = '4px solid #3b82f6';
        } else {
          messageElement.style.backgroundColor = '#f9fafb';
          messageElement.style.borderLeft = '4px solid #8b5cf6';
        }
        
        // Add sender label
        const senderElement = document.createElement('div');
        senderElement.innerText = message.role === "user" 
          ? (locale === "ar" ? "أنت" : "You") 
          : (locale === "ar" ? "المساعد" : "Assistant");
        senderElement.style.fontWeight = 'bold';
        senderElement.style.marginBottom = '5px';
        senderElement.style.color = message.role === "user" ? '#3b82f6' : '#8b5cf6';
        messageElement.appendChild(senderElement);
        
        // Add message content
        const contentElement = document.createElement('div');
        contentElement.innerText = message.content || '';
        contentElement.style.whiteSpace = 'pre-wrap';
        contentElement.style.wordBreak = 'break-word';
        contentElement.style.lineHeight = '1.5';
        contentElement.style.color = '#000000'; // Explicitly set text color to black
        messageElement.appendChild(contentElement);
        
        // Add model info if available
        if (message.model) {
          const modelElement = document.createElement('div');
          modelElement.innerText = `${locale === "ar" ? "النموذج" : "Model"}: ${message.model}`;
          modelElement.style.fontSize = '0.8em';
          modelElement.style.marginTop = '5px';
          modelElement.style.color = '#6b7280';
          messageElement.appendChild(modelElement);
        }
        
        container.appendChild(messageElement);
      }
      
      // Generate PDF
      try {
        // Use html2canvas to capture the rendered HTML
        const canvas = await html2canvas(container, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        
        // Create PDF with proper dimensions
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;
        
        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        // Save the PDF
        const fileName = `${currentChat.name || 'conversation'}.pdf`;
        pdf.save(fileName);
        
        // Show success message
        toast.dismiss("pdf-export");
        toast.success(
          locale === "ar" ? `تم تنزيل المحادثة كملف PDF: ${fileName}` : `Conversation downloaded as PDF: ${fileName}`,
          {
            style: {
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              color: 'white',
              border: 'none',
            },
            icon: '📄',
            duration: 5000,
          }
        );
      } finally {
        // Clean up
        if (container && container.parentNode) {
          document.body.removeChild(container);
        }
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.dismiss("pdf-export");
      toast.error(
        locale === "ar" ? "فشل في تصدير المحادثة" : "Failed to export conversation",
        {
          style: {
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          },
        }
      );
    }
  };

  const handleLoadChat = async (chat: Chat) => {
    try {
      // Make sure we're not already viewing this chat
      if (currentChat.id === chat.id) return;
      
      // Convert string ID back to number for API call
      const conversationId = parseInt(chat.id);
      const conversation = await getConversation(conversationId);
      
      console.log("Loaded conversation:", conversation);
      
      // Convert backend messages to the Message format expected by the component
      const formattedMessages: Message[] = conversation.messages.map((msg: any) => ({
        id: msg.id.toString(),
        content: msg.content,
        role: msg.is_user_message ? "user" : "assistant",
        timestamp: msg.created_at,
        model: selectedModel.id
      }));
      
      console.log("Formatted messages:", formattedMessages);
      
      // Set the current chat with the loaded messages
      setCurrentChat({
        id: conversationId.toString(), // Ensure we're using the correct ID format
        name: chat.name,
        messages: formattedMessages,
        createdAt: chat.createdAt
      });
      
      // Clear current messages and set the loaded messages
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const handleCreateConversation = async () => {
    try {
      // Create a title based on the current time
      const title = `Chat ${new Date().toLocaleString()}`;
      const conversation = await createConversation(title, locale);
      
      // Convert to the Chat format expected by the component
      const newChat: Chat = {
        id: conversation.id.toString(),
        name: conversation.title,
        messages: [],
        createdAt: conversation.created_at
      };
      
      setCurrentChat(newChat);
      setMessages([]);
      setSavedChats(prev => [newChat, ...prev]);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      // Call the API to delete the conversation
      await deleteConversation(parseInt(chatId));
      
      // Remove the chat from the saved chats list
      setSavedChats(prev => prev.filter(chat => chat.id !== chatId));
      
      // If the deleted chat was the current chat, create a new empty chat
      if (currentChat.id === chatId) {
        handleNewChat();
      }
      
      // Show success message
      toast.success(locale === "ar" ? "تم حذف المحادثة بنجاح" : "Conversation deleted successfully");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error(locale === "ar" ? "فشل في حذف المحادثة" : "Failed to delete conversation");
    }
  };

  const handleGetUserSummary = async () => {
    setIsLoadingSummary(true);
    setSummaryContent("");
    
    try {
      // If we have a valid conversation ID, pass it to get a specific summary
      const conversationId = !isNaN(Number(currentChat.id)) ? Number(currentChat.id) : undefined;
      // Pass the current language to get the summary in the correct language
      const result = await getChatSummary(conversationId, locale);
      
      if (result && result.summary) {
        setSummaryContent(result.summary);
      } else {
        setSummaryContent(t("chat.noSummaryAvailable"));
      }
      
      // Open the summary dialog
      setIsSummaryDialogOpen(true);
    } catch (error) {
      console.error("Error getting chat summary:", error);
      toast.error(
        locale === "ar" ? "فشل في الحصول على ملخص المحادثة" : "Failed to get chat summary",
        {
          style: {
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          },
        }
      );
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const toggleLanguage = () => {
    changeLocale(locale === "en" ? "ar" : "en")
  }

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversations = await getUserConversations();
        
        // Make sure we have unique conversations by ID
        const uniqueConversations = Array.from(
          new Map(conversations.map((conv: any) => [conv.id, conv])).values()
        );
        
        // Convert backend conversations to the Chat format expected by the component
        const formattedChats: Chat[] = uniqueConversations.map((conv: any) => {
          // Find the first message to use as title if available
          const firstMessage = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;
          const title = conv.title || 
            (firstMessage ? 
              firstMessage.content.substring(0, 30) + (firstMessage.content.length > 30 ? '...' : '') : 
              `Chat ${new Date(conv.created_at).toLocaleString()}`);
              
          return {
            id: conv.id.toString(), // Make sure ID is a string
            name: title,
            messages: [], // We'll load messages only when the chat is selected
            createdAt: conv.created_at
          };
        });
        
        setSavedChats(formattedChats);
        
        // If we have conversations and no current chat is loaded, load the most recent one
        if (formattedChats.length > 0 && (!currentChat.id || currentChat.id === nanoid())) {
          // Sort by creation date (newest first) and load the most recent
          const sortedChats = [...formattedChats].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          handleLoadChat(sortedChats[0]);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Call the API to delete the conversation
      await deleteConversation(parseInt(currentChat.id));
      
      // Remove the chat from the saved chats list
      setSavedChats(prev => prev.filter(chat => chat.id !== currentChat.id));
      
      // Create a new empty chat
      handleNewChat();
      
      // Show success message
      toast.success(locale === "ar" ? "تم حذف المحادثة بنجاح" : "Conversation deleted successfully");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error(locale === "ar" ? "فشل في حذف المحادثة" : "Failed to delete conversation");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 bg-white dark:bg-gray-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 dark:bg-blue-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-r bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm flex flex-col p-4">
        <Button 
          onClick={handleNewChat} 
          className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("chatInterface.newChat")}
        </Button>

        <Tabs defaultValue="chats" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 mb-4 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <TabsTrigger 
              value="chats" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-md transition-all duration-300"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {t("chatInterface.chatHistory")}
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-300"
            >
              <Settings className="mr-2 h-4 w-4" />
              {t("settings.settings")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[calc(100vh-220px)]">
              <ChatHistory 
                chats={savedChats} 
                onSelectChat={handleLoadChat} 
                noChatsMessage={t("errors.noChats")} 
                onCreateConversation={handleCreateConversation}
                onDeleteChat={handleDeleteChat}
                currentChatId={currentChat.id}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="flex-1">
            <div className="space-y-6 p-2">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">{t("settings.theme")}</h3>
                <div className="flex space-x-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className={theme === "light" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    {t("settings.light")}
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className={theme === "dark" ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    {t("settings.dark")}
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">{t("settings.language")}</h3>
                <div className="flex space-x-2">
                  <Button
                    variant={locale === "en" ? "default" : "outline"}
                    size="sm"
                    onClick={() => changeLocale("en")}
                    className={locale === "en" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                  >
                    <Languages className="mr-2 h-4 w-4" />
                    English
                  </Button>
                  <Button
                    variant={locale === "ar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => changeLocale("ar")}
                    className={locale === "ar" ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
                  >
                    <Languages className="mr-2 h-4 w-4" />
                    العربية
                  </Button>
                </div>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-800" />

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">{t("models.selectModel")}</h3>
                <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-800" />

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">{t("user.userProfile")}</h3>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  onClick={handleGetUserSummary}
                  disabled={isLoadingSummary}
                >
                  {isLoadingSummary ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t("chat.generatingSummary")}
                    </div>
                  ) : (
                    <>
                      <User className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                      {t("user.userSummary")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <Input
              value={currentChat.name}
              onChange={(e) => setCurrentChat((prev) => ({ ...prev, name: e.target.value }))}
              placeholder={t("placeholders.chatNamePlaceholder")}
              className="max-w-xs border-gray-200 dark:border-gray-800 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleSaveChat} 
              disabled={messages.length === 0}
              className="border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleClearChat} 
              disabled={messages.length === 0}
              className="border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-[calc(100vh-300px)] text-center"
              >
                <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <MessageSquare className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  {locale === "ar" ? "ابدأ محادثة جديدة" : "Start a New Conversation"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  {locale === "ar" 
                    ? "اكتب رسالة في المربع أدناه للبدء. يمكنك طرح أي سؤال أو طلب مساعدة في أي موضوع."
                    : "Type a message in the box below to get started. You can ask any question or request assistance on any topic."
                  }
                </p>
              </motion.div>
            )}
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ChatMessage message={message} />
              </motion.div>
            ))}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg"
              >
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
                <div>{t("general.typing")}</div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholders.messagePlaceholder")}
              className="flex-1 min-h-[60px] max-h-[200px] border-gray-200 dark:border-gray-800 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300 self-end h-[60px] px-4"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
              {locale === "ar" ? "حذف المحادثة" : "Delete Conversation"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
              {locale === "ar" 
                ? "هل أنت متأكد من أنك تريد حذف هذه المحادثة؟ لا يمكن التراجع عن هذا الإجراء."
                : "Are you sure you want to delete this conversation? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isDeleting}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {locale === "ar" ? "إلغاء" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-none"
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
      
      {/* User Summary Dialog */}
      <AlertDialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-gray-100 flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
              {locale === "ar" ? "ملخص المحادثة" : "Chat Summary"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          
          <ScrollArea className="h-[300px] rounded-md border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-950">
            {isLoadingSummary ? (
              <div className="flex items-center justify-center h-full">
                <svg className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap" dir={dir}>
                {summaryContent}
              </div>
            )}
          </ScrollArea>
          
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none"
            >
              {locale === "ar" ? "إغلاق" : "Close"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
