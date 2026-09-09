# mittwald/password-tools-js

[![npm](https://img.shields.io/npm/v/@mittwald/password-tools-js.svg)](https://www.npmjs.com/package/@mittwald/password-tools-js)
[![Latest Release](https://img.shields.io/github/release/mittwald/password-tools-js.svg)](https://github.com/mittwald/password-tools-js/releases)
[![CI](https://github.com/mittwald/password-tools-js/actions/workflows/test.yml/badge.svg)](https://github.com/mittwald/password-tools-js/actions)
[![License: MIT](https://img.shields.io/github/license/mittwald/password-tools-js.svg)](LICENSE)

A tiny, fast JavaScript/TypeScript library for securely **generating** and
**validating** passwords against **shareable policy definitions**.

Write a policy once — as YAML or JSON — and use the exact same document in your
backend, your frontend and your CI.

## Features

- 🔐 **Cryptographically secure** password and passphrase generation, backed by
  the Web Crypto API.
- 📋 **Shareable policies** — a policy is plain YAML or JSON, easy to version,
  distribute and reuse across platforms.
- 🛡️ **Rich validation** — length, character pools, single characters, regular
  expressions, blocklists, predictable sequences and Have I Been Pwned.
- 📊 **Complexity scoring** via [zxcvbn-ts](https://zxcvbn-ts.github.io/zxcvbn/)
  with English and German dictionaries.
- 🚀 **Browser & Node.js**, shipped as ESM and CJS with full type declarations.
- 🖥️ **CLI** for generating passwords and linting policy files in CI.

---

## Installation

```bash
pnpm add @mittwald/password-tools-js
```

```bash
npm install @mittwald/password-tools-js
```

```bash
yarn add @mittwald/password-tools-js
```

Coming from v2? See the [migration guide](MIGRATION.md) — loaders were removed
and the CLI flags for policy and password changed places.

### Entry points

The package has **no root export**. Import from one of the three subpaths:

| Import path                             | Exports                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `@mittwald/password-tools-js/policy`    | `Policy`, `IS_POLICY_SYMBOL` + policy types                               |
| `@mittwald/password-tools-js/rules`     | `RuleType`, `SequenceType`, `RegexFlags`, `Rule` + rule declaration types |
| `@mittwald/password-tools-js/generator` | `Generator` + generator types                                             |
| `@mittwald/password-tools-js/errors`    | The error classes the library throws                                      |

---

## Quick start

```typescript
import { Policy } from "@mittwald/password-tools-js/policy";
import { RuleType } from "@mittwald/password-tools-js/rules";
import { Generator } from "@mittwald/password-tools-js/generator";

const policy = Policy.fromDeclaration({
  minComplexity: 3,
  rules: [
    { ruleType: RuleType.length, min: 16 },
    { ruleType: RuleType.charPool, charPools: ["special"], min: 1 },
    { ruleType: RuleType.sequence, sequences: ["repeat", "keyboard"] },
  ],
});

// Generate values that satisfy the policy
const generator = new Generator(policy, { timeout: 20 });

const password = await generator.generatePassword(); // qOhuzgb(EM9p7][S
const passphrase = await generator.generatePassphrase(); // existing-handlebar-murkiness#

// Validate against the policy
const result = await policy.validate(password);

console.log(result.isValid); // true
```

---

## Policies

### Creating a policy

`Policy.fromDeclaration()` accepts a declaration object, a YAML string or an
existing `Policy` instance — which makes it safe to call on user input of
unknown shape:

```typescript
// From an object
const a = Policy.fromDeclaration({ rules: [{ ruleType: "length", min: 12 }] });

// From a YAML string — e.g. fetched from a remote policy service
const yaml = await fetch("https://example.com/policies/default.yaml").then(
  (r) => r.text(),
);
const b = Policy.fromDeclaration(yaml);

// From an existing Policy — returned unchanged
const c = Policy.fromDeclaration(a);
```

The declaration is validated against a generated JSON schema. An invalid
declaration throws instead of silently producing a weaker policy.

The same policy as YAML:

```yaml
minComplexity: 3
rules:
  - ruleType: length
    min: 16

  - ruleType: charPool
    charPools:
      - special
    min: 1

  - ruleType: sequence
    sequences:
      - repeat
      - keyboard
```

### Policy API

| Member                                | Description                                                 |
| ------------------------------------- | ----------------------------------------------------------- |
| `Policy.fromDeclaration(decl?)`       | Builds a policy from an object, YAML string or `Policy`.    |
| `Policy.isPolicy(data)`               | Type guard, works across realms via a well-known symbol.    |
| `Policy.assertValidDeclaration(data)` | Validates a declaration; throws on the first schema error.  |
| `policy.validate(pw?)`                | Validates a password. Returns a `PolicyValidationResult`.   |
| `policy.toDeclaration()`              | Serialises the policy back into a plain declaration object. |
| `policy.rules`                        | The instantiated `Rule` objects.                            |
| `policy.minComplexity`                | The configured complexity threshold.                        |

### `minComplexity`

A zxcvbn score from `0` (weakest) to `4` (strongest), default `0`. The password
must score **at or above** this value in addition to passing every rule.

### Validation result

```typescript
const result = await policy.validate("aaa");
```

```typescript
{
  isValid: false,
  ruleResults: [
    { ruleType: "length",   isValid: false, failingBoundary: "min", length: 3, min: 16 },
    { ruleType: "charPool", isValid: false, failingBoundary: "min", totalOccurrences: 0, min: 1, charPools: [...] },
    { ruleType: "sequence", isValid: true,  sequences: [...], maxLength: 3 },
  ],
  complexity: { min: 3, actual: 0, warning: "namesByThemselves" },
}
```

Every entry in `ruleResults` carries `isValid`, the rule's own configuration and
rule-specific context (occurrence counts, found sequences, …). For rules with
`min`/`max` bounds, `failingBoundary` names which side was violated — `"min"` or
`"max"` — so a UI can render a precise message.

`complexity.warning` is the zxcvbn feedback key for the weakness that was found,
or `null` when there is nothing to report. It is a translation key rather than a
finished sentence, so you can map it onto your own copy.

---

## Rule types

| RuleType    | Description                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------- |
| `length`    | Require a minimum, maximum or exact password length.                                          |
| `charPool`  | Require or forbid characters from groups (lowercase, uppercase, numbers, special, non-ASCII). |
| `char`      | Require or forbid specific characters (e.g. must contain `@`).                                |
| `regex`     | Enforce custom patterns using regular expressions.                                            |
| `blocklist` | Reject passwords that match — or contain — entries from a blocklist.                          |
| `hibp`      | Reject passwords found in the "Have I Been Pwned" leaked-credential database.                 |
| `sequence`  | Reject predictable sequences such as `123456`, `qwerty` or `aaaa`.                            |

Every rule declaration additionally accepts an optional **`identifier`**
(`string`) to tell multiple instances of the same rule type apart. It is passed
through to the rule result, which is handy for mapping failures to your own
error messages.

### `length`

| Option | Type     | Required | Default | Description                         |
| ------ | -------- | -------- | ------- | ----------------------------------- |
| `min`  | `number` | no       | –       | Minimum allowed length (inclusive). |
| `max`  | `number` | no       | –       | Maximum allowed length (inclusive). |

### `charPool`

Counts **all characters** belonging to the selected pools and checks that total
against `min`/`max`.

| Option      | Type         | Required | Default                                 | Description                                                        |
| ----------- | ------------ | -------- | --------------------------------------- | ------------------------------------------------------------------ |
| `charPools` | `CharPool[]` | **yes**  | –                                       | `lowercase`, `uppercase`, `numbers`, `special`, `nonAscii`.        |
| `min`       | `number`     | no       | `1` when neither `min` nor `max` is set | Minimum total occurrences.                                         |
| `max`       | `number`     | no       | –                                       | Maximum total occurrences. Use `max: 0` to forbid a pool entirely. |

### `char`

| Option  | Type     | Required | Default                                 | Description                                             |
| ------- | -------- | -------- | --------------------------------------- | ------------------------------------------------------- |
| `chars` | `string` | **yes**  | –                                       | The characters to count, as one string (e.g. `"#!"`).   |
| `min`   | `number` | no       | `1` when neither `min` nor `max` is set | Minimum total occurrences.                              |
| `max`   | `number` | no       | –                                       | Maximum total occurrences. Use `max: 0` to forbid them. |

### `regex`

| Option           | Type       | Required | Default                                 | Description                                                    |
| ---------------- | ---------- | -------- | --------------------------------------- | -------------------------------------------------------------- |
| `pattern`        | `string`   | **yes**  | –                                       | Pattern used to construct the `RegExp`.                        |
| `flags`          | `string[]` | no       | –                                       | Flags as an array, e.g. `["i", "u"]`. See `RegexFlags`.        |
| `translationKey` | `string`   | no       | –                                       | i18n key, passed through to the rule result.                   |
| `min`            | `number`   | no       | `1` when neither `min` nor `max` is set | Minimum number of matches.                                     |
| `max`            | `number`   | no       | –                                       | Maximum number of matches. Use `max: 0` to forbid the pattern. |

### `blocklist`

| Option           | Type       | Required | Default | Description                                                                         |
| ---------------- | ---------- | -------- | ------- | ----------------------------------------------------------------------------------- |
| `blocklist`      | `string[]` | **yes**  | –       | Disallowed strings. Matching is case-insensitive.                                   |
| `substringMatch` | `boolean`  | **yes**  | –       | `true` rejects passwords _containing_ an entry; `false` only rejects exact matches. |

### `hibp`

Queries the
[Have I Been Pwned](https://haveibeenpwned.com/API/v3#PwnedPasswords) range API
using k-anonymity: only the first five characters of the password's SHA-1 hash
leave the process — never the password itself.

| Option               | Type      | Required | Default                                             | Description                                                                                           |
| -------------------- | --------- | -------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `endpointUrl`        | `string`  | no       | `https://api.pwnedpasswords.com/range/{hashPrefix}` | Custom endpoint. `{hashPrefix}` is replaced with the hash prefix.                                     |
| `willSucceedOnError` | `boolean` | no       | `false`                                             | When the API is unreachable, the rule **fails** by default. Set to `true` to treat outages as a pass. |

> **Note:** this rule performs a network request with a 5 second timeout. Leave
> it out of policies you validate in offline environments, or set
> `willSucceedOnError: true`.

### `sequence`

| Option      | Type             | Required | Default | Description                                                                       |
| ----------- | ---------------- | -------- | ------- | --------------------------------------------------------------------------------- |
| `sequences` | `SequenceType[]` | **yes**  | –       | `repeat` (`aaaa`), `keyboard` (`qwerty`), `number` (`1234`), `alphabet` (`abcd`). |
| `maxLength` | `number`         | no       | `3`     | Longest sequence still accepted.                                                  |

---

## Generator

The generator derives its parameters from the policy — length from `length`
rules, required and forbidden characters from `char` and `charPool` rules,
blocklisted words from `blocklist` rules — then generates candidates and
validates each one against the full policy until one passes.

```typescript
const generator = new Generator(policy, { timeout: 20 });

await generator.generatePassword(); // policy-compliant random password
await generator.generatePassphrase(); // policy-compliant passphrase
```

| Member                                 | Description                                                    |
| -------------------------------------- | -------------------------------------------------------------- |
| `new Generator(policyData?, options?)` | `policyData` accepts anything `Policy.fromDeclaration()` does. |
| `generator.generatePassword()`         | Random character password satisfying the policy.               |
| `generator.generatePassphrase()`       | Word-based passphrase satisfying the policy.                   |
| `Generator.generateAnyPassword()`      | _Static._ 16-character password, no policy involved.           |
| `Generator.generateAnyPassphrase()`    | _Static._ Three-word passphrase, no policy involved.           |

### Options

| Option    | Type     | Default | Description                                                         |
| --------- | -------- | ------- | ------------------------------------------------------------------- |
| `timeout` | `number` | `30`    | Seconds to keep retrying before throwing `PasswordGenerationError`. |

If no length is declared, the generator falls back to 16 characters — or 20 when
`minComplexity` is `4`. A contradictory policy (say, "at least one special
character" combined with "no special characters") cannot be satisfied; the
generator gives up after `timeout` and throws a `PasswordGenerationError` that
carries the policy and the rejected candidates for debugging.

---

## CLI

The package ships a `password-tools-js` binary.

```bash
npx @mittwald/password-tools-js generate-any-password
```

| Command                   | Description                                          |
| ------------------------- | ---------------------------------------------------- |
| `validate-policies`       | Validate every policy file in the given directories. |
| `validate-passwords`      | Validate passwords against a policy.                 |
| `generate-password`       | Generate a password from a policy.                   |
| `generate-passphrase`     | Generate a passphrase from a policy.                 |
| `generate-any-password`   | Generate a password without a policy.                |
| `generate-any-passphrase` | Generate a passphrase without a policy.              |

### Options

| Option            | Commands                                | Description                                                                    |
| ----------------- | --------------------------------------- | ------------------------------------------------------------------------------ |
| `-p`, `--path`    | all policy-based commands               | Path to the policy file — or, for `validate-policies`, the policy directories. |
| `-P`, `--pw`      | `validate-passwords`                    | One or more passwords to check.                                                |
| `-t`, `--timeout` | the `generate-*` commands with a policy | Generator timeout in seconds (default `25`).                                   |
| `-v`, `--verbose` | global                                  | Print the full validation result / parse error.                                |
| `-s`, `--silent`  | global                                  | Suppress spinners and status output.                                           |
| `--help`          | global                                  | Show help for the CLI or a single command.                                     |
| `--version`       | global                                  | Print the installed version.                                                   |

### Examples

Lint all policy files in CI — exits non-zero if any file fails to parse:

```bash
password-tools-js validate-policies -p ./policies ./more-policies
```

Check passwords against a policy — exits non-zero if any password is rejected:

```bash
password-tools-js validate-passwords -p ./policies/default.yaml -P 'first-password' 'second-password'
```

Generate a password from a policy, waiting up to 60 seconds:

```bash
password-tools-js generate-password -p ./policies/default.yaml -t 60
```

Print just the password, with no spinner — useful in scripts:

```bash
password-tools-js generate-passphrase -p ./policies/default.yaml -s
```

---

## Errors

All error classes are exported from `@mittwald/password-tools-js/errors` and
carry stable `name` properties:

| `error.name`                   | Thrown when                                                 | Extra properties                         |
| ------------------------------ | ----------------------------------------------------------- | ---------------------------------------- |
| `PolicyParseError`             | A declaration could not be parsed into a policy.            | –                                        |
| `PasswordGenerationError`      | No compliant password was found before the timeout elapsed. | `policy`, `timeout`, `rejectedPasswords` |
| `CryptographicInsecurityError` | No cryptographically secure random source is available.     | –                                        |

```typescript
import { PasswordGenerationError } from "@mittwald/password-tools-js/errors";

try {
  await generator.generatePassword();
} catch (error) {
  if (error instanceof PasswordGenerationError) {
    // the policy may contradict itself
    console.error(error.timeout, error.rejectedPasswords);
  }
}
```

---

## Requirements

- The library needs the **Web Crypto API** (`globalThis.crypto`). It is
  available in every modern browser and in Node.js 19+. Generation aborts with a
  `CryptographicInsecurityError` rather than falling back to `Math.random()`.
- The package declares `engines.node: ">=21"`, matching the CLI build target. CI
  runs the test suite on Node.js 24.

---

## Development

```bash
pnpm install
```

| Script        | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| `pnpm build`  | Regenerate the JSON schema and validator, then build lib and CLI. |
| `pnpm test`   | Run ESLint and the Vitest suite.                                  |
| `pnpm format` | Format the codebase with Prettier.                                |

The policy JSON schema in `src/policy/schema.json` and the AJV validator are
**generated** from the TypeScript types in `src/policy/types.ts` — change the
types, then run `pnpm build`, rather than editing the generated files.

---

## Security

If you discover a security issue, please see [`SECURITY.md`](SECURITY.md) for
responsible disclosure guidelines. Please do not open a public issue for
vulnerabilities.

---

## License

This library is Open Source and distributed under the [MIT license](LICENSE).

---

## Links

- [mittwald/password-tools-js on GitHub](https://github.com/mittwald/password-tools-js)
- [Package on npm](https://www.npmjs.com/package/@mittwald/password-tools-js)
- [Migration guide (2.x → 3.0)](MIGRATION.md)
