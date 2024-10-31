import { useState } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { CodeEditor } from '../editor/CodeEditor';
import type { ChatMessage } from '../../types';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [code, setCode] = useState('// Start coding here...');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const newMessage: ChatMessage = { role: 'user', content };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // Simulate AI response for now
      const aiResponse: ChatMessage = {
        role: 'assistant',
        content: 'I understand your request. How can I help you with that?'
      };
      setTimeout(() => {
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-[1fr,1fr] h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
      <div className="border-l dark:border-gray-700 overflow-hidden">
        <CodeEditor code={code} onChange={setCode} />
      </div>
    </div>
  );
}