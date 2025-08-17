# Architecture

This document describes the technical architecture of the React-PDF Playground.

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Browser Client                       │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │Monaco Editor │  │ PDF Preview  │  │   Debugger   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────┤
│                    Next.js App Router                    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Web Worker  │  │  API Routes  │  │State (Jotai) │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Frontend Components

#### Monaco Editor (`@monaco-editor/react`)
- Provides VS Code-like editing experience
- Syntax highlighting for JSX
- Auto-completion and IntelliSense
- Configurable for React/JSX syntax

#### PDF Preview (`pdfjs-dist`)
- Renders generated PDFs in browser
- Uses PDF.js for display
- Supports page navigation
- Real-time updates as code changes

#### Debugger Panel
- Component tree visualization
- Layout inspection (dimensions, padding, margins)
- Style property viewer
- Box model display

### 2. Code Execution

#### Web Worker (`worker/`)
- Isolates code execution from main thread
- Prevents blocking UI during PDF generation
- Handles code transformation and execution
- Returns generated PDF blob

#### SES (Secure ECMAScript)
- Provides secure sandbox for code execution
- Prevents access to global objects
- Ensures safe evaluation of user code
- Located in `worker/executer.js`

#### Module System (`worker/to-module.js`)
- Converts user code to executable modules
- Handles import statements
- Provides React-PDF components to user code
- Manages module resolution

### 3. State Management

#### Jotai Atoms
- `layoutAtom` - PDF layout structure
- `selectedAtom` - Selected component in debugger
- `page` - Current page number
- `pagesCount` - Total pages

#### React State
- Editor code content
- Selected example
- Panel sizes and visibility
- Error states

### 4. API Layer

#### `/api/examples`
- Serves example code
- Static imports for Vercel compatibility
- Returns list or specific example

#### `/api/docs`
- Serves documentation content
- Markdown files from react-pdf-docs
- Returns list or specific document

## Data Flow

### PDF Generation Flow

```
User Code → Monaco Editor → Web Worker → SES Sandbox → 
React-PDF → PDF Blob → PDF.js Viewer → Display
```

1. **User writes code** in Monaco Editor
2. **Code sent to Web Worker** for processing
3. **SES evaluates code** in secure sandbox
4. **React-PDF generates** PDF document
5. **Blob URL created** for PDF data
6. **PDF.js renders** the document
7. **User sees preview** in real-time

### Example Loading Flow

```
Dropdown Selection → API Request → Code Injection → 
Import Detection → Editor Update → PDF Generation
```

1. **User selects example** from dropdown
2. **Fetch from API** (`/api/examples?name=...`)
3. **Process imports** and clean code
4. **Detect missing imports** automatically
5. **Update editor** with processed code
6. **Trigger PDF generation** flow

## File Structure

```
react-pdf-playground/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── examples/      # Example serving
│   │   └── docs/          # Documentation serving
│   ├── repl.js           # Main REPL component
│   └── page.js           # Entry point
│
├── worker/                # Web Worker code
│   ├── executer.js       # Code execution
│   ├── to-module.js      # Module conversion
│   └── process-jsx.js    # JSX processing
│
├── components/            # React components
│   ├── viewer.js         # PDF viewer
│   ├── elements-tree.js  # Component tree
│   └── repl-layout.js   # Layout components
│
├── lib/                   # Utilities
│   ├── static-examples.js # Compiled examples
│   └── examples-data.js  # Example metadata
│
├── react-pdf-examples/    # Example files (.jsx)
├── react-pdf-docs/        # Documentation (.md)
└── docs/                  # Project documentation
```

## Security Model

### Code Isolation
- User code runs in Web Worker
- SES provides secure sandbox
- No access to DOM or window
- Limited to React-PDF APIs

### Import Control
- Only @react-pdf/renderer imports allowed
- No filesystem access
- No network requests from user code
- Static module resolution

## Performance Optimizations

### Build-Time
- Examples compiled to static modules
- Documentation pre-processed
- Code splitting via Next.js

### Runtime
- Web Worker prevents UI blocking
- Debounced code execution
- Memoized PDF generation
- Virtual scrolling in debugger

## Deployment Architecture

### Vercel Platform
```
GitHub → Vercel Build → Serverless Functions → CDN
```

- **Serverless Functions**: API routes
- **Edge Network**: Static assets
- **Build Cache**: Dependency caching
- **Auto-scaling**: Handles traffic spikes

### Static Generation
- Examples compiled at build time
- No runtime file system access
- Optimized for serverless

## Extension Points

### Adding Components
1. Import in `worker/to-module.js`
2. Add to component detection in `repl.js`
3. Update import handler

### Adding Examples
1. Create `.jsx` file in `react-pdf-examples/`
2. Regenerate `lib/static-examples.js`
3. Deploy changes

### Custom Styling
1. Modify CSS modules in `components/`
2. Update theme variables
3. Adjust layout panels

## Technology Decisions

### Why Next.js 13?
- App Router for modern React
- API routes for serverless
- Optimized for Vercel
- Built-in optimizations

### Why Monaco Editor?
- Industry-standard editor
- JSX syntax support
- Extensible and configurable
- Familiar to developers

### Why Web Workers?
- Non-blocking execution
- Security isolation
- Better performance
- Crash protection

### Why Jotai?
- Atomic state management
- React Suspense support
- Simple API
- Good performance

## Limitations

### Current Limitations
- No custom font upload UI
- Limited to React-PDF components
- No collaborative editing
- Single file editing only

### Technical Constraints
- Serverless function timeouts (10s)
- Browser memory limits
- Web Worker communication overhead
- PDF.js rendering performance

## Future Considerations

### Potential Enhancements
- Multi-file support
- Custom component libraries
- Real-time collaboration
- Template marketplace
- Version history

### Scalability
- Database for user documents
- CDN for generated PDFs
- WebSocket for real-time features
- Horizontal scaling ready

---

Last Updated: 2024