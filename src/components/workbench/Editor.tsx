import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';
import { useFileSystemStore } from '../../lib/stores/files';

const getLanguageExtension = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
      return javascript();
    case 'ts':
    case 'tsx':
      return javascript({ typescript: true });
    case 'css':
      return css();
    case 'html':
      return html();
    default:
      return javascript();
  }
};

export const Editor: React.FC = () => {
  const { currentFile, readFile, updateFile } = useFileSystemStore();
  const [content, setContent] = React.useState('');

  React.useEffect(() => {
    const loadFile = async () => {
      if (currentFile) {
        try {
          const fileContent = await readFile(currentFile);
          setContent(fileContent);
        } catch (error) {
          console.error('Error loading file:', error);
          setContent('');
        }
      } else {
        setContent('// Select a file to edit');
      }
    };

    loadFile();
  }, [currentFile, readFile]);

  const handleChange = async (value: string) => {
    setContent(value);
    if (currentFile) {
      try {
        await updateFile(currentFile, value);
      } catch (error) {
        console.error('Error saving file:', error);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-2 border-b border-gray-700 flex items-center justify-between">
        <span className="text-sm text-gray-300">
          {currentFile || 'No file selected'}
        </span>
      </div>
      <div className="flex-1 overflow-auto">
        <CodeMirror
          value={content}
          height="100%"
          theme={oneDark}
          extensions={[
            currentFile ? getLanguageExtension(currentFile) : javascript(),
          ]}
          onChange={handleChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
          className="h-full"
        />
      </div>
    </div>
  );
};
