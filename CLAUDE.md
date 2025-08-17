# Claude AI Assistant Guide for React-PDF Playground

## Project Overview
This is a React-PDF playground/REPL that allows users to write, test, and preview PDF documents using React-PDF components in real-time. It includes a comprehensive example library, documentation, and a live editor with immediate PDF preview.

## Key Features

### 1. Live PDF Editor
- **Monaco Editor**: VS Code-like editing experience
- **Real-time Preview**: PDFs render as you type
- **Split Panel Interface**: Adjustable panels for code and preview
- **Debugging Tools**: Component tree inspector and layout visualization

### 2. Example Library System
- **35+ Working Examples**: Comprehensive React-PDF examples
- **Dropdown Selector**: Easy example selection in editor
- **Smart Import Handling**: Automatically adds required imports
- **Categories**: Basic, Styling, Layout, SVG, Advanced

### 3. Documentation System
- **19 Official Docs**: Complete React-PDF documentation imported
- **API Access**: REST endpoints for docs and examples
- **Reference Guide**: REACT_PDF_REFERENCE.md for quick lookup

## Architecture

### Tech Stack
- **Framework**: Next.js 13 with App Router
- **Editor**: Monaco Editor (@monaco-editor/react)
- **PDF Rendering**: @react-pdf/renderer 3.1.9
- **Styling**: CSS Modules
- **PDF Viewer**: pdfjs-dist 3.3.122 (locked version)
- **State Management**: Jotai
- **Security**: SES (Secure ECMAScript)

### Project Structure
```
pdf-playground/
├── app/
│   ├── api/
│   │   ├── examples/     # API for fetching examples
│   │   └── docs/          # API for fetching documentation
│   ├── repl.js           # Main REPL component
│   └── page.js           # Entry point
├── worker/
│   ├── executer.js       # PDF execution logic
│   └── to-module.js      # Module conversion
├── react-pdf-examples/   # 35 JSX example files
├── react-pdf-docs/       # 19 markdown documentation files
├── docs/                 # Project documentation
└── lib/                  # Utility functions
```

## Important Implementation Details

### Example Import Handling
The system automatically detects and adds missing imports:
1. Scans code for React-PDF components
2. Removes duplicate/conflicting imports (e.g., `Text as SvgText`)
3. Adds `import { ... } from '@react-pdf/renderer'`
4. Ensures default export exists

### File Extensions
- Examples use `.jsx` extension (not `.txt`)
- This ensures better Vercel deployment support
- API routes read `.jsx` files directly

### Version Locking
- `pdfjs-dist` is locked to exact version `3.3.122`
- Required for patch-package compatibility
- Prevents version mismatch on deployment

## API Endpoints

### GET /api/examples
- No params: Returns list of all example names
- `?name=<example>`: Returns specific example code

### GET /api/docs
- No params: Returns list of all documentation files
- `?name=<doc>`: Returns specific documentation content

## Deployment Considerations

### Vercel Deployment
1. **Node Version**: Requires 18.x or higher
2. **Build Command**: `npm run build` (default)
3. **File System**: Examples/docs are read at build time
4. **Patches**: patch-package runs in postinstall

### Known Issues & Solutions
1. **Import Errors**: System auto-adds missing imports
2. **ReactPDF.render()**: Automatically removed (not needed)
3. **Duplicate Text Import**: Handled by import deduplication

## Development Commands
```bash
npm run dev       # Start development server on port 10001
npm run build     # Build for production
npm run lint      # Run linting
```

## Working with Examples

### Available Example Categories
- **Basic**: quick-start, text, images, emoji
- **Styling**: inline-styles, styles, mixed-styles, media-queries
- **Layout**: page-breaks, page-numbers, fixed-components
- **SVG**: circle, path, polygon, gradients
- **Advanced**: resume, fractals, font-register

### Adding New Examples
1. Create `.jsx` file in `react-pdf-examples/`
2. Include React-PDF component code
3. Ensure default export exists
4. Example will auto-appear in dropdown

## Common Tasks

### Updating Examples
1. Edit files in `react-pdf-examples/*.jsx`
2. Test locally with `npm run dev`
3. Commit and push changes

### Debugging PDF Rendering
1. Check browser console for errors
2. Verify imports are correct
3. Use debugging panel for layout inspection
4. Check worker logs if PDF fails to render

### Fixing Import Issues
The system handles most import issues automatically:
- Missing imports are detected and added
- Duplicate imports are removed
- ReactPDF namespace is added when needed

## Best Practices

### When Modifying Code
1. Test all example categories after changes
2. Ensure examples render without errors
3. Verify dropdown loads all examples
4. Check API endpoints work correctly

### For Performance
1. Examples are loaded once at module level
2. PDF rendering happens in web worker
3. Code splitting via Next.js is automatic

### For Maintenance
1. Keep pdfjs-dist version locked
2. Test deployment on Vercel after major changes
3. Update this documentation when adding features
4. Maintain backwards compatibility with examples

## Troubleshooting

### Common Errors

**StyleSheet is not defined**
- Auto-import system will add it
- Manually add: `import { StyleSheet } from '@react-pdf/renderer'`

**Text is not defined**
- Caused by duplicate imports
- System removes `Text as SvgText` conflicts

**API returns 500**
- Check if examples directory exists
- Verify `.jsx` files are present
- Check build logs for errors

### Vercel Deployment Issues
1. Ensure `pdfjs-dist` is locked to `3.3.122`
2. Verify all example files are `.jsx`
3. Check Node.js version is 18.x+
4. Monitor build logs for patch-package success

## Recent Updates (2024)

### Features Added
1. Examples dropdown in editor
2. React-PDF documentation import
3. API endpoints for examples/docs
4. Smart import detection
5. Vercel deployment fixes

### Files Changed
- Renamed examples from `.txt` to `.jsx`
- Updated API routes for better error handling
- Fixed import detection for all React-PDF components
- Added comprehensive documentation

## Resources
- [React-PDF Documentation](./REACT_PDF_REFERENCE.md)
- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Import Summary](./IMPORT_SUMMARY.md)
- [Official React-PDF Repo](https://github.com/diegomura/react-pdf)

---

*This guide is for Claude AI or other assistants working on this codebase. Keep it updated with significant changes.*