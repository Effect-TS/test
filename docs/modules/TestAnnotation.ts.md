---
title: TestAnnotation.ts
nav_order: 5
parent: Modules
---

## TestAnnotation overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [annotations](#annotations)
  - [fibers](#fibers)
  - [ignored](#ignored)
  - [repeated](#repeated)
  - [retried](#retried)
  - [tagged](#tagged)
- [constructors](#constructors)
  - [make](#make)
- [models](#models)
  - [TestAnnotation (interface)](#testannotation-interface)
- [refinements](#refinements)
  - [isTestAnnotation](#istestannotation)
- [symbols](#symbols)
  - [TestAnnotationTypeId](#testannotationtypeid)
  - [TestAnnotationTypeId (type alias)](#testannotationtypeid-type-alias)

---

# annotations

## fibers

**Signature**

```ts
export declare const fibers: TestAnnotation<
  Either.Either<number, Chunk.Chunk<MutableRef.MutableRef<SortedSet.SortedSet<Fiber.RuntimeFiber<unknown, unknown>>>>>
>
```

Added in v1.0.0

## ignored

An annotation which counts ignored tests.

**Signature**

```ts
export declare const ignored: TestAnnotation<number>
```

Added in v1.0.0

## repeated

An annotation which counts repeated tests.

**Signature**

```ts
export declare const repeated: TestAnnotation<number>
```

Added in v1.0.0

## retried

An annotation which counts retried tests.

**Signature**

```ts
export declare const retried: TestAnnotation<number>
```

Added in v1.0.0

## tagged

An annotation which tags tests with strings.

**Signature**

```ts
export declare const tagged: TestAnnotation<HashSet.HashSet<string>>
```

Added in v1.0.0

# constructors

## make

Constructs a new `TestAnnotation`.

**Signature**

```ts
export declare const make: <A>(
  identifier: string,
  tag: Context.Tag<A, A>,
  initial: A,
  combine: (a: A, b: A) => A
) => TestAnnotation<A>
```

Added in v1.0.0

# models

## TestAnnotation (interface)

Represents a type of annotation for a test.

**Signature**

```ts
export interface TestAnnotation<A> extends TestAnnotation.Proto {
  /**
   * The identifier for the annotation.
   */
  readonly identifier: string
  /**
   * The `Context` tag for the annotation.
   */
  readonly tag: Context.Tag<A, A>
  /**
   * The initial value for the annotation.
   */
  readonly initial: A
  /**
   * A function that can be used to combine test annotation values.
   */
  readonly combine: (a: A, b: A) => A
}
```

Added in v1.0.0

# refinements

## isTestAnnotation

Returns `true` if the specified value is a `TestAnnotation`, `false`
otherwise.

**Signature**

```ts
export declare const isTestAnnotation: (u: unknown) => u is TestAnnotation<unknown>
```

Added in v1.0.0

# symbols

## TestAnnotationTypeId

**Signature**

```ts
export declare const TestAnnotationTypeId: typeof TestAnnotationTypeId
```

Added in v1.0.0

## TestAnnotationTypeId (type alias)

**Signature**

```ts
export type TestAnnotationTypeId = typeof TestAnnotationTypeId
```

Added in v1.0.0
