# Migration Guide

## `2.x.x` to `3.0.0`

---

### Loaders

All loaders have been removed. Pass the Policy as YAML String or JSON.

```diff
- import { RemotePolicyLoader } from "@mittwald/password-tools-js/policy/loader";
import { Policy } from "@mittwald/password-tools-js/policy";

- const remotePolicyLoader = new RemotePolicyLoader("https://api.mittwald.de/v2/password/policies/");
- const policyDeclaration = await remotePolicyLoader.loadPolicy("examplePolicy");
+ const policyDeclaration = fetch("https://api.mittwald.de/v2/password/policies/examplePolicy.yaml");
const policy = Policy.fromDeclaration(policyDeclaration);

const result = policy.validate("password#");
```

### Policy

`fromDeclarationRemote` has been removed. Pass the Policy as YAML String or
JSON.

```diff
- const policy = await Policy.fromDeclarationRemote("https://api.mittwald.de/v2/password/policies/", "examplePolicy");
+ const policy = fetch("https://api.mittwald.de/v2/password/policies/examplePolicy.yaml");
```

`fromDeclaration` will now accept YAML strings, JSON or Policy Classes directly.

### CLI

- Parameter for policy path has been changed from `P` (upper) to `p` (lower)
- Parameter for passwords has been changed from `p` (lower) to `P` (upper)

---

---
