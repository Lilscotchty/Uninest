import fs from 'fs';

const files = [
  'src/pages/Explore.tsx',
  'src/pages/Details.tsx',
  'src/pages/Home.tsx',
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace duplicate size attributes by stripping out size= from the tags
    content = content.replace(/<Heart size=\{16\} strokeWidth=\{2\.5\}( [^>]*) size=\{[^\}]+\}/g, '<Heart strokeWidth={2.5}$1');
    content = content.replace(/<Heart size=\{16\} strokeWidth=\{2\.5\} fill="none" color="currentColor"( [^>]*) size=\{[^\}]+\}/g, '<Heart strokeWidth={2.5} fill="none" color="currentColor"$1');
    
    content = content.replace(/<Heart size=\{16\} strokeWidth=\{2\}( [^>]*) size=\{[^\}]+\}/g, '<Heart strokeWidth={2}$1');
    content = content.replace(/<MessageCircle size=\{20\}( [^>]*) size=\{[^\}]+\}/g, '<MessageCircle $1');
    content = content.replace(/<Star size=\{12\}( [^>]*) size=\{[^\}]+\}/g, '<Star $1');
    content = content.replace(/<Star size=\{14\}( [^>]*) size=\{[^\}]+\}/g, '<Star $1');
    
    content = content.replace(/<MapPin size=\{16\}( [^>]*) size=\{[^\}]+\}/g, '<MapPin $1');

    // Also fix the undefined Fa icons in Details.tsx
    content = content.replace(/FaWifi/g, 'Wifi');
    content = content.replace(/FaSnowflake/g, 'Snowflake');
    content = content.replace(/FaShieldAlt/g, 'ShieldCheck');
    content = content.replace(/FaPlug/g, 'PlugZap');
    content = content.replace(/FaBookOpen/g, 'BookOpen');
    content = content.replace(/FaTint/g, 'Droplet');
    content = content.replace(/FaUtensils/g, 'Coffee');
    content = content.replace(/FaVrCardboard/g, 'Video');

    fs.writeFileSync(file, content, 'utf8');
  }
}
