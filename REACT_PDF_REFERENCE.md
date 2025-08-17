# React-PDF Reference Documentation

This file provides an index of all React-PDF documentation and examples imported from the official repository. Use this as a quick reference guide when building PDF components.

## Documentation Files

Located in `react-pdf-docs/`:

### Getting Started
- **quick-start.md** - Basic setup and first PDF document
- **components.md** - Complete list of available components
- **styling.md** - How to style PDF components
- **rendering-process.md** - Understanding how React-PDF renders documents

### Advanced Features
- **advanced.md** - Advanced techniques and patterns
- **dynamic-content.md** - Generating dynamic PDFs
- **fonts.md** - Custom fonts configuration
- **hyphenation.md** - Text hyphenation support
- **svg.md** - SVG support in PDFs
- **hooks.md** - Available React hooks for PDFs
- **page-wrapping.md** - Page break and wrapping control
- **orphan-widow-protection.md** - Typography control for orphans and widows
- **document-navigation.md** - Creating navigable PDFs

### Deployment & Integration
- **node.md** - Server-side rendering with Node.js
- **express.md** - Express.js integration
- **web-workers.md** - Using web workers for rendering
- **on-the-fly.md** - Generating PDFs on demand
- **compatibility.md** - Browser and environment compatibility

### Development
- **debugging.md** - Debugging techniques for React-PDF

## Example Files

Located in `react-pdf-examples/`:

### Basic Components
- **quick-start.txt** - Basic PDF example
- **text.txt** - Text component examples
- **images.txt** - Image handling
- **emoji.txt** - Emoji support

### Styling Examples
- **inline-styles.txt** - Inline styling
- **styles.txt** - Style objects
- **mixed-styles.txt** - Combining style approaches
- **media-queries.txt** - Responsive PDFs with media queries

### SVG Examples
- **svg.txt** - Basic SVG usage
- **circle.txt** - SVG circle
- **ellipse.txt** - SVG ellipse
- **line.txt** - SVG line
- **path.txt** - SVG path
- **polygon.txt** - SVG polygon
- **polyline.txt** - SVG polyline
- **rect.txt** - SVG rectangle
- **g.txt** - SVG groups
- **svgtext.txt** - SVG text
- **clippath.txt** - SVG clipping paths
- **lineargradient.txt** - Linear gradients
- **radialgradient.txt** - Radial gradients

### Layout Control
- **page-breaks.txt** - Page break control
- **page-numbers.txt** - Adding page numbers
- **page-wrap.txt** - Page wrapping examples
- **breakable-unbreakable.txt** - Breakable/unbreakable content
- **fixed-components.txt** - Fixed positioned components
- **orphans-and-widows.txt** - Typography control
- **disable-wrapping.txt** - Disable text wrapping
- **disable-hyphenation.txt** - Disable hyphenation

### Advanced Examples
- **fractals.txt** - Fractal generation example
- **resume.txt** - Complete resume example
- **font-register.txt** - Custom font registration
- **hyphenation-callback.txt** - Custom hyphenation
- **debugging.txt** - Debugging example
- **knobs.txt** - Interactive knobs example

## Usage in LLM Context

When using Claude or other LLMs to build React-PDF components:

1. **Reference specific documentation**: Ask to check `react-pdf-docs/[filename].md` for detailed information
2. **Use examples as templates**: Reference `react-pdf-examples/[filename].txt` for working code examples
3. **Component list**: See `react-pdf-docs/components.md` for all available components
4. **Styling guide**: Check `react-pdf-docs/styling.md` for styling approaches

## Quick Reference

### Essential Components
- `Document` - Root component
- `Page` - Individual pages
- `View` - Container component (like div)
- `Text` - Text content
- `Image` - Images
- `Link` - Hyperlinks
- `Canvas` - Custom drawings
- `SVG` - SVG graphics

### Common Props
- `style` - Style object
- `fixed` - Fixed positioning
- `break` - Page break control
- `wrap` - Text wrapping
- `render` - Dynamic content function
- `debug` - Enable debugging

### Style Properties
React-PDF uses a subset of CSS properties adapted for PDF generation. See `react-pdf-docs/styling.md` for complete list.

## Integration with PDF Playground

The PDF playground at `/app/page.tsx` can use these examples directly:
1. Load any example from `react-pdf-examples/`
2. Modify and test in the playground
3. Save as templates for reuse

When asked to implement specific React-PDF features, refer to the appropriate documentation and examples in these directories.