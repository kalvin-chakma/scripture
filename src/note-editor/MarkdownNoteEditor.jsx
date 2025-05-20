import Editor from '../components/markdown/editor';
import MarkdownViewer from '../components/markdown/markdownViewer';
import { useState } from 'react';



export default function MarkdownNoteEditor() {
  const [markdown, setMarkdown] = useState(`# Write your Markdown `);

  return (
    <main className="h-screen">
    <div className='h-full flex'>
      <div className="w-1/2 p-4 border-r ">
        <Editor value={markdown} onChange={setMarkdown} />
      </div>
      <div className="w-1/2 p-4 overflow-auto">
        <MarkdownViewer content={markdown} />
      </div>
    </div>
    </main>
  );
}
