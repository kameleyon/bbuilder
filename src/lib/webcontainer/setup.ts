import { WebContainer } from '@webcontainer/api';

const files = {
  'index.html': {
    file: {
      contents: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BuddyBuilder Project</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    },
  },
  'package.json': {
    file: {
      contents: `
{
  "name": "buddybuilder-project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}`,
    },
  },
  'src': {
    directory: {
      'main.tsx': {
        file: {
          contents: `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`,
        },
      },
      'App.tsx': {
        file: {
          contents: `
import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to BuddyBuilder</h1>
        <p className="mt-4 text-gray-600">Start building your project!</p>
      </div>
    </div>
  )
}

export default App`,
        },
      },
    },
  },
};

export async function setupDevEnvironment(webcontainerInstance: WebContainer) {
  console.log('Starting development environment setup...');
  
  try {
    // Mount the file system
    console.log('Mounting file system...');
    await webcontainerInstance.mount(files);
    console.log('File system mounted successfully');

    // Install dependencies
    console.log('Installing dependencies...');
    const installProcess = await webcontainerInstance.spawn('npm', ['install']);
    
    const installExitCode = await new Promise<number>((resolve) => {
      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log('[Install]', data);
          },
        })
      );
      
      installProcess.exit.then(resolve);
    });

    if (installExitCode !== 0) {
      throw new Error('Installation failed');
    }
    console.log('Dependencies installed successfully');

    // Start the development server
    console.log('Starting development server...');
    const devProcess = await webcontainerInstance.spawn('npm', ['run', 'dev']);
    
    devProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log('[Dev Server]', data);
        },
      })
    );

    // Wait for server to be ready
    webcontainerInstance.on('server-ready', (port, url) => {
      console.log(`Server is ready at ${url}`);
    });

    console.log('Development environment setup complete');
    return true;
  } catch (error) {
    console.error('Error setting up development environment:', error);
    throw error;
  }
}
