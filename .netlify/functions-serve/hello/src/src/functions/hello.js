var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/functions/hello.ts
var hello_exports = {};
__export(hello_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(hello_exports);

// src/functions/impl/hello.ts
var hello = (input) => {
  return `Hello, ${input}!`;
};

// src/functions/hello.ts
var handler = async (event) => {
  var _a;
  const input = ((_a = event.queryStringParameters) == null ? void 0 : _a.input) || "World";
  const result = hello(input);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: result })
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=hello.js.map
