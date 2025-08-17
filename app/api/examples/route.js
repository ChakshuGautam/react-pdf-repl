import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  
  const examplesDir = path.join(process.cwd(), 'react-pdf-examples');
  
  // If no name provided, return list of available examples
  if (!name) {
    try {
      const files = fs.readdirSync(examplesDir);
      const examples = files
        .filter(file => file.endsWith('.txt'))
        .map(file => file.replace('.txt', ''));
      
      return NextResponse.json({ examples });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to list examples' }, { status: 500 });
    }
  }
  
  // Return specific example
  try {
    const filePath = path.join(examplesDir, `${name}.txt`);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    return NextResponse.json({ 
      name,
      code: content 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Example not found' }, { status: 404 });
  }
}