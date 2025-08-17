# Getting Started

Welcome to the React-PDF Playground! This guide will help you get up and running quickly.

## 🌐 Using the Online Playground

The easiest way to start is using the hosted version:

1. Visit [https://react-pdf-repl-pi.vercel.app](https://react-pdf-repl-pi.vercel.app)
2. Start writing React-PDF code in the editor
3. See your PDF render in real-time

## 💻 Local Development

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ChakshuGautam/react-pdf-repl.git
cd react-pdf-repl
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:10001](http://localhost:10001) in your browser

## ✏️ Writing Your First PDF

### Basic Example

```jsx
import { Document, Page, Text } from '@react-pdf/renderer';

const MyDocument = () => (
  <Document>
    <Page size="A4">
      <Text>Hello World!</Text>
    </Page>
  </Document>
);

export default MyDocument;
```

### Using Styles

```jsx
import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#f0f0f0'
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20
  }
});

const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>My PDF Document</Text>
    </Page>
  </Document>
);

export default MyDocument;
```

## 📚 Loading Examples

The playground includes 35+ pre-built examples:

1. Click the dropdown menu above the editor
2. Select an example from categories:
   - **Basic**: Simple components and layouts
   - **Styling**: CSS and style examples
   - **Layout**: Page breaks, positioning
   - **SVG**: Vector graphics
   - **Advanced**: Complex documents like resumes

3. The code loads automatically in the editor
4. Modify the example to learn how it works

## 🎨 Available Components

React-PDF provides these main components:

- `Document` - PDF document container
- `Page` - Individual pages
- `View` - Container element (like div)
- `Text` - Text content
- `Image` - Images (PNG, JPG)
- `Link` - Hyperlinks
- `Canvas` - Custom drawings
- `SVG` - Vector graphics

## 🎯 Tips for Success

### Auto-Import Detection
The playground automatically detects and adds missing imports. Just write your components and the system will add:
```jsx
import { Document, Page, View, Text } from '@react-pdf/renderer';
```

### Common Patterns

**Headers and Footers**
```jsx
<Page size="A4">
  <View fixed style={styles.header}>
    <Text>Header on every page</Text>
  </View>
  <View style={styles.content}>
    <Text>Page content here</Text>
  </View>
</Page>
```

**Page Numbers**
```jsx
<Text render={({ pageNumber, totalPages }) => 
  `${pageNumber} / ${totalPages}`
} />
```

**Conditional Rendering**
```jsx
<View>
  {showTitle && <Text>Title</Text>}
  <Text>Content</Text>
</View>
```

## 🔍 Debugging

Use the debugging panel to:
- Inspect component tree
- View layout dimensions
- Check applied styles
- Identify rendering issues

## 🚀 Next Steps

- Explore the [Examples Guide](./examples-guide.md)
- Learn about [Architecture](./architecture.md)
- Check the [API Reference](./api-reference.md)
- Read [Troubleshooting](./troubleshooting.md) for common issues

## 📖 Resources

- [React-PDF Documentation](../react-pdf-docs/)
- [Official React-PDF GitHub](https://github.com/diegomura/react-pdf)
- [React-PDF API Reference](https://react-pdf.org)

---

Happy PDF creating! 🎉