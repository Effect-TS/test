---
title: TestEnvironment.ts
nav_order: 7
parent: Modules
---

## TestEnvironment overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [environment](#environment)
  - [TestEnvironment](#testenvironment)
  - [live](#live)
- [models](#models)
  - [TestEnvironment (type alias)](#testenvironment-type-alias)

---

# environment

## TestEnvironment

**Signature**

```ts
export declare const TestEnvironment: Layer.Layer<never, never, any>
```

Added in v1.0.0

## live

**Signature**

```ts
export declare const live: Layer.Layer<DefaultServices.DefaultServices, never, any>
```

Added in v1.0.0

# models

## TestEnvironment (type alias)

Represents the environment provided to tests.

**Signature**

```ts
export type TestEnvironment = Annotations.Annotations | Live.Live | TestConfig.TestConfig
```

Added in v1.0.0
