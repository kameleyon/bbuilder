import React, { useEffect, useState } from 'react';
import { useWebContainerStore } from '../../lib/stores/webcontainer';
import { LoadingDots } from '../ui/LoadingDots';

export const Preview: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { instance } = useWebContainerStore();

  useEffect(() => {
    if (!instance) return;

    const handleServerReady = (port: number, serverUrl: string) => {
      setUrl(serverUrl);
      setIsLoading(false);
    };

    // Listen for server ready event
    instance.on('server-ready', handleServerReady);

    return () => {
      // Cleanup function - the event listener will be automatically removed
      // when the component unmounts or when the instance changes
    };
  }, [instance]);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-2 border-b border-gray-700 flex items-center justify-between">
        <span>Preview</span>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Open in new tab
          </a>
        )}
      </div>
      <div className="flex-1 bg-white">
        {isLoading ? (
          <div className="h-full flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <LoadingDots />
              <div className="mt-2 text-sm text-gray-400">
                Waiting for server...
              </div>
            </div>
          </div>
        ) : url ? (
          <iframe
            src={url}
            className="w-full h-full border-none"
            title="Preview"
            sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-900">
            <div className="text-center text-gray-400">
              No preview available
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
