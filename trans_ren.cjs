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

// tmp_rename_transformer.cjs
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
function walk(dir) {
  let results = [];
  const list = import_fs.default.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = import_path.default.join(dir, file);
    const stat = import_fs.default.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!["node_modules", ".git", "dist"].includes(file)) {
        results = results.concat(walk(fullPath));
      }
    } else {
      const ext = import_path.default.extname(file);
      if ([".ts", ".tsx", ".json", ".html", ".css", ".md"].includes(ext)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}
var files = [...walk("src"), "index.html", "package.json"];
if (import_fs.default.existsSync("vercel.json")) files.push("vercel.json");
if (import_fs.default.existsSync("metadata.json")) files.push("metadata.json");
if (import_fs.default.existsSync(".env.example")) files.push(".env.example");
if (import_fs.default.existsSync("README.md")) files.push("README.md");
for (const file of files) {
  let content = import_fs.default.readFileSync(file, "utf8");
  content = content.replace(/Uninest/g, "SKYCOBE");
  content = content.replace(/uninest/g, "skycobe");
  content = content.replace(/UNINEST/g, "SKYCOBE");
  content = content.replace(/UniNest/g, "SkyCobe");
  content = content.replace(/hostels/g, "properties");
  content = content.replace(/Hostels/g, "Properties");
  content = content.replace(/HOSTELS/g, "PROPERTIES");
  content = content.replace(/hostel/g, "property");
  content = content.replace(/Hostel/g, "Property");
  content = content.replace(/HOSTEL/g, "PROPERTY");
  import_fs.default.writeFileSync(file, content, "utf8");
}
