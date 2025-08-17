# React-PDF Playground Documentation

Welcome to the React-PDF Playground documentation. This playground provides a live environment for creating, testing, and sharing PDF documents using React-PDF.

## 📚 Documentation Structure

- [Getting Started](./getting-started.md) - Quick start guide
- [Architecture](./architecture.md) - Technical architecture and design
- [API Reference](./api-reference.md) - API endpoints documentation
- [Examples Guide](./examples-guide.md) - Working with examples
- [Deployment](./deployment.md) - Deployment instructions
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
- [Contributing](./contributing.md) - How to contribute

## 🚀 Quick Links

- **Live Demo**: [https://react-pdf-repl-pi.vercel.app](https://react-pdf-repl-pi.vercel.app)
- **GitHub Repository**: [ChakshuGautam/react-pdf-repl](https://github.com/ChakshuGautam/react-pdf-repl)
- **React-PDF Official**: [diegomura/react-pdf](https://github.com/diegomura/react-pdf)

## 🎯 Key Features

### Live Editor
- Real-time PDF preview as you type
- Monaco Editor with syntax highlighting
- Split-panel interface with adjustable sizing
- Debugging tools with component tree inspector

### Example Library
- 35+ working React-PDF examples
- Organized by categories (Basic, Styling, Layout, SVG, Advanced)
- One-click loading into editor
- Smart import detection and auto-fixing

### Documentation
- Complete React-PDF documentation integrated
- API access for programmatic usage
- Quick reference guides

## 🛠️ Technology Stack

- **Next.js 13** - React framework with App Router
- **Monaco Editor** - VS Code editor for the web
- **@react-pdf/renderer** - PDF generation library
- **pdfjs-dist** - PDF viewing in browser
- **Jotai** - State management
- **SES** - Secure ECMAScript for sandboxing

## 📖 Using the Playground

### Basic Usage

1. **Write Code**: Use the editor on the left to write React-PDF components
2. **Preview PDF**: See the rendered PDF on the right in real-time
3. **Load Examples**: Select from the dropdown to load pre-built examples
4. **Debug**: Use the debugging panel to inspect component layout

### Example Format

```jsx
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
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
        <Text>Hello World!</Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
```

## 🔧 Development

### Setup
```bash
git clone https://github.com/ChakshuGautam/react-pdf-repl.git
cd react-pdf-repl
npm install
npm run dev
```

### Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linting

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues, questions, or contributions:
- Open an issue on [GitHub](https://github.com/ChakshuGautam/react-pdf-repl/issues)
- Check the [Troubleshooting Guide](./troubleshooting.md)
- Review existing [examples](./examples-guide.md)

---

Built with ❤️ for the React-PDF community