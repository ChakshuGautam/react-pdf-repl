# Deployment Guide

This guide covers deploying the React-PDF Playground to various platforms.

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Repository forked or cloned

### Step-by-Step Deployment

1. **Fork/Clone Repository**
```bash
git clone https://github.com/ChakshuGautam/react-pdf-repl.git
cd react-pdf-repl
```

2. **Push to Your GitHub**
```bash
git remote add origin https://github.com/YOUR_USERNAME/react-pdf-repl.git
git push -u origin main
```

3. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Select the repository

4. **Configure Build Settings**
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

5. **Environment Settings**
- **Node.js Version**: 18.x
- No environment variables needed

6. **Deploy**
- Click "Deploy"
- Wait for build to complete (~2-3 minutes)

### Important Configuration

#### package.json Requirements
Ensure `pdfjs-dist` is locked to exact version:
```json
{
  "dependencies": {
    "pdfjs-dist": "3.3.122"  // No ^ prefix
  }
}
```

#### Static Examples
Examples must be compiled to static imports:
```bash
node -e "
const fs = require('fs');
const path = require('path');
// ... generation script
"
```

### Post-Deployment Checklist
- [ ] Test examples dropdown loads
- [ ] Verify PDF rendering works
- [ ] Check API endpoints (`/api/examples`, `/api/docs`)
- [ ] Test all example categories
- [ ] Verify debugging panel works

## Alternative Platforms

### Netlify

1. **Build Settings**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
```

2. **Deploy**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Railway

1. **Configure**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

2. **Deploy**
```bash
railway up
```

### Self-Hosted

#### Using Docker

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/react-pdf-examples ./react-pdf-examples
COPY --from=builder /app/react-pdf-docs ./react-pdf-docs
COPY --from=builder /app/lib ./lib
RUN npm ci --production

EXPOSE 3000
CMD ["npm", "start"]
```

2. **Build and Run**
```bash
docker build -t react-pdf-playground .
docker run -p 3000:3000 react-pdf-playground
```

#### Using PM2

1. **Install PM2**
```bash
npm install -g pm2
```

2. **Create ecosystem file**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'react-pdf-playground',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

3. **Start application**
```bash
npm run build
pm2 start ecosystem.config.js
```

## Production Optimizations

### Build Optimizations

1. **Next.js Config**
```javascript
// next.config.js
module.exports = {
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true
};
```

2. **Image Optimization**
- Use Next.js Image component
- Serve images from CDN
- Optimize image sizes

### Performance Monitoring

1. **Vercel Analytics**
```javascript
// Already included in package.json
"@vercel/analytics": "^0.1.11"
```

2. **Custom Monitoring**
```javascript
// Add to pages/_app.js
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

### Security Headers

Add to `next.config.js`:
```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  }
};
```

## Environment Variables

### Optional Variables
```env
# .env.local (optional)
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Using Environment Variables
```javascript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
```

## Troubleshooting Deployment

### Common Issues

#### Build Fails
- Check Node.js version (must be 18.x+)
- Verify pdfjs-dist version is locked
- Check patch-package runs successfully

#### API Returns Empty
- Ensure static-examples.js is generated
- Verify file paths are correct
- Check build logs for errors

#### PDF Generation Fails
- Increase serverless function timeout
- Check memory limits
- Verify worker files are included

### Debugging Production

1. **Check Logs**
- Vercel: Dashboard → Functions → Logs
- Netlify: Dashboard → Functions → Logs
- Self-hosted: `pm2 logs` or Docker logs

2. **Enable Debug Mode**
```javascript
// Add to API routes
console.log('Debug info:', {
  cwd: process.cwd(),
  files: fs.readdirSync('.'),
  env: process.env.NODE_ENV
});
```

## Maintenance

### Regular Updates

1. **Update Dependencies**
```bash
npm update
npm audit fix
```

2. **Regenerate Static Files**
```bash
# After adding examples
node scripts/generate-static-examples.js
```

3. **Clear Build Cache**
- Vercel: Settings → Clear Cache
- Netlify: Deploy Settings → Clear cache and retry

### Backup Strategy

1. **Code Backup**
- Use Git for version control
- Regular commits and tags
- Multiple remote repositories

2. **Data Backup**
- Examples in `react-pdf-examples/`
- Documentation in `react-pdf-docs/`
- User templates (if implemented)

## Scaling Considerations

### Traffic Handling
- Vercel auto-scales
- Use CDN for static assets
- Implement caching strategies

### Performance Optimization
- Lazy load examples
- Code splitting
- Image optimization
- Minimize bundle size

### Cost Management
- Monitor usage on Vercel dashboard
- Set spending limits
- Use caching to reduce function calls

## CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
```

### Pre-deployment Checks
- Lint code: `npm run lint`
- Type check: `npm run type-check`
- Test build: `npm run build`

---

Last Updated: 2024