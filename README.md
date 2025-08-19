# mittwald/password-tools-js

[![Latest Release](https://img.shields.io/github/release/mittwald/password-tools-js.svg)](https://github.com/mittwald/password-tools-js/releases)
[![CI](https://github.com/mittwald/password-tools-js/actions/workflows/test.yml/badge.svg)](https://github.com/mittwald/password-tools-js/actions)
[![License: MIT](https://img.shields.io/github/license/mittwald/password-tools-js.svg)](LICENSE)

A tiny, fast JavaScript library for securely generating and validating passwords against shareable policy definitions.
---

## Features

- 🔐 **Security**: Cryptographic Secure password generation.
- 🛡️ **Password MetaData**: Password quality checks (length, dictionary, entropy, patterns).
- 📋 **Standardized Policies**: Define password quality rules that are standardize and easy to share across platforms for validation.
- 🚀 **Browser & Node**: Optimized for Node.js and browser environments.
- 🖥️ **CLI Support**: Use password-tools directly from your command line.

---

## Installation

```bash
pnpm i @mittwald/password-tools
# or
npm install @mittwald/password-tools
# or
yarn add @mittwald/password-tools
```

---

## Usage

```typescript
import { Policy } from "@mittwald/password-tools-js/policy";
import { RuleType } from "@mittwald/password-tools-js/rules";
import { Generator } from "@mittwald/password-tools-js/generator";

const policy = Policy.fromDeclaration({
  minComplexity: 4,
  rules: [
    {
      ruleType: RuleType.length,
      min: 16,
    },
    {
      ruleType: RuleType.charPool,
      charPools: ["special"],
    },
    {
      ruleType: RuleType.hibp,
    },
  ],
});

// create generator from a given policy
const generator = new Generator(policy, {
  timeout: 20,
});

// generates password
const strongPassword = await generator.generatePassword(); // n_.YvTx{'HG^E)7C;Flw

// validate against given policy
const result = await policy.validate(
    strongPassword
);
console.log(result.isValid); // true since the password fullfiles the given policy
```
---

## CLI

### Generate Passwords
```bash
node ./bin/cli.js generate-password -p "example/policy.yaml"
```

### Validate Passwords
```bash
node ./bin/cli.js validate-passwords -p "example/policy.yaml" -P "P4ssw0rd†!"
```

---

## Rule Types

Password guidelines in `password-tools-js` use a variety of rule types to enforce password quality.  
Each rule type targets a specific aspect of password validation:

| RuleType   | Description                                                                                      |
|------------|--------------------------------------------------------------------------------------------------|
| `length`   | Require a minimum, maximum, or exact password length.                                            |
| `charPool` | Restrict or require groups of characters (e.g., numbers, symbols, uppercase, lowercase).         |
| `char`     | Require or forbid specific characters or patterns (e.g., must contain `@`).                      |
| `regex`    | Enforce custom patterns using regular expressions.                                               |
| `blocklist`| Forbid the use of passwords from a supplied blocklist of common or weak passwords.               |
| `hibp`     | Forbid passwords found in the "Have I Been Pwned" leaked credentials database.                   |
| `sequence` | Prevent use of sequential or repeated character patterns (like `123456` or `aaaaaa`).            |

---

## Security

If you discover any security issues, please see [`SECURITY.md`](SECURITY.md) for responsible disclosure guidelines.

---

## License

This library is Open Source and distributed under the [MIT license](LICENSE).

---

## Links

- [mittwald/password-tools-js on GitHub](https://github.com/mittwald/password-tools-js)

---
