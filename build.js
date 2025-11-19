const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

// Files to copy (excluding subdirectories like renderers)
const filesToCopy = [
  'magic-markup.js',
  'magic-markup.css',
  'magic-markup-dark.css'
];

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('✓ Created dist directory');
}

console.log('Building Magic Markup...\n');

// Copy and minify files
filesToCopy.forEach(file => {
  const srcFile = path.join(srcDir, file);
  const distFile = path.join(distDir, file);
  const ext = path.extname(file);
  const baseName = path.basename(file, ext);
  const minFile = path.join(distDir, `${baseName}.min${ext}`);
  
  if (fs.existsSync(srcFile)) {
    // Copy regular version
    fs.copyFileSync(srcFile, distFile);
    console.log(`✓ Copied ${file} to dist/`);
    
    // Create minified version
    try {
      if (ext === '.js') {
        // Minify JavaScript with Terser
        execSync(`npx terser "${distFile}" -o "${minFile}" -c -m`, { stdio: 'pipe' });
        console.log(`✓ Minified ${file} → ${baseName}.min${ext}`);
      } else if (ext === '.css') {
        // Minify CSS with clean-css
        execSync(`npx cleancss -o "${minFile}" "${distFile}"`, { stdio: 'pipe' });
        console.log(`✓ Minified ${file} → ${baseName}.min${ext}`);
      }
      
      // Show file size comparison
      const originalSize = fs.statSync(distFile).size;
      const minifiedSize = fs.statSync(minFile).size;
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
      console.log(`  Size: ${(originalSize / 1024).toFixed(1)}KB → ${(minifiedSize / 1024).toFixed(1)}KB (${savings}% smaller)\n`);
    } catch (error) {
      console.error(`✗ Error minifying ${file}:`, error.message);
    }
  } else {
    console.warn(`⚠ Warning: ${file} not found in src/`);
  }
});

console.log('✅ Build complete!');
