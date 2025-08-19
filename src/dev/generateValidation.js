import fs from "fs";
import path from "path";
import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";
import policyDeclarationSchema from "../policy/schema.json" with { type: "json" };

const ajv = new Ajv({
  allowUnionTypes: true,
  schemas: [policyDeclarationSchema],
  code: { source: true, esm: true },
});
let moduleCode = standaloneCode(ajv, {
  ValidatePolicyDeclaration: "#/definitions/PolicyDeclaration",
});

fs.writeFileSync(path.join("./src/policy/validateSchema.mjs"), moduleCode);
