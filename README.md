# @mittwald/password-tools-js

![Tests](https://github.com/mittwald/password-tools-js/workflows/Compilation%20&%20Unit%20Tests/badge.svg)

A JS library to implement policy-driven password validation and generation

## Installation

### Yarn
`yarn add @mittwald/password-tools-js`

### NPM
`npm install @mittwald/password-tools-js`

## Usage
### Validate Passwords

Example:

```
import { Policy } from "@mittwald/password-tools-js";

const policy = await Policy.fromDeclarationRemote("https://api.mittwald.de/v2/password/policies/", "examplePolicy");
const result = policy.validate("password#");
```

or

```
import { Policy, RemotePolicyLoader } from "@mittwald/password-tools-js";

const remotePolicyLoader = new RemotePolicyLoader("https://api.mittwald.de/v2/password/policies/");
const policyDeclaration = await remotePolicyLoader.loadPolicy("examplePolicy");
const policy = Policy.fromDeclaration(policyDeclaration);

const result = policy.validate("password#");
```

### Generate password/passphrase

from a policy:

```
const policy = await Policy.fromDeclarationRemote("https://api.mittwald.de/v2/password/policies/", "examplePolicy");
const generator = new Generator(policy);

const password = await generator.generatePassword();
const passphrase = await generator.generatePassphrase();
```

or without a policy:

```
const password = Generator.generateAnyPassword();
const passphrase = Generator.generateAnyPassphrase();
```

## CLI (Node)

```
❯ yarn password-tools-js
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
