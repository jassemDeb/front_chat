"use client"
import type { AIModel } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ModelSelectorProps {
  selectedModel: AIModel
  onSelectModel: (model: AIModel) => void
}

export default function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  // This would typically come from your API
  const availableModels: AIModel[] = [
    { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
    { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic" },
    { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
  ]

  const handleModelChange = (modelId: string) => {
    const model = availableModels.find((m) => m.id === modelId)
    if (model) {
      onSelectModel(model)
    }
  }

  return (
    <Select value={selectedModel.id} onValueChange={handleModelChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {availableModels.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name} ({model.provider})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
