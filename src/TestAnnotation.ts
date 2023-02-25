/**
 * @since 1.0.0
 */
import type * as Chunk from "@effect/data/Chunk"
import type * as Context from "@effect/data/Context"
import type * as Either from "@effect/data/Either"
import type * as Equal from "@effect/data/Equal"
import type * as HashSet from "@effect/data/HashSet"
import type * as MutableRef from "@effect/data/MutableRef"
import type * as SortedSet from "@effect/data/SortedSet"
import type * as Fiber from "@effect/io/Fiber"
import * as testAnnotation from "@effect/io/internal_effect_untraced/testing/testAnnotation"

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
export const isTestAnnotation: (u: unknown) => u is TestAnnotation<unknown> = testAnnotation.isTestAnnotation as any

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
) => TestAnnotation<A> = testAnnotation.make as any

/**
 * @since 1.0.0
 * @category annotations
 */
export const fibers: TestAnnotation<
  Either.Either<
    number,
    Chunk.Chunk<MutableRef.MutableRef<SortedSet.SortedSet<Fiber.RuntimeFiber<unknown, unknown>>>>
  >
> = testAnnotation.fibers as any

/**
 * An annotation which counts ignored tests.
 *
 * @since 1.0.0
 * @category annotations
 */
export const ignored: TestAnnotation<number> = testAnnotation.ignored as any

/**
 * An annotation which counts repeated tests.
 *
 * @since 1.0.0
 * @category annotations
 */
export const repeated: TestAnnotation<number> = testAnnotation.repeated as any

/**
 * An annotation which counts retried tests.
 *
 * @since 1.0.0
 * @category annotations
 */
export const retried: TestAnnotation<number> = testAnnotation.retried as any

/**
 * An annotation which tags tests with strings.
 *
 * @since 1.0.0
 * @category annotations
 */
export const tagged: TestAnnotation<HashSet.HashSet<string>> = testAnnotation.tagged as any
