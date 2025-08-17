# Vercel Deployment Guide

## Important Considerations for Vercel Deployment

### ✅ Things that are already configured correctly:

1. **Build Command**: `next build` is properly set in package.json
2. **Framework**: Next.js 13 with App Router
3. **Dependencies**: All required packages are in package.json

### ⚠️ Things to configure in Vercel:

#### 1. **Build Settings**
- Framework Preset: `Next.js`
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

#### 2. **Node.js Version**
- Set Node.js version to 18.x or higher
- Add to Settings > General > Node.js Version: `18.x`

#### 3. **Environment Variables**
- No environment variables required for basic functionality

### 🚨 Potential Issues and Solutions:

#### 1. **File System Access in API Routes**
The `/api/examples` and `/api/docs` routes use `fs.readFileSync` to read files. This works on Vercel because:
- Files in the project are included in the deployment
- `process.cwd()` works correctly in Vercel serverless functions
- The files are read-only, which is supported

#### 2. **Large Bundle Size**
The project includes:
- Monaco Editor
- React-PDF renderer
- 35+ example files
- 19 documentation files

**Solution**: These are already optimized through Next.js code splitting.

#### 3. **Postinstall Script**
The `postinstall` script runs `patch-package` which patches pdfjs-dist.

**This should work on Vercel**, but if it fails:
- Check the build logs
- May need to commit the patched files directly

#### 4. **Port Configuration**
The app uses port 10001 locally, but Vercel will handle port assignment automatically.

### 📝 Deployment Checklist:

1. **Connect GitHub Repository**
   - Connect your GitHub account
   - Select the repository: `ChakshuGautam/react-pdf-repl`
   - Choose the `main` branch

2. **Configure Build Settings**
   - Leave defaults for Next.js
   - Ensure Node.js 18.x is selected

3. **Deploy**
   - Click Deploy
   - Monitor build logs for any errors

4. **Post-Deployment Testing**
   - Test the examples dropdown
   - Verify PDF rendering works
   - Check API endpoints:
     - `/api/examples`
     - `/api/docs`
   - Test different examples from the dropdown

### 🔧 If Issues Occur:

1. **Build Failures**
   - Check if `patch-package` runs successfully
   - Look for missing dependencies
   - Verify Node.js version

2. **Runtime Errors**
   - Check Function logs in Vercel dashboard
   - Verify file paths are correct
   - Ensure serverless function timeout is sufficient (default 10s should be enough)

3. **Monaco Editor Issues**
   - Should work out of the box with Next.js dynamic imports
   - If issues, may need to add custom webpack config

### 📊 Performance Optimization (Optional):

After deployment, consider:
1. Enable Vercel Analytics (already has dependency)
2. Monitor Core Web Vitals
3. Consider caching strategies for examples/docs

### 🎯 Expected Result:

Once deployed, the app should:
- Load with default PDF example
- Show examples dropdown with all 35+ examples
- Render PDFs in real-time as code changes
- Work with all React-PDF components

The app is already well-configured for Vercel deployment and should work without major changes!