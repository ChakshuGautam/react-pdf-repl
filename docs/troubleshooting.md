# Troubleshooting Guide

Common issues and their solutions for the React-PDF Playground.

## Common Errors

### Import Errors

#### Problem: "StyleSheet is not defined"
```
ReferenceError: StyleSheet is not defined
```

**Solution:** The playground auto-imports missing components. If it fails, manually add:
```jsx
import { StyleSheet } from '@react-pdf/renderer';
```

#### Problem: "Text is not defined" with duplicate imports
```
import { Document, Page, View, Text, Text as SvgText } from '@react-pdf/renderer';
```

**Solution:** The system automatically removes duplicate Text imports. Don't import `Text as SvgText`.

#### Problem: "ReactPDF is not defined"
```
ReferenceError: ReactPDF is not defined
```

**Solution:** ReactPDF.render() is not needed in the playground. Remove any:
```jsx
// Remove this line:
ReactPDF.render(<MyDocument />);
```

### Rendering Issues

#### Problem: PDF doesn't render
**Possible causes and solutions:**

1. **Missing default export:**
```jsx
// Add this at the end:
export default MyDocument;
```

2. **Syntax errors in code:**
- Check browser console for errors
- Verify JSX is properly closed
- Ensure all brackets match

3. **Invalid component structure:**
```jsx
// Document must wrap everything:
<Document>
  <Page>
    <View>
      <Text>Content</Text>
    </View>
  </Page>
</Document>
```

#### Problem: Blank PDF or white screen
**Solutions:**
- Check if Page has content
- Verify styles aren't hiding content
- Ensure Text components have content
- Check for height: 0 or width: 0 styles

#### Problem: "Maximum call stack exceeded"
**Cause:** Infinite loop in render logic

**Solution:** Check for:
- Recursive component calls
- State updates in render
- Circular dependencies

### Styling Issues

#### Problem: Styles not applying
```jsx
// Wrong:
<Text style="color: red">Text</Text>

// Correct:
<Text style={{ color: 'red' }}>Text</Text>

// Or use StyleSheet:
const styles = StyleSheet.create({
  text: { color: 'red' }
});
<Text style={styles.text}>Text</Text>
```

#### Problem: Flexbox not working as expected
**Note:** React-PDF uses Yoga layout engine, which has some differences from CSS flexbox:

```jsx
// Ensure flex properties are set correctly:
<View style={{ 
  display: 'flex',  // Not needed, View is flex by default
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center'
}}>
```

#### Problem: Media queries not working
```jsx
// Correct syntax:
const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    '@media max-width: 400': {
      fontSize: 10
    }
  }
});
```

### API Issues

#### Problem: Examples API returns empty array on Vercel
```json
{"examples": []}
```

**Solution:** This is fixed in latest version. Ensure you're using static imports.

#### Problem: CORS errors when calling API
**Solution:** CORS is enabled. Check:
- Using correct URL
- Network connectivity
- Browser extensions not blocking

### Deployment Issues

#### Problem: Build fails on Vercel with patch-package
```
ERROR: Failed to apply patch for package pdfjs-dist
```

**Solution:** Ensure `package.json` has exact version:
```json
"pdfjs-dist": "3.3.122"  // No ^ or ~
```

#### Problem: "Module not found" errors on Vercel
**Solution:** All imports must be static. Don't use dynamic imports:
```jsx
// Wrong:
const Example = await import('./example');

// Correct:
import Example from './example';
```

### Performance Issues

#### Problem: Editor is slow or laggy
**Solutions:**
- Reduce PDF complexity
- Avoid large data arrays
- Minimize re-renders
- Close debugging panel if not needed

#### Problem: PDF generation times out
**Solution:** Simplify your document:
- Reduce number of pages
- Optimize images (use smaller sizes)
- Avoid complex calculations in render

### Font Issues

#### Problem: Custom fonts not loading
```jsx
// Register fonts before using:
import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf'
});

// Then use in styles:
const styles = StyleSheet.create({
  text: { fontFamily: 'Roboto' }
});
```

#### Problem: Emoji not displaying
```jsx
import { Font } from '@react-pdf/renderer';

// Register emoji source:
Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/'
});
```

### Image Issues

#### Problem: Images not loading
**Check:**
- URL is accessible (HTTPS preferred)
- CORS headers allow access
- Image format is supported (PNG, JPG)

```jsx
// Use full URLs:
<Image src="https://example.com/image.png" />

// For local images in production, use public URLs
```

### Development Issues

#### Problem: `npm install` fails
**Solutions:**
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules: `rm -rf node_modules`
3. Delete package-lock: `rm package-lock.json`
4. Reinstall: `npm install`

#### Problem: Port 10001 already in use
**Solution:** Kill the process:
```bash
# Find process:
lsof -i :10001

# Kill it:
kill -9 <PID>

# Or use different port:
npm run dev -- -p 3000
```

## Browser Compatibility

### Supported Browsers
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

### Known Browser Issues
- **Safari**: Some flexbox layouts may render differently
- **Firefox**: Large PDFs may be slower to render
- **Mobile**: Limited debugging panel functionality

## Getting Help

### Before Asking for Help
1. Check browser console for errors
2. Verify code works in official React-PDF
3. Try a simpler example first
4. Clear browser cache
5. Update to latest version

### Where to Get Help
- [GitHub Issues](https://github.com/ChakshuGautam/react-pdf-repl/issues)
- [React-PDF Documentation](https://react-pdf.org)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-pdf)

### Reporting Bugs
Include:
1. Error message (full stack trace)
2. Code that causes the issue
3. Browser and version
4. Expected vs actual behavior
5. Steps to reproduce

## Debug Mode

Enable debug mode for more information:
```jsx
<Document debug>
  <Page debug>
    <View debug>
      <Text>Debug mode enabled</Text>
    </View>
  </Page>
</Document>
```

## FAQ

**Q: Can I use custom React components?**
A: Only React-PDF components are supported, not custom React components.

**Q: Why is my PDF blank?**
A: Check that you have content in Text components and proper document structure.

**Q: Can I save the PDF?**
A: Click "Open PDF" button, then save from your browser.

**Q: How do I share my code?**
A: Click "Copy Link" to get a shareable URL with your code.

**Q: Is there a size limit?**
A: Practical limit is ~1000 pages or 10MB PDFs.

---

Last Updated: 2024