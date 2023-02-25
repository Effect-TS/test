---
title: Live.ts
nav_order: 2
parent: Modules
---

## Live overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [context](#context)
  - [defaultLive](#defaultlive)
- [models](#models)
  - [Live (interface)](#live-interface)
- [symbols](#symbols)
  - [LiveTypeId](#livetypeid)
  - [LiveTypeId (type alias)](#livetypeid-type-alias)
- [utils](#utils)
  - [live](#live)
  - [provideLive](#providelive)
  - [withLive](#withlive)
  - [withLiveScoped](#withlivescoped)

---

# context

## defaultLive

Constructs a new `Live` service that implements the `Live` interface. This
typically should not be necessary as the `TestEnvironment` already includes
the `Live` service but could be useful if you are mixing in interfaces to
create your own environment type.

**Signature**

```ts
export declare const defaultLive: Layer.Layer<never, never, Live>
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
  readonly [LiveTypeId]: LiveTypeId
  provide<R, E, A>(effect: Effect.Effect<R, E, A>): Effect.Effect<R, E, A>
}
```

Added in v1.0.0

# symbols

## LiveTypeId

**Signature**

```ts
export declare const LiveTypeId: typeof LiveTypeId
```

Added in v1.0.0

## LiveTypeId (type alias)

**Signature**

```ts
export type LiveTypeId = typeof LiveTypeId
```

Added in v1.0.0

# utils

## live

Constructs a new `Live` service wrapped in a layer.

**Signature**

```ts
export declare const live: () => Layer.Layer<DefaultServices.DefaultServices, never, Live>
```

Added in v1.0.0

## provideLive

Provides a workflow with the "live" default Effect services.

**Signature**

```ts
export declare const provideLive: <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<Live | R, E, A>
```

Added in v1.0.0

## withLive

Runs a transformation function with the live default Effect services while
ensuring that the workflow itself is run with the test services.

**Signature**

```ts
export declare const withLive: {
  (live: Live): <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>
  <R, E, A>(effect: Effect.Effect<R, E, A>, live: Live): Effect.Effect<R, E, A>
}
```

Added in v1.0.0

## withLiveScoped

Sets the implementation of the live service to the specified value and
restores it to its original value when the scope is closed.

**Signature**

```ts
export declare const withLiveScoped: (live: Live) => Effect.Effect<Scope.Scope, never, void>
```

Added in v1.0.0
