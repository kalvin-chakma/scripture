"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

// Import the table components
import * as MarkdownComponents from "./markdownComponents";

export default function MarkdownViewer({ content }) {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000); // Reset after 2 seconds
  };

  return (
    <div className="w-full max-w-4xl px-6 prose prose-lg text-gray-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ href, children }) => (
            <a href={href} className="text-blue-600 hover:underline">
              {children}
            </a>
          ),
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "text";
            const codeString = String(children).replace(/\n$/, "");
            const index = node.position?.start.offset;

            if (!inline) {
              return (
                <div className="my-4 relative">
                  <SyntaxHighlighter
                    style={atomOneDark}
                    language={language}
                    className="rounded-md"
                  >
                    {codeString}
                  </SyntaxHighlighter>
                  <button
                    onClick={() => copyToClipboard(codeString, index)}
                    className="absolute top-2 right-2 mb-3 bg-gray-700 text-white text-sm px-3 py-0.5 rounded hover:bg-gray-500 transition duration-200"
                  >
                    {copied === index ? "Copied!" : "Copy"}
                  </button>
                </div>
              );
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table: MarkdownComponents.Table,
          th: MarkdownComponents.TableHeader,
          td: MarkdownComponents.TableCell,
          tr: MarkdownComponents.TableRow,
          ul: MarkdownComponents.UnorderedList,
          ol: MarkdownComponents.OrderedList,
          li: MarkdownComponents.ListItem,
          blockquote: MarkdownComponents.BlockQuote,
          hr: MarkdownComponents.HorizontalRule,
          strong: MarkdownComponents.Strong,
          em: MarkdownComponents.Emphasis,
          del: MarkdownComponents.Strikethrough,
          img: MarkdownComponents.Image,
          h1: MarkdownComponents.H1,
          h2: MarkdownComponents.H2,
          h3: MarkdownComponents.H3,
          h4: MarkdownComponents.H4,
          h5: MarkdownComponents.H5,
          h6: MarkdownComponents.H6,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
