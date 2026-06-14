import fs from 'fs';
import path from 'path';

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      let modified = content
        .replace(/bg-slate-900/g, 'bg-[var(--color-button)]')
        .replace(/hover:bg-black/g, 'hover:bg-[var(--color-button-hover)]')
        .replace(/shadow-\[0_4px_12px_var\(--color-accent-muted\)\]/g, 'shadow-[var(--shadow-button)]')
        .replace(/shadow-\[0_4px_14px_rgba\((?:55,48,163|0,0,0),0\.35\)\]/g, 'shadow-[var(--shadow-button)]');

      if (content !== modified) {
        fs.writeFileSync(fullPath, modified, 'utf-8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('./src');
