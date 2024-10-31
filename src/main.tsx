import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Check for WebContainer support based on browser compatibility
const isBrowserSupported = () => {
  // Check if running in a browser environment
  if (typeof window === 'undefined') return false;

  // Check for Chromium-based browser
  const isChromium = !!(window as any).chrome &&
    (navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Edge'));
  
  // Check for secure context (required for WebContainer)
  const isSecureContext = window.isSecureContext;
  
  // Exclude Firefox and Safari
  const isUnsupportedBrowser = 
    navigator.userAgent.includes('Firefox') || 
    (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome'));

  return isChromium && isSecureContext && !isUnsupportedBrowser;
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Check browser support before rendering
if (!isBrowserSupported()) {
  root.render(
    <React.StrictMode>
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-6">Browser Not Supported</h1>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="mb-4">
              BuddyBuilder requires a Chromium-based browser to run WebContainers.
            </p>
            <p className="mb-6">
              Please use one of the following browsers:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center justify-center space-x-2">
                <span className="text-blue-400">✓</span>
                <span>Google Chrome</span>
              </li>
              <li className="flex items-center justify-center space-x-2">
                <span className="text-blue-400">✓</span>
                <span>Microsoft Edge</span>
              </li>
            </ul>
            <p className="text-sm text-gray-400">
              Other browsers like Firefox and Safari are not currently supported.
            </p>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Remove beforeunload event listener since we handle it in the app
window.removeEventListener('beforeunload', (e) => {
  e.preventDefault();
  e.returnValue = '';
});
