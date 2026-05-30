var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// tmp_details_transformer.cjs
var import_fs = __toESM(require("fs"));
var orig = import_fs.default.readFileSync("src/pages/Details.tsx", "utf8");
var dest = orig;
dest = dest.replace(
  /<div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar bg-slate-200 relative pb-\[70px\]">/g,
  `<div className="flex-1 w-full bg-slate-100 dark:bg-app-bg relative flex flex-col md:overflow-y-auto">
    <div className="w-full max-w-screen-2xl mx-auto px-0 md:px-6 lg:px-8 pb-[100px] md:pb-8 flex flex-col md:grid md:grid-cols-3 gap-0 md:gap-8 pt-0 md:pt-6">`
);
dest = dest.replace(
  /    <\/div>\n  \);\n\};\n/g,
  `      </div>
    </div>
  );
};
`
);
dest = dest.replace(
  /\{\/\* GALLERY \*\/\}\n      <div className="relative h-\[380px\] bg-black">/g,
  `{/* GALLERY */}
      <div className="relative h-[380px] md:h-[500px] bg-black md:col-span-3 md:rounded-2xl overflow-hidden shadow-sm">`
);
dest = dest.replace(
  /\{\/\* INFO CONTENT \*\/\}\n      <div className="-mt-\[32px\] relative z-20 bg-app-bg rounded-t-\[32px\] px-5 pt-8 pb-32">/g,
  `{/* INFO CONTENT */}
      <div className="-mt-[32px] md:mt-0 relative z-20 bg-app-bg rounded-t-[32px] md:rounded-2xl px-5 md:px-8 pt-8 md:col-span-2 shadow-sm border border-border-subtle pb-8">`
);
dest = dest.replace(
  /\{\/\* BOTTOM CTA \*\/\}\n      <div className="fixed bottom-0 left-0 w-full bg-card-bg\/90 backdrop-blur-md border-t border-border-subtle p-3\.5 px-5 flex justify-between items-center z-50">/g,
  `{/* BOTTOM CTA & DESKTOP SIDEBAR */}
      <div className="fixed md:sticky bottom-0 md:top-24 left-0 w-full md:w-auto bg-card-bg/90 md:bg-card-bg backdrop-blur-md border-t md:border border-border-subtle p-3.5 px-5 md:p-6 flex justify-between md:flex-col items-center z-50 md:col-span-1 md:rounded-2xl shadow-sm md:shadow-card md:h-fit gap-4">`
);
dest = dest.replace(
  /<div className="flex flex-col">\n          <span className="text-\[0.72rem\] text-text-muted font-semibold uppercase tracking-wider mb-0.5">\n            Starting from\n          <\/span>/g,
  `<div className="flex flex-col w-full text-center md:text-left">
          <span className="text-[0.72rem] text-text-muted font-semibold uppercase tracking-wider mb-0.5">
            Starting from
          </span>`
);
dest = dest.replace(
  /<button\n          onClick=\{handleBook\}\n          className="bg-indigo text-white font-bold text-\[0.85rem\] px-6 py-3\.5 rounded-\[14px\] shadow-\[0_4px_16px_rgba\(55,48,163,0\.3\)\] hover:bg-indigo\/90 active:scale-95 transition-all"\n        >/g,
  `<button
          onClick={handleBook}
          className="bg-indigo text-white font-bold text-[0.85rem] md:text-base px-6 py-3.5 rounded-[14px] shadow-[0_4px_16px_rgba(55,48,163,0.3)] hover:bg-indigo/90 active:scale-95 transition-all md:w-full"
        >`
);
import_fs.default.writeFileSync("src/pages/Details.tsx", dest, "utf8");
