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

// tmp_rename3.cjs
var import_fs = __toESM(require("fs"));
var file = "src/pages/Details.tsx";
var content = import_fs.default.readFileSync(file, "utf8");
content = content.replace(/Private Single Room/g, "Private Single Suite");
content = content.replace(/Shared Double Room/g, "Shared Double Unit");
content = content.replace(/Shared Quad Room/g, "Shared Quad Unit");
content = content.replace(/4 rooms left/g, "4 units left");
content = content.replace(/2 rooms left/g, "2 units left");
content = content.replace(/6 rooms left/g, "6 units left");
content = content.replace(/in a room \/ sem/g, "in a unit / sem");
content = content.replace(/Single Room –/g, "Single Unit \u2013");
content = content.replace(/Double Room –/g, "Double Unit \u2013");
content = content.replace(/Quad Room –/g, "Quad Unit \u2013");
import_fs.default.writeFileSync(file, content, "utf8");
