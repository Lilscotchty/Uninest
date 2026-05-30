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

// tmp_signup_transformer.cjs
var import_fs = __toESM(require("fs"));
var orig = import_fs.default.readFileSync("src/pages/SignUp.tsx", "utf8");
var dest = orig;
dest = dest.replace(
  /<div className="w-full h-full bg-app-bg flex flex-col font-sans relative overflow-x-hidden hide-scrollbar">/g,
  `<div className="w-full min-h-screen bg-app-bg flex flex-col md:flex-row font-sans relative overflow-x-hidden hide-scrollbar">`
);
dest = dest.replace(
  /className="relative h-\[240px\] shrink-0 overflow-hidden transition-all duration-700 pb-8 px-6 pt-10"/g,
  `className="relative h-[240px] md:h-screen md:w-[45%] lg:w-1/2 shrink-0 overflow-hidden transition-all duration-700 pb-8 px-6 pt-10 md:pt-16 md:px-12 flex flex-col"`
);
dest = dest.replace(
  /<div className="flex-1 -mt-4 px-5 pb-20 relative z-20 flex flex-col overflow-y-auto hide-scrollbar">/g,
  `<div className="flex-1 -mt-4 md:mt-0 px-5 md:px-12 lg:px-20 py-8 md:py-16 md:justify-center relative z-20 flex flex-col overflow-y-auto hide-scrollbar md:h-screen bg-app-bg md:w-[55%] lg:w-1/2">
        <div className="w-full max-w-md mx-auto">`
);
dest = dest.replace(
  /        <AuthForm type=\{isLogin \? 'login' : 'signup'\} \/>\n      <\/div>/g,
  `        <AuthForm type={isLogin ? 'login' : 'signup'} />
        </div>
      </div>`
);
dest = dest.replace(
  /<div className="absolute -bottom-1 left-0 right-0 h-\[40px\] bg-app-bg rounded-t-full rounded-b-none scale-x-110"><\/div>/g,
  `<div className="md:hidden absolute -bottom-1 left-0 right-0 h-[40px] bg-app-bg rounded-t-full rounded-b-none scale-x-110"></div>`
);
dest = dest.replace(
  /<h1 className="font-fraunces text-white text-\[1\.4rem\] leading-\[1\.1\] font-bold">/g,
  `<h1 className="font-fraunces text-white text-[1.4rem] md:text-3xl lg:text-4xl leading-[1.1] font-bold md:mt-4">`
);
dest = dest.replace(
  /<div className="relative z-10 flex flex-col h-full">/g,
  `<div className="relative z-10 flex flex-col h-full justify-between md:justify-start gap-4">`
);
import_fs.default.writeFileSync("src/pages/SignUp.tsx", dest, "utf8");
