const fs = require('fs');
const path = require('path');

function replaceTokens(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Backgrounds
  content = content.replace(/bg-white\s+dark:bg-gray-[0-9]+/g, 'bg-[var(--color-surface)]');
  content = content.replace(/bg-white\s+dark:bg-customDark/g, 'bg-[var(--color-surface)]');
  content = content.replace(/bg-gray-50\s+dark:bg-gray-[0-9]+(\/60)?/g, 'bg-[var(--color-input-bg)]');
  content = content.replace(/bg-gray-100\s+dark:bg-gray-[0-9]+(\/60)?/g, 'bg-[var(--color-surface-2)]');
  content = content.replace(/bg-gray-200\s+dark:bg-gray-[0-9]+/g, 'bg-[var(--color-border)]');

  // Text colors
  content = content.replace(/text-gray-900\s+dark:text-white/g, 'text-[var(--color-text-primary)]');
  content = content.replace(/text-gray-900\s+dark:text-gray-200/g, 'text-[var(--color-text-primary)]');
  content = content.replace(/text-gray-[89]00\s+dark:text-gray-100/g, 'text-[var(--color-text-primary)]');
  content = content.replace(/text-gray-500\s+dark:text-gray-[34]00/g, 'text-[var(--color-text-secondary)]');
  content = content.replace(/text-gray-400\s+dark:text-gray-500/g, 'text-[var(--color-text-disabled)]');
  
  // Teal/green stats text
  content = content.replace(/text-teal-400/g, 'text-[var(--color-highlight)]');
  content = content.replace(/text-teal-[0-9]00\s+dark:text-teal-[0-9]00/g, 'text-[var(--color-highlight)]');

  // Blue stats text
  content = content.replace(/text-blue-500\s+dark:text-blue-400/g, 'text-[var(--color-text-primary)]');

  // Purple buttons -> accent
  content = content.replace(/bg-purple-700\s+text-white/g, 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]');

  // Borders
  content = content.replace(/border-gray-[12]00\s+dark:border-gray-[78]00/g, 'border-[var(--color-border)]');

  // Any remaining simple dark:bg something
  content = content.replace(/dark:bg-[a-zA-Z0-9\/\[\]\-]+/g, '');
  content = content.replace(/dark:text-[a-zA-Z0-9\/\[\]\-]+/g, '');
  content = content.replace(/dark:border-[a-zA-Z0-9\/\[\]\-]+/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
}

replaceTokens('./src/pages/ManagerDashboard.tsx');
if (fs.existsSync('./src/pages/Details.tsx')) replaceTokens('./src/pages/Details.tsx');
if (fs.existsSync('./src/components/layout/AppShell.tsx')) replaceTokens('./src/components/layout/AppShell.tsx');
if (fs.existsSync('./src/components/Navigation.tsx')) replaceTokens('./src/components/Navigation.tsx');
if (fs.existsSync('./src/components/BottomNav.tsx')) replaceTokens('./src/components/BottomNav.tsx');
if (fs.existsSync('./src/components/AuthForm.tsx')) replaceTokens('./src/components/AuthForm.tsx');
