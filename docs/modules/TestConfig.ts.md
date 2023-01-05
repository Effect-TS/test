---
title: TestConfig.ts
nav_order: 7
parent: Modules
---

## TestConfig overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
- [environment](#environment)
  - [Tag](#tag)
  - [defaultTestConfig](#defaulttestconfig)
  - [live](#live)
- [getters](#getters)
  - [repeats](#repeats)
  - [retries](#retries)
  - [samples](#samples)
  - [shrinks](#shrinks)
- [models](#models)
  - [TestConfig (interface)](#testconfig-interface)

---

# constructors

## make

Constructs a new `TestConfig`.

**Signature**

```ts
export declare const make: (params: {
  readonly repeats: number
  readonly retries: number
  readonly samples: number
  readonly shrinks: number
}) => TestConfig
```

Added in v1.0.0

# environment

## Tag

The `Context` tag for `TestConfig`.

**Signature**

```ts
export declare const Tag: Context.Tag<TestConfig>
```

Added in v1.0.0

## defaultTestConfig

The default `TestConfig`.

**Signature**

```ts
export declare const defaultTestConfig: Layer.Layer<never, never, TestConfig>
```

Added in v1.0.0

## live

Constructs a new `TestConfig` service with the specified settings.

**Signature**

```ts
export declare const live: (params: {
  readonly repeats: number
  readonly retries: number
  readonly samples: number
  readonly shrinks: number
}) => Layer.Layer<never, never, TestConfig>
```

Added in v1.0.0

# getters

## repeats

The number of times to repeat tests to ensure they are stable.

**Signature**

```ts
export declare const repeats: () => Effect.Effect<TestConfig, never, number>
```

Added in v1.0.0

## retries

The number of times to retry flaky tests.

**Signature**

```ts
export declare const retries: () => Effect.Effect<TestConfig, never, number>
```

Added in v1.0.0

## samples

The number of sufficient samples to check for a random variable.

**Signature**

```ts
export declare const samples: () => Effect.Effect<TestConfig, never, number>
```

Added in v1.0.0

## shrinks

The maximum number of shrinkings to minimize large failures.

**Signature**

```ts
export declare const shrinks: () => Effect.Effect<TestConfig, never, number>
```

Added in v1.0.0

# models

## TestConfig (interface)

The `TestConfig` service provides access to default configuration settings
used by tests, including the number of times to repeat tests to ensure
they are stable, the number of times to retry flaky tests, the sufficient
number of samples to check from a random variable, and the maximum number of
shrinkings to minimize large failures.

**Signature**

```ts
export interface TestConfig {
  /**
   * The number of times to repeat tests to ensure they are stable.
   */
  readonly repeats: number
  /**
   * The number of times to retry flaky tests.
   */
  readonly retries: number
  /**
   * The number of sufficient samples to check for a random variable.
   */
  readonly samples: number
  /**
   * The maximum number of shrinkings to minimize large failures
   */
  readonly shrinks: number
}
```

Added in v1.0.0
