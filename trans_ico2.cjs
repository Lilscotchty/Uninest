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

// tmp_icon_transformer2.cjs
var import_fs = __toESM(require("fs"));
var files = [
  "src/pages/Explore.tsx",
  "src/pages/Details.tsx",
  "src/pages/Home.tsx"
];
for (const file of files) {
  if (import_fs.default.existsSync(file)) {
    let content = import_fs.default.readFileSync(file, "utf8");
    content = content.replace(/<Heart size=\{16\} strokeWidth=\{2\.5\}( [^>]*) size=\{[^\}]+\}/g, "<Heart strokeWidth={2.5}$1");
    content = content.replace(/<Heart size=\{16\} strokeWidth=\{2\.5\} fill="none" color="currentColor"( [^>]*) size=\{[^\}]+\}/g, '<Heart strokeWidth={2.5} fill="none" color="currentColor"$1');
    content = content.replace(/<Heart size=\{16\} strokeWidth=\{2\}( [^>]*) size=\{[^\}]+\}/g, "<Heart strokeWidth={2}$1");
    content = content.replace(/<MessageCircle size=\{20\}( [^>]*) size=\{[^\}]+\}/g, "<MessageCircle $1");
    content = content.replace(/<Star size=\{12\}( [^>]*) size=\{[^\}]+\}/g, "<Star $1");
    content = content.replace(/<Star size=\{14\}( [^>]*) size=\{[^\}]+\}/g, "<Star $1");
    content = content.replace(/<MapPin size=\{16\}( [^>]*) size=\{[^\}]+\}/g, "<MapPin $1");
    content = content.replace(/FaWifi/g, "Wifi");
    content = content.replace(/FaSnowflake/g, "Snowflake");
    content = content.replace(/FaShieldAlt/g, "ShieldCheck");
    content = content.replace(/FaPlug/g, "PlugZap");
    content = content.replace(/FaBookOpen/g, "BookOpen");
    content = content.replace(/FaTint/g, "Droplet");
    content = content.replace(/FaUtensils/g, "Coffee");
    content = content.replace(/FaVrCardboard/g, "Video");
    import_fs.default.writeFileSync(file, content, "utf8");
  }
}
