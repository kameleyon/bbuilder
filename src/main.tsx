import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Publishable Key');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider 
        publishableKey={clerkPubKey}
        appearance={{
          elements: {
            formButtonPrimary: 'bg-teal-500 hover:bg-teal-600 text-white',
            footerActionLink: 'text-teal-500 hover:text-teal-600',
            card: 'bg-white dark:bg-gray-800',
            headerTitle: 'text-gray-900 dark:text-gray-100',
            headerSubtitle: 'text-gray-600 dark:text-gray-400'
          }
        }}
      >
        <App />
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);