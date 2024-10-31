import { useState } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { CodeEditor } from '../editor/CodeEditor';
import { CodePreview } from '../editor/CodePreview';
import { Code, Play } from 'lucide-react';
import { sendMessage } from '../../lib/api';
import { executeCode } from '../../lib/codeExecutor';
import { extractCodeBlocks } from '../../lib/formatMessage';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [code, setCode] = useState('// Start coding here...');
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage([...messages, userMessage]);
      
      // Extract code blocks and update editor
      const codeBlocks = extractCodeBlocks(response);
      if (codeBlocks.length > 0) {
        const latestCode = codeBlocks[codeBlocks.length - 1];
        setCode(latestCode);
        
        // Execute code and show preview
        const result = await executeCode(latestCode);
        setOutput(result.output || 'Code executed successfully');
        setActiveTab('preview'); // Switch to preview after code execution
      }

      // Add AI response to chat
      const messageWithoutCode = response.replace(/```[\s\S]*?```/g, '');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: messageWithoutCode 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* Chat Section */}
      <div className="w-1/2 flex flex-col border-r dark:border-gray-700">
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Code Section */}
      <div className="w-1/2 flex flex-col">
        <div className="border-b dark:border-gray-700 p-2 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('code')}
            className={`p-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'code'
                ? 'bg-teal-500/10 text-teal-500'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Code size={18} />
            <span>Code</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`p-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'preview'
                ? 'bg-teal-500/10 text-teal-500'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Play size={18} />
            <span>Preview</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {activeTab === 'code' ? (
            <CodeEditor code={code} onChange={setCode} />
          ) : (
            <CodePreview code={code} output={output} />
          )}
        </div>
      </div>
    </div>
  );
}