---
title: TestContext.ts
nav_order: 9
parent: Modules
---

## TestContext overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [context](#context)
  - [TestContext](#testcontext)
  - [live](#live)
- [models](#models)
  - [TestContext (type alias)](#testcontext-type-alias)

---

# context

## TestContext

**Signature**

```ts
export declare const TestContext: Layer.Layer<never, never, any>
```

Added in v1.0.0

## live

**Signature**

```ts
export declare const live: Layer.Layer<DefaultServices.DefaultServices, never, any>
```

Added in v1.0.0

# models

## TestContext (type alias)

Represents the environment provided to tests.

**Signature**

```ts
export type TestContext = TS.TestServices
```

Added in v1.0.0
