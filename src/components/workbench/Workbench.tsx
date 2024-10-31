import React, { useEffect } from 'react';
import { useWebContainerStore } from '../../lib/stores/webcontainer';
import { Terminal } from './terminal/Terminal';
import { FileTree } from './FileTree';
import { Editor } from './Editor';
import { Preview } from './Preview';
import { ChatInterface } from '../chat/ChatInterface';
import { LoadingDots } from '../ui/LoadingDots';
import { WebContainer } from '@webcontainer/api';

const Workbench: React.FC = () => {
  const { 
    instance, 
    isReady, 
    isLoading, 
    error,
    initializeWebContainer 
  } = useWebContainerStore();

  useEffect(() => {
    const init = async () => {
      if (!instance && !isLoading && !error) {
        try {
          console.log('Initializing WebContainer...');
          // Try to boot WebContainer - this will fail if not supported
          await WebContainer.boot();
          
          console.log('WebContainer supported, proceeding with initialization...');
          await initializeWebContainer();
          console.log('WebContainer initialized successfully');
        } catch (err) {
          console.error('Failed to initialize workbench:', err);
          const errorMessage = err instanceof Error 
            ? err.message 
            : 'WebContainers are not supported in this environment';
          throw new Error(errorMessage);
        }
      }
    };

    init().catch(err => {
      console.error('Initialization failed:', err);
    });
  }, [instance, isLoading, error, initializeWebContainer]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center text-white max-w-lg p-6">
          <div className="text-red-500 text-xl mb-4">Initialization Error</div>
          <div className="mb-4 text-gray-300">{error}</div>
          <div className="text-sm text-gray-400 mb-4">
            Make sure you're using a supported browser (Chrome or Edge)
            and that you have a stable internet connection.
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isReady || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center text-white">
          <div className="mb-4">
            <LoadingDots />
          </div>
          <div className="text-lg">Initializing development environment...</div>
          <div className="text-sm text-gray-400 mt-2">This may take a few moments</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* File Explorer */}
      <div className="w-64 border-r border-gray-700">
        <FileTree />
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Editor and Terminal Section */}
        <div className="flex flex-col flex-1 border-r border-gray-700">
          {/* Editor */}
          <div className="flex-1">
            <Editor />
          </div>

          {/* Terminal */}
          <div className="h-1/3 border-t border-gray-700">
            <Terminal />
          </div>
        </div>

        {/* Preview and Chat Section */}
        <div className="flex flex-col w-1/2">
          {/* Preview */}
          <div className="flex-1 border-b border-gray-700">
            <Preview />
          </div>

          {/* Chat */}
          <div className="h-1/2">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workbench;
