import { Bot } from 'lucide-react';

export function LoadingIndicator() {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white flex-shrink-0">
        <Bot size={24} />
      </div>
      <div className="max-w-[calc(100%-5rem)] rounded-2xl bg-white dark:bg-gray-800 p-6">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce" />
          <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-2.5 h-2.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
}