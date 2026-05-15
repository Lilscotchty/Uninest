const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Replace common light colors with semantic variables that adapt
      if (content.includes('bg-white') && !fullPath.includes('Splash') && !fullPath.includes('SignUp')) {
        content = content.replace(/bg-white/g, 'bg-card-bg');
        // Exception: restore instances that needed exact white overlay, 
        // like bg-white/10
        content = content.replace(/bg-card-bg\/10/g, 'bg-white/10');
        content = content.replace(/bg-card-bg\/5/g, 'bg-white/5');
        modified = true;
      }
      
      // We will also just keep bg-white logic but SignUp is skipped since it has a very different dark/light color scheme natively
      if (content.includes('bg-gray-50')) {
        content = content.replace(/bg-gray-50/g, 'bg-app-bg');
        modified = true;
      }
      if (content.includes('bg-slate-50')) {
        content = content.replace(/bg-slate-50/g, 'bg-app-bg');
        modified = true;
      }
      if (content.includes('border-black/5')) {
        content = content.replace(/border-black\/5/g, 'border-border-subtle');
        modified = true;
      }
      if (content.includes('bg-slate-100')) {
        content = content.replace(/bg-slate-100/g, 'bg-indigo-light/20');
        modified = true;
      }
      if (content.includes('text-slate-500') || content.includes('text-slate-700')) {
         content = content.replace(/text-slate-[57]00/g, 'text-text-muted');
         modified = true;
      }

      // Check for hardcoded text-white. 
      // If it's a primary text, maybe it should be text-text-white. 
      // e.g. text-white on Amber bg => ok to remain white.
      // But text-white on indigo might be ok in dark or light mode.

      if (modified) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Replaced common colors with semantic tailwind counterparts');
