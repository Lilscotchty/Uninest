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
      
      // Match anything that looks like className="..." or className={`...`} that contains bg-[var(--color-accent)]
      // Instead of parsing HTML tags, since the user wants *all* buttons black,
      // and most of these are buttons, let's just do a blanket replace of 
      // bg-[var(--color-accent)] where it is clearly used as a button background!
      // But actually, we can just replace ALL `bg-[var(--color-accent)]` with `bg-slate-900`
      // everywhere EXCEPT if it's explicitly not a button (like an icon background).
      // Since they asked to "change all buttons across the app to black", maybe they mean everywhere where a button appears.
      // Let's improve the tag matcher.
      // A tag starting with <button ... up to </button>
      
      let modified = content;
      
      // We can use a simpler regex for className that contains bg-[var(--color-accent)] 
      // ONLY if there's a button or Link around it.
      // Let's just tokenize by `<button`, `<Link`, `<a` and replace inside till `</button>`, `</Link>`, `</a>` or `/>`.
      // Actually, since React code is well formatted, let's just replace any `bg-[var(--color-accent)]` with `bg-slate-900` if the line contains `button` or `className` near it.
      // Actually, why not just replace `bg-[var(--color-accent)]` with `bg-slate-900` globally where it appears inside `className`? 
      // "while maintaining the green colored theme" implies they WANT green for other things (like highlighted text, icons, progress bars). So only backgrounds of buttons.
      
      let tokens = modified.split(/(<\/?button[\s\S]*?>|<\/?Link[\s\S]*?>|<\/?a[\s\S]*?>)/gi);
      
      for (let i = 0; i < tokens.length; i++) {
        // If it's a tag opening, or content inside a button
        if (tokens[i] && (tokens[i].startsWith('<button') || tokens[i].startsWith('<Link') || tokens[i].startsWith('<a'))) {
          tokens[i] = tokens[i]
            .replace(/bg-\[var\(--color-accent\)\]/g, 'bg-slate-900')
            .replace(/hover:bg-\[var\(--color-accent-hover\)\]/g, 'hover:bg-black')
            .replace(/bg-\[var\(--color-accent-muted\)\]/g, 'bg-slate-800')
            .replace(/bg-\[var\(--color-accent-hover\)\]/g, 'bg-black');
        }
      }
      
      modified = tokens.join('');
      
      // Now a separate pass for `className="..."` inside `<button...>` tags that the split might have missed (actually it didn't miss, the split grabbed the whole `<button ... >` if we fix the regex)
      // Wait, `(<\/?button[\s\S]*?>)` will split by the tag itself.
      // So tokens[i] IS the tag, but NOT the inner content!
      
      // Let's use string manipulation to find `<button` and then find the corresponding `className` string.
      modified = modified.replace(/<button([\s\S]*?)<\/button>/gi, (match) => {
          return match
            .replace(/bg-\[var\(--color-accent\)\]/g, 'bg-slate-900')
            .replace(/hover:bg-\[var\(--color-accent-hover\)\]/g, 'hover:bg-black');
      });
      modified = modified.replace(/<button([\s\S]*?)(\/>)/gi, (match) => {
          return match
            .replace(/bg-\[var\(--color-accent\)\]/g, 'bg-slate-900')
            .replace(/hover:bg-\[var\(--color-accent-hover\)\]/g, 'hover:bg-black');
      });
      // Also Links
      modified = modified.replace(/<Link([\s\S]*?)<\/Link>/gi, (match) => {
          return match
            .replace(/bg-\[var\(--color-accent\)\]/g, 'bg-slate-900')
            .replace(/hover:bg-\[var\(--color-accent-hover\)\]/g, 'hover:bg-black');
      });

      if (content !== modified) {
        fs.writeFileSync(fullPath, modified, 'utf-8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('./src');
