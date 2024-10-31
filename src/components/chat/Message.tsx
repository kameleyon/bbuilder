import { Bot, User } from 'lucide-react';
import { formatMessage } from '../../lib/formatMessage';

interface MessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function Message({ role, content }: MessageProps) {
  return (
    <div className={`flex items-start gap-4 ${
      role === 'assistant' ? 'justify-start' : 'justify-end'
    }`}>
      {role === 'assistant' && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white flex-shrink-0">
          <Bot size={24} />
        </div>
      )}
      <div className={`max-w-[calc(100%-5rem)] rounded-2xl ${
        role === 'assistant'
          ? 'bg-white dark:bg-gray-800 p-6'
          : 'bg-gradient-to-br from-teal-400 to-teal-600 p-4 text-white'
      }`}>
        <div className={`prose dark:prose-invert max-w-none ${
          role === 'user' ? 'text-white' : ''
        }`}
        dangerouslySetInnerHTML={{ 
          __html: formatMessage(content) 
        }} />
      </div>
      {role === 'user' && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
          <User size={24} />
        </div>
      )}
    </div>
  );
}