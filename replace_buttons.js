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
      
      // Let's replace button-like classes
      // Pattern: a className that contains bg-[var(--color-accent)]
      // and hover:bg-[var(--color-accent-hover)]
      
      // We can search for <button ... > up to the closing > and replace colors inside it.
      // But JSX can have multiple lines. We can use a regex that matches <button[\s\S]*?>
      // and also <Link[\s\S]*?> that look like buttons
      
      // Actually, since the user said "change all buttons across the app to black", 
      // let's do this:
      
      let modified = content.replace(/<(button|Link|a)([\s\S]*?)>/g, (match, tag, inner) => {
        // Replace bg-[var(--color-accent)] with bg-slate-900 or bg-black
        // Replace bg-emerald-600 with bg-slate-900 (often used for green buttons)
        let newInner = inner
          .replace(/bg-\[var\(--color-accent\)\]/g, 'bg-slate-900')
          .replace(/hover:bg-\[var\(--color-accent-hover\)\]/g, 'hover:bg-black')
          .replace(/bg-emerald-600/g, 'bg-slate-900')
          .replace(/hover:bg-emerald-700/g, 'hover:bg-black')
          .replace(/bg-teal-600/g, 'bg-slate-900')
          .replace(/hover:bg-teal-700/g, 'hover:bg-black')
          .replace(/bg-\[var\(--color-accent\)\]\/90/g, 'bg-slate-900/90')
          .replace(/text-\[var\(--color-accent\)\]/g, 'text-slate-900')
          .replace(/hover:text-\[var\(--color-accent-hover\)\]/g, 'hover:text-black')
          .replace(/from-blue-500/g, 'from-slate-800')
          .replace(/to-blue-600/g, 'to-slate-900')
          .replace(/hover:from-blue-600/g, 'hover:from-slate-900')
          .replace(/hover:to-blue-700/g, 'hover:to-black')
          .replace(/bg-amber-500/g, 'bg-slate-900')
          .replace(/hover:bg-amber-600/g, 'hover:bg-black')
          .replace(/bg-emerald-500/g, 'bg-slate-900');
        
        return `<${tag}${newInner}>`;
      });
      
      // Also apply to divs that have onClick and look like buttons (e.g. rounded padding)
      modified = modified.replace(/<div([\s\S]*?onClick[\s\S]*?)>/g, (match, inner) => {
        let newInner = inner
          .replace(/bg-\[var\(--color-accent\)\]/g, 'bg-slate-900')
          .replace(/hover:bg-\[var\(--color-accent-hover\)\]/g, 'hover:bg-black');
        return `<div${newInner}>`;
      });

      if (content !== modified) {
        fs.writeFileSync(fullPath, modified, 'utf-8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('./src');
