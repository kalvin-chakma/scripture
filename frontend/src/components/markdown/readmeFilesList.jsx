import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; 


export async function getStaticProps() {
  const publicDir = path.join(process.cwd(), 'public');
  let markdownFiles = [];

  try {
    markdownFiles = fs.readdirSync(publicDir).filter(file => file.endsWith('.md'));
  } catch (error) {
    console.error('Error reading public directory:', error);
  }

  const categorized = {
    markdown: [],
    general: [],
    todo: []
  };

  markdownFiles.forEach((file) => {
    const filePath = path.join(publicDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    // Default to 'general' if type is missing
    const noteType = data.type || 'general';

    categorized[noteType]?.push({
      id: file.replace('.md', ''),
      title: data.title || file.replace('.md', '')
    });
  });

  return {
    props: {
      notesByType: categorized
    }
  };
}
