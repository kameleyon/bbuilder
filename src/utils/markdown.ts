import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}

function parseCodeBlocks(content: string): string {
  return content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match: string, lang?: string, code?: string) => {
    const language = lang || 'plaintext';
    const codeContent = code?.trim() || '';
    const highlighted = hljs.highlight(codeContent, { language }).value;
    return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
  });
}

function parseInlineCode(content: string): string {
  return content.replace(/`([^`]+)`/g, (_match: string, code: string) => {
    return `<code>${escapeHtml(code)}</code>`;
  });
}

function parseLinks(content: string): string {
  return content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match: string, text: string, url: string) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });
}

function parseLineBreaks(content: string): string {
  return content.replace(/\n/g, '<br>');
}

export function parseMarkdown(content: string): string {
  let html = escapeHtml(content);
  
  // Parse in specific order
  html = parseCodeBlocks(html);
  html = parseInlineCode(html);
  html = parseLinks(html);
  html = parseLineBreaks(html);

  // Sanitize the final HTML
  return DOMPurify.sanitize(html);
}
