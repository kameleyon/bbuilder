import { Message } from './ChatInterface';
import { Bot, User } from 'lucide-react';
import { formatMessage } from '../../lib/formatMessage';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-start gap-4 ${
            message.role === 'assistant' ? 'justify-start' : 'justify-end'
          }`}
        >
          {message.role === 'assistant' && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
              <Bot size={24} />
            </div>
          )}
          <div
            className={`max-w-[calc(100%-5rem)] rounded-2xl shadow-sm ${
              message.role === 'assistant'
                ? 'bg-white dark:bg-gray-800 p-6'
                : 'bg-gradient-to-br from-teal-400 to-teal-600 p-4 text-white'
            }`}
          >
            <div 
              className={`prose dark:prose-invert max-w-none ${
                message.role === 'user' ? 'text-white' : ''
              }`}
              dangerouslySetInnerHTML={{ 
                __html: formatMessage(message.content) 
              }} 
            />
          </div>
          {message.role === 'user' && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
              <User size={24} />
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
            <Bot size={24} />
          </div>
          <div className="max-w-[calc(100%-5rem)] rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce" />
              <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2.5 h-2.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}