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
      
      let modified = content;
      
      // We will replace border-[var(--color-accent)] inside these active button conditions 
      // with border-[var(--color-button)] or just border-transparent depending on the design.
      // Easiest is border-transparent if they want it removed, but border-[var(--color-button)] 
      // is the same color as the background, which is nice.
      // Wait, "In light theme remove the green bothers around the filter buttons"
      // Let's replace 'bg-[var(--color-button)] text-white border-[var(--color-accent)]' 
      // with 'bg-[var(--color-button)] text-white border-transparent'
      modified = modified.replace(/border-\[var\(--color-accent\)\] shadow-\[var\(--shadow-button\)\]/g, 'border-transparent shadow-[var(--shadow-button)]');
      
      // Let's also replace just border-[var(--color-accent)] near bg-[var(--color-button)]
      modified = modified.replace(/bg-\[var\(--color-button\)\] text-white border-\[var\(--color-accent\)\]/g, 'bg-[var(--color-button)] text-white border-[var(--color-button)]');

      if (content !== modified) {
        fs.writeFileSync(fullPath, modified, 'utf-8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('./src');
