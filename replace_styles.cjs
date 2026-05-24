const fs = require('fs');

let content = fs.readFileSync('src/pages/ManagerDashboard.tsx', 'utf8');

// 1. Remove font-fraunces
content = content.replace(/font-fraunces/g, '');

// 2. Backgrounds: bg-card-bg and bg-app-bg
content = content.replace(/bg-card-bg/g, 'bg-white dark:bg-customDark');
content = content.replace(/bg-app-bg\/50/g, 'bg-white dark:bg-customDark');
content = content.replace(/bg-app-bg/g, 'bg-white dark:bg-customDark');

// 3. Borders: border-border-subtle
content = content.replace(/border-border-subtle/g, 'border-gray-100 dark:border-gray-800');

// 4. Update Header sizes
content = content.replace(/text-xl font-bold text-text-primary/g, 'text-3xl font-bold tracking-tight text-gray-900 dark:text-white');
content = content.replace(/font-bold text-lg text-indigo/g, 'text-3xl font-bold tracking-tight text-gray-900 dark:text-white');
content = content.replace(/text-lg font-bold text-text-primary mb-4/g, 'text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4');
content = content.replace(/text-lg font-bold text-text-primary mb-2/g, 'text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2');

// 5. Body Text & Labels
// text-sm font-semibold text-text-primary -> text-base font-medium text-gray-900 dark:text-gray-200
content = content.replace(/text-sm font-semibold text-text-primary/g, 'text-base font-medium text-gray-900 dark:text-gray-200');
// text-xs font-semibold text-text-primary -> text-sm font-normal text-gray-500 dark:text-gray-400
content = content.replace(/text-xs font-semibold text-text-primary/g, 'text-sm font-normal text-gray-500 dark:text-gray-400');
// font-semibold text-text-primary -> text-base font-medium text-gray-900 dark:text-gray-200
content = content.replace(/font-semibold text-text-primary/g, 'text-base font-medium text-gray-900 dark:text-gray-200');

// 6. Secondary text
content = content.replace(/text-sm text-text-muted mt-1/g, 'text-sm font-normal text-gray-500 dark:text-gray-400 mt-1');
content = content.replace(/text-sm text-text-muted/g, 'text-sm font-normal text-gray-500 dark:text-gray-400');
content = content.replace(/text-xs text-text-muted/g, 'text-xs font-normal text-gray-400 dark:text-gray-500');

// 7. Stat Cards / Nav Items updates (if any specifically needed)
content = content.replace(/text-xs font-semibold text-text-muted uppercase tracking-wide/g, 'text-xs font-normal text-gray-400 dark:text-gray-500 uppercase tracking-wide');
content = content.replace(/text-sm font-semibold text-text-muted/g, 'text-sm font-normal text-gray-500 dark:text-gray-400');

// Adjust paddings (p-4 -> p-6, gap-3 -> gap-4 where applicable)
// But to be safe, we can just replace p-4 flex flex-col gap-5 with p-6 flex flex-col gap-6 for layout panels.
content = content.replace(/p-4 flex flex-col gap-5/g, 'p-6 flex flex-col gap-6');
content = content.replace(/p-4 rounded-2xl/g, 'p-6 rounded-2xl');

// Write back
fs.writeFileSync('src/pages/ManagerDashboard.tsx', content, 'utf8');
