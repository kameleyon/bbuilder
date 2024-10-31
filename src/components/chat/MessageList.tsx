import { Message } from './Message';
import { LoadingIndicator } from './LoadingIndicator';
import type { ChatMessage } from '../../types';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
      {isLoading && <LoadingIndicator />}
    </div>
  );
}