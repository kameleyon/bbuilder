import { UserButton } from '@clerk/clerk-react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { ChatInterface } from './ChatInterface';
import { Sidebar } from './Sidebar';

export function DashboardLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="fixed top-0 z-50 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">AI Dev Assistant</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      </header>

      <div className="flex h-screen pt-16">
        <Sidebar />
        <main className="flex-1">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}