---
title: Live.ts
nav_order: 2
parent: Modules
---

## Live overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [environment](#environment)
  - [defaultLive](#defaultlive)
- [models](#models)
  - [Live (interface)](#live-interface)
- [utils](#utils)
  - [live](#live)
  - [withLive](#withlive)

---

# environment

## defaultLive

Constructs a new `Live` service that implements the `Live` interface. This
typically should not be necessary as the `TestEnvironment` already includes
the `Live` service but could be useful if you are mixing in interfaces to
create your own environment type.

**Signature**

```ts
export declare const defaultLive: Layer.Layer<never, never, internal.Live>
```

Added in v1.0.0

# models

## Live (interface)

The `Live` trait provides access to the "live" default Effect services from
within tests for workflows such as printing test results to the console or
timing out tests where it is necessary to access the real implementations of
these services.

**Signature**

```ts
export interface Live {
  /**
   * Provides the specified `effect` with the "live" default Effect services.
   *
   * @macro traced
   */
  provide<R, E, A>(effect: Effect.Effect<R, E, A>): Effect.Effect<R, E, A>
}
```

Added in v1.0.0

# utils

## live

Provides the specified `effect` with the "live" default Effect services.

**Signature**

```ts
export declare const live: <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<Live | R, E, A>
```

Added in v1.0.0

## withLive

Runs a transformation function with the live default Effect services while
ensuring that the workflow itself is run with the test services.

**Signature**

```ts
export declare const withLive: <R, E, A, R2, E2, A2>(
  f: (effect: Effect.Effect<R, E, A>) => Effect.Effect<R2, E2, A2>
) => (effect: Effect.Effect<R, E, A>) => Effect.Effect<Live | R | R2, E | E2, A2>
```

Added in v1.0.0
