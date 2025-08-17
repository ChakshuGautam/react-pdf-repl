import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  
  const docsDir = path.join(process.cwd(), 'react-pdf-docs');
  
  // If no name provided, return list of available docs
  if (!name) {
    try {
      const files = fs.readdirSync(docsDir);
      const docs = files
        .filter(file => file.endsWith('.md'))
        .map(file => file.replace('.md', ''));
      
      return NextResponse.json({ docs });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to list documentation' }, { status: 500 });
    }
  }
  
  // Return specific doc
  try {
    const filePath = path.join(docsDir, `${name}.md`);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    return NextResponse.json({ 
      name,
      content 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Documentation not found' }, { status: 404 });
  }
}