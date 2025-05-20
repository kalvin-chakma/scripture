import fs from 'fs';
import path from 'path';
import MarkdownViewer from '@/app/components/markdownViewer';
import ReadmeNav from '@/app/components/readmeNav';

export async function generateStaticParams() {
  const publicDir = path.join(process.cwd(), 'public');
  const files = fs.readdirSync(publicDir).filter(file => file.endsWith('.md'));

  return files.map((file) => ({
    filename: file,
  }));
}

export default async function ReadmePage({ params }) {
  // Await the params object, as Next.js requires it to be awaited before usage
  const { filename } = await params; // Ensure params is awaited

  const filePath = path.join(process.cwd(), 'public', filename);

  // Check if the file exists before reading it
  if (!fs.existsSync(filePath)) {
    return <div>File not found!</div>;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  return (
    <main className="flex flex-col items-center min-h-screen">
      <ReadmeNav />
      <h1 className="text-3xl font-bold text-gray-800 mt-6 mb-4">{filename}</h1>
      <MarkdownViewer content={content} />
    </main>
  );
}
