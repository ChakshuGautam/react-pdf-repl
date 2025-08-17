import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Read examples at build time for Vercel
const getExampleFiles = () => {
  const examplesDir = path.join(process.cwd(), 'react-pdf-examples');
  
  try {
    // Check if directory exists
    if (!fs.existsSync(examplesDir)) {
      console.error('Examples directory not found:', examplesDir);
      return {};
    }
    
    const files = fs.readdirSync(examplesDir);
    const examples = {};
    
    files.forEach(file => {
      if (file.endsWith('.jsx')) {
        const name = file.replace('.jsx', '');
        const filePath = path.join(examplesDir, file);
        try {
          examples[name] = fs.readFileSync(filePath, 'utf-8');
        } catch (err) {
          console.error(`Failed to read ${file}:`, err);
        }
      }
    });
    
    return examples;
  } catch (error) {
    console.error('Failed to read examples directory:', error);
    // Return fallback examples if directory read fails
    return {
      'quick-start': `const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;`,
      'text': `const MyDocument = () => (
  <Document>
    <Page>
      <Text>Hello World!</Text>
    </Page>
  </Document>
);

export default MyDocument;`,
    };
  }
};

// Load examples once at module level
const exampleFiles = getExampleFiles();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    // If no name provided, return list of available examples
    if (!name) {
      const examples = Object.keys(exampleFiles);
      return NextResponse.json({ examples });
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