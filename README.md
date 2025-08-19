# mittwald/password-tools-js

[![Latest Release](https://img.shields.io/github/release/mittwald/password-tools-js.svg)](https://github.com/mittwald/password-tools-js/releases)
[![CI](https://github.com/mittwald/password-tools-js/actions/workflows/test.yml/badge.svg)](https://github.com/mittwald/password-tools-js/actions)
[![License: MIT](https://img.shields.io/github/license/mittwald/password-tools-js.svg)](LICENSE)

A tiny, fast JavaScript library for securely generating and validating passwords against shareable policy definitions.
---

## Features

- 🔐 **Security**: Cryptographic Secure password generation.
- 🛡️ **Password MetaData**: Password quality checks (length, dictionary, entropy, patterns).
- 📋 **Standardized Policies**: Definitions for generating and validating that are easy to share across platforms.
- 🚀 **Browser & Node**: Optimized for Node.js and browser environments.
- 🖥️ **CLI Support**: Use password-tools-js directly from your command line.

---

## Installation

```bash
pnpm i @mittwald/password-tools-js
# or
npm install @mittwald/password-tools-js
# or
yarn add @mittwald/password-tools-js
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

### Rule Configuration Options

### `length`
- `min` (number, optional): Minimum allowed length.
- `max` (number, optional): Maximum allowed length.

### `charPool`
- `charPools` (Array) `lowercase, uppercase, numbers, special, nonAscii`
- `min` (number, optional): Minimum required charPools.
- `max` (number, optional): Maximum required charPools. 

### `char`
- `char` (string): Chars that are used 
- `min` (number, optional): Minimum required charPools.
- `max` (number, optional): Maximum required charPools.

### `regex`
- `pattern` (string, required): Regular expression pattern to match.

### `blocklist`
- `file` (string, optional): Path to a blocklist file.
- `list` (string[], optional): Inline array of blocked passwords.

### `hibp`
- *(No configuration options)*

### `sequence`
- `minSequenceLength` (number, optional): Minimal sequential length to block.
- `forbidRepeats` (boolean, optional): Forbid repeating characters (e.g., "aaaa").

---

## CLI

```bash
password-tools-js <cmd> [options]                                                                                                                                                                                                                                                                                  ─╯

Commands:
  password-tools-js validate-policies        Validates all policies in the provided paths
  password-tools-js validate-passwords       Validates passwords against the provided policy
  password-tools-js generate-password        Generates a password from a policy
  password-tools-js generate-any-password    Generates any password
  password-tools-js generate-passphrase      Generates a passphrase from a policy
  password-tools-js generate-any-passphrase  Generates any passphrase

Examples:
  validate-policies        -P my/policies/ foo/anotherPolicyDir/
  validate-passwords       -P policies/examplePolicy.yaml -p myPassword anotherPw (optional: --booleanOnly; or -b)
  generate-password        -P policies/examplePolicy.yaml
  generate-any-password
  generate-passphrase      -P policies/examplePolicy.yaml
  generate-any-passphrase
```

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
