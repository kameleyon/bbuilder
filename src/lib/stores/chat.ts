import { create } from 'zustand';
import { sendChatMessage } from '../api';
import { useWebContainerStore } from './webcontainer';
import { useFileSystemStore } from './files';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  sendMessage: (content: string) => void; // Changed return type to void
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  addMessage: (content: string, role: 'user' | 'assistant') => {
    const message: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: Date.now(),
    };
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  sendMessage: (content: string) => {
    const { addMessage, setLoading, setError } = get();
    const webcontainer = useWebContainerStore.getState();
    const fileSystem = useFileSystemStore.getState();

    setLoading(true);
    setError(null);
    
    // Add user message immediately
    addMessage(content, 'user');

    // Handle the async response separately
    void (async () => {
      try {
        const response = await sendChatMessage(content);

        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to get response');
        }

        // Add AI response
        addMessage(response.data, 'assistant');

        // Process any file system operations or commands from the AI response
        if (webcontainer.instance && response.data.includes('```')) {
          // Handle code blocks and file operations
          const codeBlocks = response.data.match(/```[\s\S]*?```/g);
          if (codeBlocks) {
            for (const block of codeBlocks) {
              const code = block.replace(/```.*\n/, '').replace(/```$/, '');
              // TODO: Process code blocks based on context
              console.log('Processing code block:', code);
            }
          }
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setError(errorMessage);
        addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
      } finally {
        setLoading(false);
      }
    })();
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearMessages: () => set({ messages: [] }),
}));
