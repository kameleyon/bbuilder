import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import Workbench from './components/workbench/Workbench';

function App() {
  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col">
        <Workbench />
      </div>
    </ThemeProvider>
  );
}

export default App;
