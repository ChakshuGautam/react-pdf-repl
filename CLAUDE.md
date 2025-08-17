# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React PDF REPL (Read-Eval-Print Loop) project that provides an interactive environment for creating and debugging PDF documents using @react-pdf/renderer. It features a Monaco code editor on the left side and a live PDF preview on the right side, with an optional debugger panel at the bottom.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server on port 10001
npm run dev

# Build for production
npm run build

# Start production server on port 10001
npm start

# Run linting
npm lint
```

## Critical Dependencies and Versions

**Node.js Requirements:**
- Use Node.js 18.x (NOT 22.x) - newer versions have compatibility issues with the canvas module
- Switch Node version: `nvm use 18`

**Key Dependencies:**
- `@react-pdf/renderer`: 3.1.9 (exact version required)
- `ses`: 0.18.8 (DO NOT upgrade to 1.x - causes Compartment API issues)
- `@endo/static-module-record`: 0.7.20 (must match ses version)
- `fontkit`: 2.0.2 (resolves SWC helper issues)
- `@swc/helpers`: Required for fontkit compatibility
- `next`: 13.3.0 (uses experimental appDir feature)

## Architecture Overview

### Core Components

**Worker System (`/worker`):**
- `index.js`: Worker wrapper that manages worker lifecycle and communication
- `executer.js`: Main worker that evaluates user code in a secure Compartment using SES (Secure ECMAScript)
- `to-module.js`: Handles module creation and virtual module system for React PDF components
- `process-jsx.js`: Transforms JSX code for execution
- `better-static-module-record.mjs`: Custom static module record implementation

**Main Application (`/app`):**
- `repl.js`: Main REPL component with editor, preview, and debugger panels
- Uses `react-resizable-panels` for split-panel layout
- Implements worker communication for secure code execution
- Handles URL-based code sharing via compressed query parameters

**State Management (`/state`):**
- Uses Jotai for state management
- `page.js`: Manages PDF page navigation state
- `debugger.js`: Manages debugger layout and selection state

### Security Architecture

The project uses SES (Secure ECMAScript) to create isolated Compartments for executing user code. This prevents malicious code from accessing the host environment while still allowing full React PDF functionality.

## Common Issues and Solutions

### Initial Render Issue
The PDF may not render on first page load. This is addressed by:
1. Explicitly starting the worker before initialization
2. Adding a 100ms delay for the first render
3. Checking both `isReady` and `pdf` exist before evaluation

### Module Resolution Issues
If you encounter "@swc/helpers" or fontkit errors:
1. Ensure Node.js 18 is being used
2. Check that `@swc/helpers` is installed
3. Verify fontkit version is 2.0.2

### Worker Communication
The worker system uses postMessage for communication. Key methods:
- `init()`: Initialize the worker
- `evaluate()`: Process user code and generate PDF
- `version()`: Get React PDF version and debugging support status

## URL Parameters

The REPL supports code sharing via URL parameters:
- `gz_code`: Gzip-compressed code
- `modules`: Boolean flag for module support
- `cp_`: LZ-string compressed parameters

## Development Notes

- The project uses Next.js 13 with experimental app directory
- Monaco Editor is loaded dynamically for client-side only rendering
- PDF viewer uses pdfjs-dist with custom patches (see `/patches`)
- The worker must be explicitly started with `pdf.start()` before use
- Multiple Jotai instances warning can be ignored (known issue)

## Key Files to Understand

1. `/app/repl.js` - Main REPL interface and worker coordination
2. `/worker/executer.js` - Code evaluation and sandboxing logic
3. `/worker/to-module.js` - Module system and React PDF integration
4. `/next.config.js` - Webpack configuration for worker files and aliases