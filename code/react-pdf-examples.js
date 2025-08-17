// React-PDF Examples Loader
// This file provides all React-PDF examples for use in the playground

import fs from 'fs';
import path from 'path';

// Read example files and export them as an object
const examplesDir = path.join(process.cwd(), 'react-pdf-examples');

const examples = {
  // Basic Examples
  'quick-start': fs.readFileSync(path.join(examplesDir, 'quick-start.txt'), 'utf-8'),
  'text': fs.readFileSync(path.join(examplesDir, 'text.txt'), 'utf-8'),
  'images': fs.readFileSync(path.join(examplesDir, 'images.txt'), 'utf-8'),
  'emoji': fs.readFileSync(path.join(examplesDir, 'emoji.txt'), 'utf-8'),
  
  // Styling Examples
  'inline-styles': fs.readFileSync(path.join(examplesDir, 'inline-styles.txt'), 'utf-8'),
  'styles': fs.readFileSync(path.join(examplesDir, 'styles.txt'), 'utf-8'),
  'mixed-styles': fs.readFileSync(path.join(examplesDir, 'mixed-styles.txt'), 'utf-8'),
  'media-queries': fs.readFileSync(path.join(examplesDir, 'media-queries.txt'), 'utf-8'),
  
  // SVG Examples
  'svg': fs.readFileSync(path.join(examplesDir, 'svg.txt'), 'utf-8'),
  'circle': fs.readFileSync(path.join(examplesDir, 'circle.txt'), 'utf-8'),
  'ellipse': fs.readFileSync(path.join(examplesDir, 'ellipse.txt'), 'utf-8'),
  'line': fs.readFileSync(path.join(examplesDir, 'line.txt'), 'utf-8'),
  'path': fs.readFileSync(path.join(examplesDir, 'path.txt'), 'utf-8'),
  'polygon': fs.readFileSync(path.join(examplesDir, 'polygon.txt'), 'utf-8'),
  'polyline': fs.readFileSync(path.join(examplesDir, 'polyline.txt'), 'utf-8'),
  'rect': fs.readFileSync(path.join(examplesDir, 'rect.txt'), 'utf-8'),
  'g': fs.readFileSync(path.join(examplesDir, 'g.txt'), 'utf-8'),
  'svgtext': fs.readFileSync(path.join(examplesDir, 'svgtext.txt'), 'utf-8'),
  'clippath': fs.readFileSync(path.join(examplesDir, 'clippath.txt'), 'utf-8'),
  'lineargradient': fs.readFileSync(path.join(examplesDir, 'lineargradient.txt'), 'utf-8'),
  'radialgradient': fs.readFileSync(path.join(examplesDir, 'radialgradient.txt'), 'utf-8'),
  
  // Layout Examples
  'page-breaks': fs.readFileSync(path.join(examplesDir, 'page-breaks.txt'), 'utf-8'),
  'page-numbers': fs.readFileSync(path.join(examplesDir, 'page-numbers.txt'), 'utf-8'),
  'page-wrap': fs.readFileSync(path.join(examplesDir, 'page-wrap.txt'), 'utf-8'),
  'breakable-unbreakable': fs.readFileSync(path.join(examplesDir, 'breakable-unbreakable.txt'), 'utf-8'),
  'fixed-components': fs.readFileSync(path.join(examplesDir, 'fixed-components.txt'), 'utf-8'),
  'orphans-and-widows': fs.readFileSync(path.join(examplesDir, 'orphans-and-widows.txt'), 'utf-8'),
  'disable-wrapping': fs.readFileSync(path.join(examplesDir, 'disable-wrapping.txt'), 'utf-8'),
  'disable-hyphenation': fs.readFileSync(path.join(examplesDir, 'disable-hyphenation.txt'), 'utf-8'),
  
  // Advanced Examples
  'fractals': fs.readFileSync(path.join(examplesDir, 'fractals.txt'), 'utf-8'),
  'resume': fs.readFileSync(path.join(examplesDir, 'resume.txt'), 'utf-8'),
  'font-register': fs.readFileSync(path.join(examplesDir, 'font-register.txt'), 'utf-8'),
  'hyphenation-callback': fs.readFileSync(path.join(examplesDir, 'hyphenation-callback.txt'), 'utf-8'),
  'debugging': fs.readFileSync(path.join(examplesDir, 'debugging.txt'), 'utf-8'),
  'knobs': fs.readFileSync(path.join(examplesDir, 'knobs.txt'), 'utf-8'),
};

export default examples;