const fs = require('fs');
const path = require('path');

function replaceTokens(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/bg-white/g, 'bg-[var(--color-surface)]');
  content = content.replace(/bg-gray-50/g, 'bg-[var(--color-input-bg)]');
  content = content.replace(/bg-gray-100/g, 'bg-[var(--color-surface-2)]');
  content = content.replace(/bg-gray-200/g, 'bg-[var(--color-border)]');
  content = content.replace(/text-gray-900/g, 'text-[var(--color-text-primary)]');
  content = content.replace(/text-gray-800/g, 'text-[var(--color-text-primary)]');
  content = content.replace(/text-gray-500/g, 'text-[var(--color-text-secondary)]');
  content = content.replace(/text-gray-400/g, 'text-[var(--color-text-disabled)]');
  content = content.replace(/text-gray-300/g, 'text-[var(--color-text-disabled)]');
  content = content.replace(/border-gray-100/g, 'border-[var(--color-border)]');
  content = content.replace(/border-gray-200/g, 'border-[var(--color-border)]');
  content = content.replace(/text-teal-[34]00/g, 'text-[var(--color-highlight)]');
  content = content.replace(/text-blue-500/g, 'text-[var(--color-text-primary)]');
  // Need to be careful with bg-indigo, but replacing to avoid missed ones.
  content = content.replace(/bg-indigo-light/g, 'bg-[var(--color-accent-muted)]');
  content = content.replace(/text-indigo/g, 'text-[var(--color-accent)]');
  content = content.replace(/border-indigo/g, 'border-[var(--color-accent)]');
  content = content.replace(/bg-indigo/g, 'bg-[var(--color-accent)]');
  content = content.replace(/focus:border-indigo/g, 'focus:border-[var(--color-accent)]');
  content = content.replace(/focus:ring-indigo-[0-9]+/g, 'focus:ring-[var(--color-accent)]');
  
  // Also clean up any double bg-[var(--color-surface)] that might have been caused since I replaced it once before
  content = content.replace(/bg-\[var\(--color-surface\)\]\s+bg-\[var\(--color-surface\)\]/g, 'bg-[var(--color-surface)]');

  fs.writeFileSync(filePath, content, 'utf8');
}

function processDirectory(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceTokens(fullPath);
    }
  }
}

processDirectory('./src');
