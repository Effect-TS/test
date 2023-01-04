/**
 * @since 1.0.0
 */
import type * as Effect from "@effect/io/Effect"
import type * as Fiber from "@effect/io/Fiber"
import * as annotations from "@effect/io/internal/testing/annotations"
import type * as Layer from "@effect/io/Layer"
import type * as TestAnnotation from "@effect/test/TestAnnotation"
import type * as Context from "@fp-ts/data/Context"
import type * as SortedSet from "@fp-ts/data/SortedSet"

/**
 * @since 1.0.0
 * @category symbols
 */
export const AnnotationsTypeId: unique symbol = annotations.AnnotationsTypeId as unknown as AnnotationsTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type AnnotationsTypeId = typeof AnnotationsTypeId

/**
 * The `Annotations` trait provides access to an annotation map that tests can
 * add arbitrary annotations to. Each annotation consists of a string
 * identifier, an initial value, and a function for combining two values.
 * Annotations form monoids and you can think of `Annotations` as a more
 * structured logging service or as a super polymorphic version of the writer
 * monad effect.
 *
 * @since 1.0.0
 * @category models
 */
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

/**
 * @since 1.0.0
 */
export declare namespace Annotations {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Proto {
    readonly [AnnotationsTypeId]: AnnotationsTypeId
  }
}

/**
 * The `Context` tag for `Annotations`.
 *
 * @since 1.0.0
 * @category environment
 */
export const Tag: Context.Tag<Annotations> = annotations.Tag

/**
 * A `Layer` containing an instance of `Annotations`.
 *
 * @since 1.0.0
 * @category environment
 */
export const live: Layer.Layer<never, never, Annotations> = annotations.live

/**
 * Returns `true` if the specified value is an `Annotations`, `false`
 * otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isAnnotations: (u: unknown) => u is Annotations = annotations.isAnnotations

/**
 * Accesses an `Annotations` instance in the environment and retrieves the
 * annotation of the specified type, or its default value if there is none.
 *
 * @macro traced
 * @since 1.0.0
 * @category getters
 */
export const get: <A>(key: TestAnnotation.TestAnnotation<A>) => Effect.Effect<Annotations, never, A> = annotations.get

/**
 * Accesses an `Annotations` instance in the environment and appends the
 * specified annotation to the annotation map.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const annotate: <A>(
  key: TestAnnotation.TestAnnotation<A>,
  value: A
) => Effect.Effect<Annotations, never, void> = annotations.annotate

/**
 * Returns the set of all fibers in this test.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const supervisedFibers: () => Effect.Effect<
  Annotations,
  never,
  SortedSet.SortedSet<Fiber.RuntimeFiber<unknown, unknown>>
> = annotations.supervisedFibers
