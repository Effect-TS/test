/**
 * @since 1.0.0
 */
import type * as Fiber from "@effect/io/Fiber"
import type * as Chunk from "@fp-ts/data/Chunk"
import type * as Context from "@fp-ts/data/Context"
import type * as Either from "@fp-ts/data/Either"
import type * as Equal from "@fp-ts/data/Equal"
import type * as HashSet from "@fp-ts/data/HashSet"
import type * as MutableRef from "@fp-ts/data/MutableRef"
import type * as SortedSet from "@fp-ts/data/SortedSet"

/** @internal */
import * as testAnnotation from "@effect/io/internal/testing/testAnnotation"

/**
 * @since 1.0.0
 * @category symbols
 */
export const TestAnnotationTypeId: unique symbol = testAnnotation
  .TestAnnotationTypeId as unknown as TestAnnotationTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type TestAnnotationTypeId = typeof TestAnnotationTypeId

/**
 * Represents a type of annotation for a test.
 *
 * @since 1.0.0
 * @category models
 */
export interface TestAnnotation<A> extends TestAnnotation.Proto {
  /**
   * The identifier for the annotation.
   */
  readonly identifier: string
  /**
   * The `Context` tag for the annotation.
   */
  readonly tag: Context.Tag<A>
  /**
   * The initial value for the annotation.
   */
  readonly initial: A
  /**
   * A function that can be used to combine test annotation values.
   */
  readonly combine: (a: A, b: A) => A
}

/**
 * @since 1.0.0
 */
export declare namespace TestAnnotation {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Proto extends Equal.Equal {
    readonly [TestAnnotationTypeId]: TestAnnotationTypeId
  }
}

/**
 * Returns `true` if the specified value is a `TestAnnotation`, `false`
 * otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isTestAnnotation: (u: unknown) => u is TestAnnotation<unknown> = testAnnotation.isTestAnnotation

/**
 * Constructs a new `TestAnnotation`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const make: <A>(
  identifier: string,
  tag: Context.Tag<A>,
  initial: A,
  combine: (a: A, b: A) => A
) => TestAnnotation<A> = testAnnotation.make

/**
 * @since 1.0.0
 * @category annotations
 */
export const fibers: TestAnnotation<
  Either.Either<
    number,
    Chunk.Chunk<MutableRef.MutableRef<SortedSet.SortedSet<Fiber.RuntimeFiber<unknown, unknown>>>>
  >
> = testAnnotation.fibers

/**
 * An annotation which counts ignored tests.
 *
 * @since 1.0.0
 * @category annotations
 */
export const ignored: TestAnnotation<number> = testAnnotation.ignored

/**
 * An annotation which counts repeated tests.
 *
 * @since 1.0.0
 * @category annotations
 */
export const repeated: TestAnnotation<number> = testAnnotation.repeated

/**
 * An annotation which counts retried tests.
 *
 * @since 1.0.0
 * @category annotations
 */
export const retried: TestAnnotation<number> = testAnnotation.retried

/**
 * An annotation which tags tests with strings.
 *
 * @since 1.0.0
 * @category annotations
 */
export const tagged: TestAnnotation<HashSet.HashSet<string>> = testAnnotation.tagged
