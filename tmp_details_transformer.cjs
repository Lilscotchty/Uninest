import fs from 'fs';

const orig = fs.readFileSync('src/pages/Details.tsx', 'utf8');

let dest = orig;

// Make the root div wrapper generic and use PageContainer
dest = dest.replace(
  /<div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar bg-slate-200 relative pb-\[70px\]">/g,
  `<div className="flex-1 w-full bg-slate-100 dark:bg-app-bg relative flex flex-col md:overflow-y-auto">\n    <div className="w-full max-w-screen-2xl mx-auto px-0 md:px-6 lg:px-8 pb-[100px] md:pb-8 flex flex-col md:grid md:grid-cols-3 gap-0 md:gap-8 pt-0 md:pt-6">`
);

// End tags for root div ... wait it's just one root </div> at the end. We'll close the max-w container before the root div.
dest = dest.replace(
  /    <\/div>\n  \);\n\};\n/g,
  `      </div>\n    </div>\n  );\n};\n`
);

// We need to group Left 65% and Right 35%. 
// The gallery is full width on mobile, and spans all cols on desktop?
// Actually if top is full width gallery on desktop:
// It's easier if we just put standard responsive classes on the sections.

// GALLERY
dest = dest.replace(
  /\{\/\* GALLERY \*\/\}\n      <div className="relative h-\[380px\] bg-black">/g,
  `{/* GALLERY */}\n      <div className="relative h-[380px] md:h-[500px] bg-black md:col-span-3 md:rounded-2xl overflow-hidden shadow-sm">`
);

// INFO CONTENT
dest = dest.replace(
  /\{\/\* INFO CONTENT \*\/\}\n      <div className="-mt-\[32px\] relative z-20 bg-app-bg rounded-t-\[32px\] px-5 pt-8 pb-32">/g,
  `{/* INFO CONTENT */}\n      <div className="-mt-[32px] md:mt-0 relative z-20 bg-app-bg rounded-t-[32px] md:rounded-2xl px-5 md:px-8 pt-8 md:col-span-2 shadow-sm border border-border-subtle pb-8">`
);

// Right side sticky panel inside grid. The bottom CTA bar on mobile can become the sticky panel on desktop!
// Where is the bottom CTA defined?
//      {/* BOTTOM CTA */}
//      <div className="fixed bottom-0 left-0 w-full bg-card-bg/90 backdrop-blur-md border-t border-border-subtle p-3.5 px-5 flex justify-between items-center z-50">

dest = dest.replace(
  /\{\/\* BOTTOM CTA \*\/\}\n      <div className="fixed bottom-0 left-0 w-full bg-card-bg\/90 backdrop-blur-md border-t border-border-subtle p-3\.5 px-5 flex justify-between items-center z-50">/g,
  `{/* BOTTOM CTA & DESKTOP SIDEBAR */}\n      <div className="fixed md:sticky bottom-0 md:top-24 left-0 w-full md:w-auto bg-card-bg/90 md:bg-card-bg backdrop-blur-md border-t md:border border-border-subtle p-3.5 px-5 md:p-6 flex justify-between md:flex-col items-center z-50 md:col-span-1 md:rounded-2xl shadow-sm md:shadow-card md:h-fit gap-4">`
);

// Adjust the price inside the BOTTOM CTA so it looks better on desktop
dest = dest.replace(
  /<div className="flex flex-col">\n          <span className="text-\[0.72rem\] text-text-muted font-semibold uppercase tracking-wider mb-0.5">\n            Starting from\n          <\/span>/g,
  `<div className="flex flex-col w-full text-center md:text-left">\n          <span className="text-[0.72rem] text-text-muted font-semibold uppercase tracking-wider mb-0.5">\n            Starting from\n          </span>`
);

dest = dest.replace(
  /<button\n          onClick=\{handleBook\}\n          className="bg-indigo text-white font-bold text-\[0.85rem\] px-6 py-3\.5 rounded-\[14px\] shadow-\[0_4px_16px_rgba\(55,48,163,0\.3\)\] hover:bg-indigo\/90 active:scale-95 transition-all"\n        >/g,
  `<button\n          onClick={handleBook}\n          className="bg-indigo text-white font-bold text-[0.85rem] md:text-base px-6 py-3.5 rounded-[14px] shadow-[0_4px_16px_rgba(55,48,163,0.3)] hover:bg-indigo/90 active:scale-95 transition-all md:w-full"\n        >`
);

fs.writeFileSync('src/pages/Details.tsx', dest, 'utf8');
