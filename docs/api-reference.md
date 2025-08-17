# API Reference

The React-PDF Playground provides REST API endpoints for accessing examples and documentation programmatically.

## Base URL

- **Production**: `https://react-pdf-repl-pi.vercel.app/api`
- **Local**: `http://localhost:10001/api`

## Endpoints

### GET /api/examples

Retrieve React-PDF examples.

#### List All Examples

**Request:**
```http
GET /api/examples
```

**Response:**
```json
{
  "examples": [
    "quick-start",
    "text",
    "images",
    "emoji",
    "styles",
    "page-breaks",
    "resume",
    // ... more examples
  ]
}
```

#### Get Specific Example

**Request:**
```http
GET /api/examples?name=quick-start
```

**Response:**
```json
{
  "name": "quick-start",
  "code": "const styles = StyleSheet.create({\\n  page: {\\n    flexDirection: 'row',\\n    backgroundColor: '#E4E4E4'\\n  },\\n  section: {\\n    margin: 10,\\n    padding: 10,\\n    flexGrow: 1\\n  }\\n});\\n\\nconst MyDocument = () => (\\n  <Document>\\n    <Page size=\"A4\" style={styles.page}>\\n      <View style={styles.section}>\\n        <Text>Section #1</Text>\\n      </View>\\n      <View style={styles.section}>\\n        <Text>Section #2</Text>\\n      </View>\\n    </Page>\\n  </Document>\\n);\\n\\nexport default MyDocument;"
}
```

**Error Response (404):**
```json
{
  "error": "Example not found"
}
```

### GET /api/docs

Retrieve React-PDF documentation files.

#### List All Documentation

**Request:**
```http
GET /api/docs
```

**Response:**
```json
{
  "docs": [
    "quick-start",
    "components",
    "styling",
    "fonts",
    "advanced",
    // ... more docs
  ]
}
```

#### Get Specific Documentation

**Request:**
```http
GET /api/docs?name=components
```

**Response:**
```json
{
  "name": "components",
  "content": "# Components\\n\\nReact-PDF provides several components..."
}
```

## Usage Examples

### JavaScript/Node.js

```javascript
// Fetch all examples
async function getExamples() {
  const response = await fetch('https://react-pdf-repl-pi.vercel.app/api/examples');
  const data = await response.json();
  return data.examples;
}

// Get specific example
async function getExample(name) {
  const response = await fetch(`https://react-pdf-repl-pi.vercel.app/api/examples?name=${name}`);
  const data = await response.json();
  return data.code;
}

// Usage
const examples = await getExamples();
const quickStartCode = await getExample('quick-start');
```

### Python

```python
import requests

# Fetch all examples
def get_examples():
    response = requests.get('https://react-pdf-repl-pi.vercel.app/api/examples')
    return response.json()['examples']

# Get specific example
def get_example(name):
    response = requests.get(f'https://react-pdf-repl-pi.vercel.app/api/examples?name={name}')
    return response.json()['code']

# Usage
examples = get_examples()
quick_start_code = get_example('quick-start')
```

### cURL

```bash
# List all examples
curl https://react-pdf-repl-pi.vercel.app/api/examples

# Get specific example
curl "https://react-pdf-repl-pi.vercel.app/api/examples?name=quick-start"

# List all documentation
curl https://react-pdf-repl-pi.vercel.app/api/docs

# Get specific documentation
curl "https://react-pdf-repl-pi.vercel.app/api/docs?name=components"
```

## Available Examples

### Basic Examples
- `quick-start` - Basic PDF structure
- `text` - Text component usage
- `images` - Image handling
- `emoji` - Emoji support

### Styling Examples
- `styles` - StyleSheet usage
- `inline-styles` - Inline styling
- `mixed-styles` - Combining style approaches
- `media-queries` - Responsive PDFs

### Layout Examples
- `page-breaks` - Page break control
- `page-numbers` - Adding page numbers
- `page-wrap` - Page wrapping
- `fixed-components` - Fixed positioning

### SVG Examples
- `svg` - Basic SVG usage
- `circle`, `ellipse`, `line`, `path` - SVG shapes
- `lineargradient`, `radialgradient` - Gradients

### Advanced Examples
- `resume` - Complete resume example
- `fractals` - Fractal generation
- `font-register` - Custom fonts
- `debugging` - Debug techniques

## Response Formats

### Success Response
All successful responses return HTTP 200 with JSON:
```json
{
  "property": "value"
}
```

### Error Response
Errors return appropriate HTTP status codes:
- `404` - Resource not found
- `500` - Server error

Error format:
```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

## Rate Limiting

Currently no rate limiting is implemented. Please use responsibly.

## CORS

CORS is enabled for all origins, allowing browser-based applications to access the API.

## Implementation Notes

### Static Data
Examples are compiled into static JavaScript modules at build time for optimal performance on Vercel's serverless platform.

### File Structure
- Examples are stored as `.jsx` files in `/react-pdf-examples/`
- Documentation is stored as `.md` files in `/react-pdf-docs/`
- Static compilation happens via `/lib/static-examples.js`

## Extending the API

To add new examples:
1. Create a `.jsx` file in `/react-pdf-examples/`
2. Regenerate static examples: `node scripts/generate-static-examples.js`
3. Commit and deploy

## Support

For API issues or feature requests:
- Open an issue on [GitHub](https://github.com/ChakshuGautam/react-pdf-repl/issues)
- Check [Troubleshooting](./troubleshooting.md)

---

API Version: 1.0.0