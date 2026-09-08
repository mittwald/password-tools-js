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

### Complexity scoring

`zxcvbn-ts` moved to `4.x`. Scores shift, and passwords that previously met a
`minComplexity` threshold may now fall below it.

The cause is a bug this release fixes rather than a change in zxcvbn itself. In
`3.x` the English and German dictionaries used identical keys -- `commonWords`,
`firstnames`, `lastnames`, `wikipedia` -- so merging them discarded English
entirely: 150,284 entries were silently overwritten, and passwords were scored
against 138,434 words instead of roughly 288,000. `4.x` suffixes the keys per
language, so English is actually consulted now.

The classic example: `Tr0ub4dor&3` scored 4 before and scores 1 now, because
"troubadour" is an English word that was never being checked.

Expect scoring to be stricter, and expect it to be slower: a check costs
noticeably more now that it runs against twice as many words. If you generate
passwords from a restrictive policy, review the generator `timeout` -- the
default budget buys fewer attempts than it used to.

### CLI

- Parameter for policy path has been changed from `P` (upper) to `p` (lower)
- Parameter for passwords has been changed from `p` (lower) to `P` (upper)

---

---
