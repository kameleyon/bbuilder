import { useEffect, useRef, useState } from 'react';

interface CodePreviewProps {
  code: string;
  output: string;
}

export function CodePreview({ code, output }: CodePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!iframeRef.current || !code) return;

    const previewDoc = iframeRef.current.contentDocument;
    if (!previewDoc) return;

    try {
      // Create a sandbox environment for preview
      const previewContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <style>
              body {
                margin: 0;
                padding: 1rem;
                font-family: -apple-system, system-ui, sans-serif;
                background: #1a1b26;
                color: #a9b1d6;
              }
              #root {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: calc(100vh - 2rem);
              }
              .preview-error {
                color: #f7768e;
                background: rgba(247, 118, 142, 0.1);
                padding: 1rem;
                border-radius: 0.5rem;
                margin: 1rem 0;
              }
              .preview-output {
                color: #9ece6a;
                background: rgba(158, 206, 106, 0.1);
                padding: 1rem;
                border-radius: 0.5rem;
                margin: 1rem 0;
                white-space: pre-wrap;
                font-family: monospace;
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <div id="output"></div>
            <script type="text/babel">
              // Capture console output
              const originalConsole = window.console;
              const outputs = [];
              window.console = {
                ...originalConsole,
                log: (...args) => {
                  outputs.push(args.join(' '));
                  document.getElementById('output').innerHTML = 
                    '<div class="preview-output">' + outputs.join('\\n') + '</div>';
                  originalConsole.log(...args);
                },
                error: (...args) => {
                  outputs.push('Error: ' + args.join(' '));
                  document.getElementById('output').innerHTML = 
                    '<div class="preview-error">' + outputs.join('\\n') + '</div>';
                  originalConsole.error(...args);
                }
              };

              try {
                ${code}
                
                if (typeof App !== 'undefined') {
                  ReactDOM.createRoot(document.getElementById('root')).render(
                    React.createElement(React.StrictMode, null,
                      React.createElement(App)
                    )
                  );
                }
              } catch (error) {
                console.error(error.message);
              }
            </script>
          </body>
        </html>
      `;

      previewDoc.open();
      previewDoc.write(previewContent);
      previewDoc.close();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [code]);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex-1 overflow-hidden rounded-lg bg-gray-800">
        <iframe
          ref={iframeRef}
          title="preview"
          className="w-full h-full border-0"
          sandbox="allow-scripts"
        />
      </div>
      {(output || error) && (
        <div className="h-32 mt-4 rounded-lg bg-gray-800 p-4 overflow-auto">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Console Output</h3>
          <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : (
              output || 'No output yet. Run your code to see results.'
            )}
          </pre>
        </div>
      )}
    </div>
  );
}