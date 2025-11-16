"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="markdown-preview">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Customiza renderização de elementos
          h1: ({ node, ...props }) => <h1 className="preview-h1" {...props} />,
          h2: ({ node, ...props }) => <h2 className="preview-h2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="preview-h3" {...props} />,
          h4: ({ node, ...props }) => <h4 className="preview-h4" {...props} />,
          p: ({ node, ...props }) => <p className="preview-p" {...props} />,
          code: ({ node, className, children, ...props }: any) => {
            const inline = !className;
            return inline ? (
              <code className="preview-inline-code" {...props}>{children}</code>
            ) : (
              <code className="preview-code-block" {...props}>{children}</code>
            );
          },
          pre: ({ node, ...props }) => <pre className="preview-pre" {...props} />,
          a: ({ node, ...props }) => <a className="preview-link" {...props} target="_blank" rel="noopener noreferrer" />,
          ul: ({ node, ...props }) => <ul className="preview-ul" {...props} />,
          ol: ({ node, ...props }) => <ol className="preview-ol" {...props} />,
          li: ({ node, ...props }) => <li className="preview-li" {...props} />,
          blockquote: ({ node, ...props }) => <blockquote className="preview-blockquote" {...props} />,
          table: ({ node, ...props }) => <table className="preview-table" {...props} />,
          th: ({ node, ...props }) => <th className="preview-th" {...props} />,
          td: ({ node, ...props }) => <td className="preview-td" {...props} />,
          hr: ({ node, ...props }) => <hr className="preview-hr" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>

      <style jsx global>{`
        .markdown-preview {
          font-family: 'Space Mono', monospace;
          color: var(--color-text-light);
          line-height: 1.6;
          padding: 1.5rem;
        }

        /* Headings */
        .preview-h1 {
          color: var(--color-primary);
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 3px solid var(--color-primary);
          text-transform: uppercase;
        }

        .preview-h2 {
          color: var(--color-primary);
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          border-left: 4px solid var(--color-primary);
          padding-left: 0.75rem;
        }

        .preview-h3 {
          color: var(--color-accent-go);
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .preview-h4 {
          color: var(--color-text-light);
          font-size: 1.1rem;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        /* Paragraphs */
        .preview-p {
          margin-bottom: 1rem;
          color: var(--color-text-light);
        }

        /* Code */
        .preview-inline-code {
          background-color: rgba(255, 255, 0, 0.1);
          color: var(--color-primary);
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: 'Space Mono', monospace;
          font-size: 0.9em;
          border: 1px solid rgba(255, 255, 0, 0.3);
        }

        .preview-pre {
          background-color: #1e1e1e;
          border: 2px solid var(--color-primary);
          border-radius: 4px;
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
          box-shadow: 4px 4px 0px 0px rgba(255, 255, 0, 0.2);
        }

        .preview-code-block {
          font-family: 'Space Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        /* Links */
        .preview-link {
          color: var(--color-accent-download);
          text-decoration: underline;
          font-weight: 600;
          transition: color 0.15s ease;
        }

        .preview-link:hover {
          color: var(--color-primary);
        }

        /* Lists */
        .preview-ul,
        .preview-ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        .preview-li {
          margin-bottom: 0.5rem;
          color: var(--color-text-light);
        }

        .preview-ul > .preview-li {
          list-style-type: '▶ ';
        }

        /* Blockquotes */
        .preview-blockquote {
          border-left: 4px solid var(--color-accent-go);
          background-color: rgba(0, 255, 0, 0.05);
          padding: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: var(--color-text-light);
        }

        /* Tables */
        .preview-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          border: 2px solid var(--color-primary);
        }

        .preview-th {
          background-color: var(--color-primary);
          color: var(--color-secondary);
          padding: 0.75rem;
          text-align: left;
          font-weight: 700;
          border: 1px solid var(--color-secondary);
        }

        .preview-td {
          padding: 0.75rem;
          border: 1px solid rgba(255, 255, 0, 0.3);
          color: var(--color-text-light);
        }

        .preview-table tr:nth-child(even) {
          background-color: rgba(255, 255, 0, 0.05);
        }

        /* Horizontal Rule */
        .preview-hr {
          border: none;
          border-top: 3px solid var(--color-primary);
          margin: 2rem 0;
        }

        /* Scrollbar */
        .markdown-preview {
          scrollbar-width: thin;
          scrollbar-color: var(--color-primary) var(--color-secondary);
        }

        .markdown-preview::-webkit-scrollbar {
          width: 8px;
        }

        .markdown-preview::-webkit-scrollbar-thumb {
          background-color: var(--color-primary);
        }

        .markdown-preview::-webkit-scrollbar-track {
          background-color: var(--color-secondary);
        }
      `}</style>
    </div>
  );
}
