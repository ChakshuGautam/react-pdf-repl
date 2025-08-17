import { NextResponse } from 'next/server';
import { exampleFiles, exampleNames } from '../../../lib/static-examples';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    // If no name provided, return list of available examples
    if (!name) {
      return NextResponse.json({ examples: exampleNames });
    }
    
    // Return specific example
    const content = exampleFiles[name];
    if (content) {
      return NextResponse.json({ 
        name,
        code: content
      });
    } else {
      return NextResponse.json({ error: 'Example not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to process request', 
      details: error.message 
    }, { status: 500 });
  }
}