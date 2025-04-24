"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAvailableModels } from "@/api/chat"
import { Sparkles, Bot, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export interface AIModel {
  id: string
  name: string
  provider: string
}

interface ModelSelectorProps {
  selectedModel: AIModel
  onSelectModel: (model: AIModel) => void
}

export default function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  const [availableModels, setAvailableModels] = useState<AIModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadModels = async () => {
      try {
        const models = await getAvailableModels()
        setAvailableModels(models)
        
        // If the currently selected model is not in the available models,
        // select the first available model
        if (!models.find(m => m.id === selectedModel.id) && models.length > 0) {
          onSelectModel(models[0])
        }
      } catch (error) {
        console.error("Error loading models:", error)
        // Fallback to hardcoded models if API fails
        setAvailableModels([
          { id: 'blenderbot-400M', name: 'BlenderBot', provider: 'Facebook' },
          { id: 'lamini-t5', name: 'LaMini-T5', provider: 'MBZUAI' },
          { id: 'deepseek', name: 'DeepSeek Coder', provider: 'DeepSeek' }
        ])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadModels()
  }, [selectedModel.id, onSelectModel])

  const handleModelChange = (modelId: string) => {
    const model = availableModels.find((m) => m.id === modelId)
    if (model) {
      onSelectModel(model)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-12 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center justify-center">
        <Loader2 className="h-5 w-5 text-blue-500 dark:text-blue-400 animate-spin" />
      </div>
    )
  }

  // Get model color based on provider
  const getModelColor = (provider: string) => {
    switch(provider.toLowerCase()) {
      case 'facebook':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'mbzuai':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      case 'deepseek':
        return 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20';
      case 'microsoft':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'openai':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Select value={selectedModel.id} onValueChange={handleModelChange}>
        <SelectTrigger className="w-full border-blue-200 dark:border-blue-800 focus:ring-blue-500 dark:focus:ring-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
            <SelectValue placeholder="Select a model" />
          </div>
        </SelectTrigger>
        <SelectContent className="border-blue-200 dark:border-blue-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          {availableModels.map((model) => (
            <SelectItem 
              key={model.id} 
              value={model.id}
              className="focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-700 dark:focus:text-blue-300"
            >
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 ${getModelColor(model.provider)}`}>
                  <Bot className="h-3 w-3" />
                </div>
                <span className="font-medium">{model.name}</span>
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({model.provider})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  )
}
