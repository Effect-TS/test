---
title: Sample.ts
nav_order: 4
parent: Modules
---

## Sample overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [noShrink](#noshrink)
  - [shrinkBigInt](#shrinkbigint)
  - [shrinkFractional](#shrinkfractional)
  - [shrinkIntegral](#shrinkintegral)
  - [unfold](#unfold)
- [filtering](#filtering)
  - [filter](#filter)
- [mapping](#mapping)
  - [map](#map)
- [models](#models)
  - [Sample (interface)](#sample-interface)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
- [symbols](#symbols)
  - [SampleTypeId](#sampletypeid)
  - [SampleTypeId (type alias)](#sampletypeid-type-alias)
- [traversing](#traversing)
  - [forEach](#foreach)
- [utils](#utils)
  - [shrinkSearch](#shrinksearch)
- [zipping](#zipping)
  - [zip](#zip)
  - [zipFlatten](#zipflatten)
  - [zipWith](#zipwith)

---

# constructors

## noShrink

Constructs a `Sample` without shrinking.

**Signature**

```ts
export declare const noShrink: <A>(value: A) => Sample<never, A>
```

Added in v1.0.0

## shrinkBigInt

**Signature**

```ts
export declare const shrinkBigInt: (smallest: bigint) => (value: bigint) => Sample<never, bigint>
```

Added in v1.0.0

## shrinkFractional

**Signature**

```ts
export declare const shrinkFractional: (smallest: number) => (value: number) => Sample<never, number>
```

Added in v1.0.0

## shrinkIntegral

**Signature**

```ts
export declare const shrinkIntegral: (smallest: number) => (value: number) => Sample<never, number>
```

Added in v1.0.0

## unfold

Unfolds a `Sample` from an initial value and a continuation function.

**Signature**

```ts
export declare const unfold: <S, A, R>(start: S, f: (s: S) => readonly [A, Stream.Stream<R, never, S>]) => Sample<R, A>
```

Added in v1.0.0

# filtering

## filter

Filters this sample by replacing it with its shrink tree if the value does
not meet the specified predicate and recursively filtering the shrink tree.

**Signature**

```ts
export declare const filter: <A>(
  predicate: Predicate<A>
) => <R>(self: Sample<R, A>) => Stream.Stream<R, never, Option.Option<Sample<R, A>>>
```

Added in v1.0.0

# mapping

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <R>(self: Sample<R, A>) => Sample<R, B>
```

Added in v1.0.0

# models

## Sample (interface)

A sample is a single observation from a random variable, together with a tree
of "shrinkings" used for minimization of "large" failures.

**Signature**

```ts
export interface Sample<R, A> extends Sample.Variance<R, A> {
  readonly value: A
  readonly shrink: Stream.Stream<R, never, Option.Option<Sample<R, A>>>
}
```

Added in v1.0.0

# sequencing

## flatMap

**Signature**

```ts
export declare const flatMap: <A, R2, A2>(f: (a: A) => Sample<R2, A2>) => <R>(self: Sample<R, A>) => Sample<R2 | R, A2>
```

Added in v1.0.0

# symbols

## SampleTypeId

**Signature**

```ts
export declare const SampleTypeId: typeof SampleTypeId
```

Added in v1.0.0

## SampleTypeId (type alias)

**Signature**

```ts
export type SampleTypeId = typeof SampleTypeId
```

Added in v1.0.0

# traversing

## forEach

Executes the specified effectual function for each element of the sample.

**Signature**

```ts
export declare const forEach: <A, R2, A2>(
  f: (a: A) => Effect.Effect<R2, never, A2>
) => <R>(self: Sample<R, A>) => Effect.Effect<R2 | R, never, Sample<R2 | R, A2>>
```

Added in v1.0.0

# utils

## shrinkSearch

Converts the shrink tree into a stream of shrinkings by recursively
searching the shrink tree, using the specified function to determine
whether a value is a failure. The resulting stream will contain all values
explored, regardless of whether they are successes or failures.

**Signature**

```ts
export declare const shrinkSearch: <A>(predicate: Predicate<A>) => <R>(self: Sample<R, A>) => Stream.Stream<R, never, A>
```

Added in v1.0.0

# zipping

## zip

Composes this sample with the specified sample to create a cartesian
product of values and shrinkings.

**Signature**

```ts
export declare const zip: <R2, A2>(
  that: Sample<R2, A2>
) => <R, A>(self: Sample<R, A>) => Sample<R2 | R, readonly [A, A2]>
```

Added in v1.0.0

## zipFlatten

Composes this sample with the specified sample to create a cartesian
product of values and shrinkings.

**Signature**

```ts
export declare const zipFlatten: <R2, A2>(
  that: Sample<R2, A2>
) => <R, A extends readonly any[]>(self: Sample<R, A>) => Sample<R2 | R, readonly [...A, A2]>
```

Added in v1.0.0

## zipWith

Composes this sample with the specified sample to create a cartesian
product of values and shrinkings with the specified function.

**Signature**

```ts
export declare const zipWith: <R2, A2, A, A3>(
  that: Sample<R2, A2>,
  f: (a: A, a2: A2) => A3
) => <R>(self: Sample<R, A>) => Sample<R2 | R, A3>
```

Added in v1.0.0
