// src/hooks/use-user-store.ts

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export interface ChatMessage {
  message: string;
  fromUser: boolean;
  loading?: boolean;
  timestamp?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  history: ChatMessage[];
}

interface UserStoreState {
  chatSessions: ChatSession[];
  activeChat: ChatSession | null;
  isStreaming: boolean;
  addChatSession: () => ChatSession;
  deleteChatSession: (id: string) => void;
  clearChatSessions: () => void;
  updateChatHistory: (id: string, message: ChatMessage) => void;
  setActiveChatSession: (id: string) => void;
  setStreaming: (isStreaming: boolean) => void;
}

const LOCAL_STORAGE_KEY = "geminiNanoChatSessions";

const useUserStore = create<UserStoreState>((set, get) => ({
  // States
  chatSessions: [],
  activeChat: null,
  isStreaming: true,

  // Actions
  setStreaming: (isStreaming: boolean) => {
    set({ isStreaming });
    const state = get();
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ ...state, isStreaming }),
    );
  },
  addChatSession: () => {
    const id = uuidv4();
    const newChat: ChatSession = {
      id,
      title: `Chat ${get().chatSessions.length + 1}`,
      history: [],
    };
    set((state) => {
      const updatedSessions = [...state.chatSessions, newChat];
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ ...state, chatSessions: updatedSessions }),
      );
      return {
        chatSessions: updatedSessions,
        activeChat: newChat,
      };
    });
    return newChat;
  },
  deleteChatSession: (id: string) => {
    set((state) => {
      const updatedSessions = state.chatSessions.filter(
        (session) => session.id !== id,
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ ...state, chatSessions: updatedSessions }),
      );
      const newActiveChat =
        state.activeChat?.id === id ? null : state.activeChat;
      return {
        chatSessions: updatedSessions,
        activeChat: newActiveChat,
      };
    });
  },
  clearChatSessions: () => {
    const currentIsStreaming = get().isStreaming;
    set({
      chatSessions: [],
      activeChat: null,
      isStreaming: currentIsStreaming,
    });
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        chatSessions: [],
        activeChat: null,
        isStreaming: currentIsStreaming,
      }),
    );
  },
  updateChatHistory: (id: string, message: ChatMessage) => {
    set((state) => {
      const updatedSessions = state.chatSessions.map((session) =>
        session.id === id
          ? { ...session, history: [...session.history, message] }
          : session,
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ ...state, chatSessions: updatedSessions }),
      );
      return {
        chatSessions: updatedSessions,
        activeChat:
          state.activeChat?.id === id
            ? {
                ...state.activeChat,
                history: [...state.activeChat.history, message],
              }
            : state.activeChat,
      };
    });
  },
  setActiveChatSession: (id: string) => {
    set((state) => ({
      activeChat:
        state.chatSessions.find((session) => session.id === id) || null,
    }));
  },
}));

// Initialize chat sessions from localStorage if available
if (typeof window !== "undefined") {
  const storedSessions = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedSessions) {
    const parsedState: UserStoreState = JSON.parse(storedSessions);
    useUserStore.setState(parsedState);
  }
}

// Sync Zustand store with localStorage
useUserStore.subscribe((state) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
});

export default useUserStore;
