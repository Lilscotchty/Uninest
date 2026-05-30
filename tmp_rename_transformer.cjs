import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (!['node_modules', '.git', 'dist'].includes(file)) {
                results = results.concat(walk(fullPath));
            }
        } else {
            const ext = path.extname(file);
            if (['.ts', '.tsx', '.json', '.html', '.css', '.md'].includes(ext)) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = [...walk('src'), 'index.html', 'package.json'];

// Add any root config files
if (fs.existsSync('vercel.json')) files.push('vercel.json');
if (fs.existsSync('metadata.json')) files.push('metadata.json');
if (fs.existsSync('.env.example')) files.push('.env.example');
if (fs.existsSync('README.md')) files.push('README.md');

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. App Name replacements
    content = content.replace(/Uninest/g, 'SKYCOBE');
    content = content.replace(/uninest/g, 'skycobe');
    content = content.replace(/UNINEST/g, 'SKYCOBE');
    content = content.replace(/UniNest/g, 'SkyCobe');

    // Special case for Logo rendering: if we see SKYCOBE in JSX, maybe we format it?
    // The prompt says "For the SKYCOBE wordmark, use this typographic treatment wherever the name appears as a brand:"
    // It's tricky to automatically inject JSX styling via regex. I will try to find the Header and manually fix it.

    // 2. Hostel -> Property replacements
    content = content.replace(/hostels/g, 'properties');
    content = content.replace(/Hostels/g, 'Properties');
    content = content.replace(/HOSTELS/g, 'PROPERTIES');
    
    content = content.replace(/hostel/g, 'property');
    content = content.replace(/Hostel/g, 'Property');
    content = content.replace(/HOSTEL/g, 'PROPERTY');

    fs.writeFileSync(file, content, 'utf8');
}
