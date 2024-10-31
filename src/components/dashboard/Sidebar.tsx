import React from 'react';
import { MessageSquare, Code, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4">
      <div className="flex-1 flex flex-col items-center gap-4">
        <button className="p-3 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors">
          <MessageSquare className="w-5 h-5" />
        </button>
        <button className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Code className="w-5 h-5" />
        </button>
      </div>
      <button className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <Settings className="w-5 h-5" />
      </button>
    </aside>
  );
}