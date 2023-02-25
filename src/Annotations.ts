/**
 * @since 1.0.0
 */
import type * as Context from "@effect/data/Context"
import type * as SortedSet from "@effect/data/SortedSet"
import type * as Effect from "@effect/io/Effect"
import type * as Fiber from "@effect/io/Fiber"
import * as annotations from "@effect/io/internal_effect_untraced/testing/annotations"
import * as testServices from "@effect/io/internal_effect_untraced/testing/testServices"
import type * as Layer from "@effect/io/Layer"
import type * as TestAnnotation from "@effect/test/TestAnnotation"

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
   * Accesses an `Annotations` instance in the context and retrieves the
   * annotation of the specified type, or its default value if there is none.
   */
  get<A>(key: TestAnnotation.TestAnnotation<A>): Effect.Effect<never, never, A>

  /**
   * Accesses an `Annotations` instance in the context and appends the
   * specified annotation to the annotation map.
   */
  annotate<A>(key: TestAnnotation.TestAnnotation<A>, value: A): Effect.Effect<never, never, void>

  /**
   * Returns the set of all fibers in this test.
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
 * @category context
 */
export const Tag: Context.Tag<Annotations> = annotations.Tag as any

/**
 * Returns `true` if the specified value is an `Annotations`, `false`
 * otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isAnnotations: (u: unknown) => u is Annotations = annotations.isAnnotations as any

/**
 * Accesses an `Annotations` instance in the environment and retrieves the
 * annotation of the specified type, or its default value if there is none.
 *
 * @since 1.0.0
 */
export const get: <A>(key: TestAnnotation.TestAnnotation<A>) => Effect.Effect<Annotations, never, A> = testServices
  .get as any

/**
 * Accesses an `Annotations` instance in the environment and appends the
 * specified annotation to the annotation map.
 *
 * @since 1.0.0
 */
export const annotate: <A>(
  key: TestAnnotation.TestAnnotation<A>,
  value: A
) => Effect.Effect<Annotations, never, void> = testServices.annotate as any

/**
 * Returns the set of all fibers in this test.
 *
 * @since 1.0.0
 */
export const supervisedFibers: () => Effect.Effect<
  Annotations,
  never,
  SortedSet.SortedSet<Fiber.RuntimeFiber<unknown, unknown>>
> = testServices.supervisedFibers

/**
 * Constructs a new `Annotations` service.
 *
 * @category context
 * @since 1.0.0
 */
export const live: () => Layer.Layer<never, never, Annotations> = testServices.annotationsLayer as any
