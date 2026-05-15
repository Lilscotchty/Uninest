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
      
      // Change font-sans back to font-fraunces in tags where it makes sense (e.g., h1, h2, h3, or text sizes > 1.1rem)
      // Actually, my previous downsize_fonts.cjs didn't touch font sizes where font-fraunces was present, wait.
      // Let's just restore font-fraunces to the headings in Home.tsx and Profile.tsx etc.
      content = content.replace(/className="font-sans text-\[1\.15rem\]/g, 'className="font-fraunces text-[1.15rem]');
      
      // Actually, looking at the initial grep output before removal:
      // Home had: <h2 className="font-fraunces text-[1.15rem] ..."> but now it has font-sans!
      // I will replace font-sans with font-fraunces for all h1, h2, h3 matching that class.
      content = content.replace(/<h1([^>]*?)font-sans([^>]*?)>/g, '<h1$1font-fraunces$2>');
      content = content.replace(/<h2([^>]*?)font-sans([^>]*?)>/g, '<h2$1font-fraunces$2>');
      content = content.replace(/<h3([^>]*?)font-sans([^>]*?)>/g, '<h3$1font-fraunces$2>');
      
      // I will also scale up font sizes that I previously scaled down in these specific areas:
      content = content.replace(/text-\[1\.4rem\]/g, 'text-[1.8rem]');
      content = content.replace(/text-\[1\.6rem\]/g, 'text-[2.1rem]');
      content = content.replace(/text-\[1\.5rem\]/g, 'text-[1.90rem]');
      content = content.replace(/text-\[1\.3rem\]/g, 'text-[1.60rem]');
      content = content.replace(/text-\[1\.15rem\]/g, 'text-[1.4rem]');
      
      // In Profile.tsx, I scaled text-2xl to text-xl
      content = content.replace(/<h1 className="font-fraunces text-xl/g, '<h1 className="font-fraunces text-2xl');
      content = content.replace(/<span className="font-fraunces text-2xl/g, '<span className="font-fraunces text-4xl');
      content = content.replace(/<div className="w-16 h-16 rounded-full bg-indigo\/10 flex items-center justify-center text-indigo font-fraunces font-bold text-xl/g, '<div className="w-16 h-16 rounded-full bg-indigo/10 flex items-center justify-center text-indigo font-fraunces font-bold text-2xl');
      
      // In Saved.tsx
      content = content.replace(/<h1 className="font-fraunces text-xl/g, '<h1 className="font-fraunces text-2xl');
      content = content.replace(/absolute bottom-3\.5 left-3\.5 bg-slate-900\/85 backdrop-blur-md text-white px-3\.5 py-2 rounded-2xl font-fraunces text-\[1\.1rem\]/g, 'absolute bottom-3.5 left-3.5 bg-slate-900/85 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl font-fraunces text-[1.25rem]');
      
      // In SignUp.tsx
      content = content.replace(/<h2 className="font-fraunces text-xl/g, '<h2 className="font-fraunces text-2xl');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Restored font-fraunces and upscale sizes.');
