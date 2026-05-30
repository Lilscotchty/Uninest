import fs from 'fs';

const orig = fs.readFileSync('src/pages/SignUp.tsx', 'utf8');

let dest = orig;

dest = dest.replace(
  /<div className="w-full h-full bg-app-bg flex flex-col font-sans relative overflow-x-hidden hide-scrollbar">/g,
  `<div className="w-full min-h-screen bg-app-bg flex flex-col md:flex-row font-sans relative overflow-x-hidden hide-scrollbar">`
);

// Hero Header
dest = dest.replace(
  /className="relative h-\[240px\] shrink-0 overflow-hidden transition-all duration-700 pb-8 px-6 pt-10"/g,
  `className="relative h-[240px] md:h-screen md:w-[45%] lg:w-1/2 shrink-0 overflow-hidden transition-all duration-700 pb-8 px-6 pt-10 md:pt-16 md:px-12 flex flex-col"`
);

// Form column wrapper
dest = dest.replace(
  /<div className="flex-1 -mt-4 px-5 pb-20 relative z-20 flex flex-col overflow-y-auto hide-scrollbar">/g,
  `<div className="flex-1 -mt-4 md:mt-0 px-5 md:px-12 lg:px-20 py-8 md:py-16 md:justify-center relative z-20 flex flex-col overflow-y-auto hide-scrollbar md:h-screen bg-app-bg md:w-[55%] lg:w-1/2">
        <div className="w-full max-w-md mx-auto">`
);

// Close max-w-md
dest = dest.replace(
  /        <AuthForm type=\{isLogin \? 'login' : 'signup'\} \/>\n      <\/div>/g,
  `        <AuthForm type={isLogin ? 'login' : 'signup'} />\n        </div>\n      </div>`
);

// Curved bottom edge hidden on desktop
dest = dest.replace(
  /<div className="absolute -bottom-1 left-0 right-0 h-\[40px\] bg-app-bg rounded-t-full rounded-b-none scale-x-110"><\/div>/g,
  `<div className="md:hidden absolute -bottom-1 left-0 right-0 h-[40px] bg-app-bg rounded-t-full rounded-b-none scale-x-110"></div>`
);

// Make the text bigger on desktop
dest = dest.replace(
  /<h1 className="font-fraunces text-white text-\[1\.4rem\] leading-\[1\.1\] font-bold">/g,
  `<h1 className="font-fraunces text-white text-[1.4rem] md:text-3xl lg:text-4xl leading-[1.1] font-bold md:mt-4">`
);

// Move the text container inside a flex-col
dest = dest.replace(
  /<div className="relative z-10 flex flex-col h-full">/g,
  `<div className="relative z-10 flex flex-col h-full justify-between md:justify-start gap-4">`
);

fs.writeFileSync('src/pages/SignUp.tsx', dest, 'utf8');
