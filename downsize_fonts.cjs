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
      
      // Cleanup double spaces left by removing font-fraunces
      content = content.replace(/className="\s+/g, 'className="');
      
      // Adjust headings and font weights
      content = content.replace(/text-\[1\.8rem\]/g, 'text-[1.4rem]');
      content = content.replace(/text-\[1\.85rem\]/g, 'text-[1.4rem]');
      content = content.replace(/text-\[2\.1rem\]/g, 'text-[1.6rem]');
      content = content.replace(/text-\[1\.90rem\]/g, 'text-[1.5rem]');
      content = content.replace(/text-\[1\.60rem\]/g, 'text-[1.3rem]');
      content = content.replace(/text-2xl/g, 'text-xl');
      content = content.replace(/text-3xl/g, 'text-2xl');
      content = content.replace(/text-4xl/g, 'text-2xl');
      content = content.replace(/text-\[1\.5rem\]/g, 'text-[1.2rem]');
      content = content.replace(/text-\[1\.4rem\]/g, 'text-[1.15rem]');
      content = content.replace(/text-\[1\.35rem\]/g, 'text-[1.1rem]');
      content = content.replace(/text-\[1\.3rem\]/g, 'text-[1.1rem]');
      content = content.replace(/text-\[1\.25rem\]/g, 'text-[1.1rem]');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Downsized fonts.');
