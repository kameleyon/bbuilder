import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
}

export function CodeEditor({ code, onChange, language = 'javascript' }: CodeEditorProps) {
  return (
    <div className="h-full overflow-hidden bg-gray-900">
      <div className="h-full">
        <CodeMirror
          value={code}
          height="100%"
          theme={oneDark}
          extensions={[javascript({ jsx: true, typescript: true })]}
          onChange={onChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
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
            lintKeymap: true
          }}
        />
      </div>
    </div>
  );
}