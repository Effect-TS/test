---
title: Annotations.ts
nav_order: 1
parent: Modules
---

## Annotations overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [environment](#environment)
  - [Tag](#tag)
  - [live](#live)
- [getters](#getters)
  - [get](#get)
- [models](#models)
  - [Annotations (interface)](#annotations-interface)
- [refinements](#refinements)
  - [isAnnotations](#isannotations)
- [symbols](#symbols)
  - [AnnotationsTypeId](#annotationstypeid)
  - [AnnotationsTypeId (type alias)](#annotationstypeid-type-alias)
- [utils](#utils)
  - [annotate](#annotate)
  - [supervisedFibers](#supervisedfibers)

---

# environment

## Tag

The `Context` tag for `Annotations`.

**Signature**

```ts
export declare const Tag: Context.Tag<Annotations>
```

Added in v1.0.0

## live

A `Layer` containing an instance of `Annotations`.

**Signature**

```ts
export declare const live: Layer.Layer<never, never, Annotations>
```

Added in v1.0.0

# getters

## get

Accesses an `Annotations` instance in the environment and retrieves the
annotation of the specified type, or its default value if there is none.

**Signature**

```ts
export declare const get: <A>(key: TestAnnotation.TestAnnotation<A>) => Effect.Effect<Annotations, never, A>
```

Added in v1.0.0

# models

## Annotations (interface)

The `Annotations` trait provides access to an annotation map that tests can
add arbitrary annotations to. Each annotation consists of a string
identifier, an initial value, and a function for combining two values.
Annotations form monoids and you can think of `Annotations` as a more
structured logging service or as a super polymorphic version of the writer
monad effect.

**Signature**

```ts
export interface Annotations extends Annotations.Proto {
  /**
   * Accesses an `Annotations` instance in the environment and retrieves the
   * annotation of the specified type, or its default value if there is none.
   *
   * @macro traced
   */
  get<A>(key: TestAnnotation.TestAnnotation<A>): Effect.Effect<never, never, A>

  /**
   * Accesses an `Annotations` instance in the environment and appends the
   * specified annotation to the annotation map.
   *
   * @macro traced
   */
  annotate<A>(key: TestAnnotation.TestAnnotation<A>, value: A): Effect.Effect<never, never, void>

  /**
   * Returns the set of all fibers in this test.
   *
   * @macro traced
   */
  supervisedFibers(): Effect.Effect<never, never, SortedSet.SortedSet<Fiber.RuntimeFiber<unknown, unknown>>>
}
```

Added in v1.0.0

# refinements

## isAnnotations

Returns `true` if the specified value is an `Annotations`, `false`
otherwise.

**Signature**

```ts
export declare const isAnnotations: (u: unknown) => u is Annotations
```

Added in v1.0.0

# symbols

## AnnotationsTypeId

**Signature**

```ts
export declare const AnnotationsTypeId: typeof AnnotationsTypeId
```

Added in v1.0.0

## AnnotationsTypeId (type alias)

**Signature**

```ts
export type AnnotationsTypeId = typeof AnnotationsTypeId
```

Added in v1.0.0

# utils

## annotate

Accesses an `Annotations` instance in the environment and appends the
specified annotation to the annotation map.

**Signature**

```ts
export declare const annotate: <A>(
  key: TestAnnotation.TestAnnotation<A>,
  value: A
) => Effect.Effect<Annotations, never, void>
```

Added in v1.0.0

## supervisedFibers

Returns the set of all fibers in this test.

**Signature**

```ts
export declare const supervisedFibers: () => Effect.Effect<
  Annotations,
  never,
  SortedSet.SortedSet<Fiber.RuntimeFiber<unknown, unknown>>
>
```

Added in v1.0.0
