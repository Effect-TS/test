---
title: TestAnnotationMap.ts
nav_order: 6
parent: Modules
---

## TestAnnotationMap overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [empty](#empty)
  - [make](#make)
- [getters](#getters)
  - [get](#get)
- [models](#models)
  - [TestAnnotationMap (interface)](#testannotationmap-interface)
- [mutations](#mutations)
  - [annotate](#annotate)
  - [combine](#combine)
  - [overwrite](#overwrite)
  - [update](#update)
- [refinements](#refinements)
  - [isTestAnnotationMap](#istestannotationmap)
- [symbols](#symbols)
  - [TestAnnotationMapTypeId](#testannotationmaptypeid)
  - [TestAnnotationMapTypeId (type alias)](#testannotationmaptypeid-type-alias)

---

# constructors

## empty

The empty `TestAnnotationMap`.

**Signature**

```ts
export declare const empty: TestAnnotationMap
```

Added in v1.0.0

## make

Constructs a new `TestAnnotationMap` from the specified map.

**Signature**

```ts
export declare const make: (map: ReadonlyMap<TestAnnotation.TestAnnotation<unknown>, unknown>) => TestAnnotationMap
```

Added in v1.0.0

# getters

## get

Retrieves the annotation of the specified type, or its default value if
there is none.

**Signature**

```ts
export declare const get: <A>(key: TestAnnotation.TestAnnotation<A>) => (self: TestAnnotationMap) => A
```

Added in v1.0.0

# models

## TestAnnotationMap (interface)

An annotation map keeps track of annotations of different types.

**Signature**

```ts
export interface TestAnnotationMap extends TestAnnotationMap.Proto {}
```

Added in v1.0.0

# mutations

## annotate

Appends the specified annotation to the annotation map.

**Signature**

```ts
export declare const annotate: <A>(
  key: TestAnnotation.TestAnnotation<A>,
  value: A
) => (self: TestAnnotationMap) => TestAnnotationMap
```

Added in v1.0.0

## combine

Combines two `TestAnnotationMap`s.

**Signature**

```ts
export declare const combine: (that: TestAnnotationMap) => (self: TestAnnotationMap) => TestAnnotationMap
```

Added in v1.0.0

## overwrite

Overwrites the specified key/value pair in the `TestAnnotationMap`.

**Signature**

```ts
export declare const overwrite: <A>(
  key: TestAnnotation.TestAnnotation<A>,
  value: A
) => (self: TestAnnotationMap) => TestAnnotationMap
```

Added in v1.0.0

## update

Updates the value associated with the specified key specified in the
`TestAnnotationMap`.

**Signature**

```ts
export declare const update: <A>(
  key: TestAnnotation.TestAnnotation<A>,
  f: (value: A) => A
) => (self: TestAnnotationMap) => TestAnnotationMap
```

Added in v1.0.0

# refinements

## isTestAnnotationMap

Returns `true` if the specified value is a `TestAnnotationMap`, `false`
otherwise.

**Signature**

```ts
export declare const isTestAnnotationMap: (u: unknown) => u is TestAnnotationMap
```

Added in v1.0.0

# symbols

## TestAnnotationMapTypeId

**Signature**

```ts
export declare const TestAnnotationMapTypeId: typeof TestAnnotationMapTypeId
```

Added in v1.0.0

## TestAnnotationMapTypeId (type alias)

**Signature**

```ts
export type TestAnnotationMapTypeId = typeof TestAnnotationMapTypeId
```

Added in v1.0.0
