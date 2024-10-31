import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {}
    }
    return code;
  }
});

export function formatMessage(content: string): string {
  const renderer = new marked.Renderer();
  
  renderer.link = (href, title, text) => {
    return `<a href="${href}" 
      title="${title || ''}" 
      target="_blank" 
      rel="noopener noreferrer"
      class="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-500 underline"
    >${text}</a>`;
  };

  marked.use({ renderer });
  const html = marked(content);
  
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ['target', 'rel', 'class'],
  });
}

export function extractCodeBlocks(content: string): string[] {
  const codeBlockRegex = /```(?:javascript|typescript|jsx|tsx|js|ts)?\n([\s\S]*?)```/g;
  const codeBlocks: string[] = [];
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    codeBlocks.push(match[1].trim());
  }

  return codeBlocks;
}