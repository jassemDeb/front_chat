import { authFetch } from "@/utils/auth";

const API_URL = '/api';

export interface ChatMessage {
  id: number;
  user: number;
  username: string;
  content: string;
  language: string;
  is_user_message: boolean;
  created_at: string;
}

export interface Conversation {
  id: number;
  user: number;
  title: string;
  language: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}

export interface UserSummary {
  id: number;
  user: number;
  username: string;
  content: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface ChatResponse {
  conversation_id: number;
  model: string;
  user_message: ChatMessage;
  ai_response: ChatMessage;
}

export interface SendMessageParams {
  message: string;
  conversation_id?: number;
  language?: string;
  model?: string;
}

/**
 * Get all chat messages for the current user
 */
export const getChatMessages = async (language?: string): Promise<ChatMessage[]> => {
  const url = language 
    ? `${API_URL}/messages/?language=${language}` 
    : `${API_URL}/messages/`;
    
  const response = await authFetch(url);
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to fetch messages');
  }
  
  return response.json();
};

/**
 * Create a new chat message
 */
export const createChatMessage = async (content: string): Promise<ChatMessage> => {
  const response = await authFetch(`${API_URL}/messages/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to create message');
  }
  
  return response.json();
};

/**
 * Get all conversations for the current user
 */
export const getConversations = async (language?: string): Promise<Conversation[]> => {
  const url = language 
    ? `${API_URL}/conversations/?language=${language}` 
    : `${API_URL}/conversations/`;
    
  const response = await authFetch(url);
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to fetch conversations');
  }
  
  return response.json();
};

/**
 * Get a specific conversation by ID
 */
export const getConversation = async (id: number): Promise<Conversation> => {
  const response = await authFetch(`${API_URL}/conversations/${id}/`);
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to fetch conversation');
  }
  
  return response.json();
};

/**
 * Create a new conversation
 */
export const createConversation = async (title: string, language: string = 'en'): Promise<Conversation> => {
  const response = await authFetch(`${API_URL}/conversations/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, language }),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to create conversation');
  }
  
  return response.json();
};

/**
 * Update a conversation
 */
export const updateConversation = async (id: number, title: string): Promise<Conversation> => {
  const response = await authFetch(`${API_URL}/conversations/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to update conversation');
  }
  
  return response.json();
};

/**
 * Delete a conversation
 */
export const deleteConversation = async (id: number): Promise<void> => {
  const response = await authFetch(`${API_URL}/conversations/${id}/`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to delete conversation');
  }
};

/**
 * Get all user summaries
 */
export const getUserSummaries = async (language?: string): Promise<UserSummary[]> => {
  const url = language 
    ? `${API_URL}/summaries/?language=${language}` 
    : `${API_URL}/summaries/`;
    
  const response = await authFetch(url);
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to fetch summaries');
  }
  
  return response.json();
};

/**
 * Get a specific user summary
 */
export const getUserSummary = async (id: number): Promise<UserSummary> => {
  const response = await authFetch(`${API_URL}/summaries/${id}/`);
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to fetch summary');
  }
  
  return response.json();
};

/**
 * Create a new user summary
 */
export const createUserSummary = async (content: string): Promise<UserSummary> => {
  const response = await authFetch(`${API_URL}/summaries/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to create summary');
  }
  
  return response.json();
};

/**
 * Send a message to the AI chat API
 */
export const sendMessage = async (params: SendMessageParams): Promise<ChatResponse> => {
  const response = await authFetch(`${API_URL}/chat/ai/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to send message');
  }
  
  return response.json();
};

/**
 * Get available AI models
 */
export const getAvailableModels = async (): Promise<{ id: string; name: string; provider: string }[]> => {
  // This could be fetched from the backend in the future
  // For now, return the models we know are available
  return [
    { id: 'lamini-t5', name: 'LaMini-T5', provider: 'MBZUAI' },
    { id: 'deepseek', name: 'DeepSeek Coder', provider: 'DeepSeek' },
    { id: 'blenderbot-400M', name: 'BlenderBot', provider: 'Facebook' }
  ];
};

/**
 * Get user's conversations
 */
export const getUserConversations = async (language?: string): Promise<any[]> => {
  const url = language 
    ? `${API_URL}/conversations/?language=${language}`
    : `${API_URL}/conversations/`;
    
  const response = await authFetch(url);
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to fetch conversations');
  }
  
  return response.json();
};

/**
 * Get messages for a specific conversation
 */
export const getConversationMessages = async (conversationId: number): Promise<any[]> => {
  const response = await authFetch(`${API_URL}/conversations/${conversationId}/`);
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to fetch conversation messages');
  }
  
  return response.json();
};

/**
 * Get a chat summary for the current user
 */
export const getChatSummary = async (conversationId?: number, language: string = 'en'): Promise<{ summary: string }> => {
  const payload: any = {
    language: language
  };
  
  // If a specific conversation ID is provided, include it in the request
  if (conversationId) {
    payload.conversation_id = conversationId;
  }
  
  const response = await authFetch(`${API_URL}/chat/summary/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to generate chat summary');
  }
  
  return response.json();
};
