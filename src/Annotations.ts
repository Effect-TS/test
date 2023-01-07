/**
 * @since 1.0.0
 */
import type * as Effect from "@effect/io/Effect"
import type * as Fiber from "@effect/io/Fiber"
import * as internal from "@effect/io/internal/testing/annotations"
import * as testServices from "@effect/io/internal/testing/testServices"
import type * as Layer from "@effect/io/Layer"
import type * as Ref from "@effect/io/Ref"
import type * as Scope from "@effect/io/Scope"
import type * as TestAnnotation from "@effect/test/TestAnnotation"
import type * as TestAnnotationMap from "@effect/test/TestAnnotationMap"
import type * as Context from "@fp-ts/data/Context"
import type * as SortedSet from "@fp-ts/data/SortedSet"

/**
 * @since 1.0.0
 * @category symbols
 */
export const AnnotationsTypeId: unique symbol = internal.AnnotationsTypeId as unknown as AnnotationsTypeId

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
 * Returns `true` if the specified value is an `Annotations`, `false`
 * otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isAnnotations: (u: unknown) => u is Annotations = internal.isAnnotations as any

/**
 * The `Context` tag for `Annotations`.
 *
 * @since 1.0.0
 * @category environment
 */
export const Tag: Context.Tag<Annotations> = internal.Tag as any

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
) => Effect.Effect<Annotations, never, void> = testServices.annotate as any

/**
 * Retrieves the `Annotations` service for this test.
 *
 * @macro traced
 * @since 1.0.0
 * @category getters
 */
export const annotations: () => Effect.Effect<never, never, Annotations> = testServices.annotations as any

/**
 * Retrieves the `Annotations` service for this test and uses it to run the
 * specified workflow.
 *
 * @macro traced
 * @since 1.0.0
 * @category getters
 */
export const annotationsWith: <R, E, A>(
  f: (annotations: Annotations) => Effect.Effect<R, E, A>
) => Effect.Effect<R, E, A> = testServices.annotationsWith as any

/**
 * Accesses an `Annotations` instance in the environment and retrieves the
 * annotation of the specified type, or its default value if there is none.
 *
 * @macro traced
 * @since 1.0.0
 * @category getters
 */
export const get: <A>(key: TestAnnotation.TestAnnotation<A>) => Effect.Effect<Annotations, never, A> = testServices
  .get as any

/**
 * Constructs a new `Annotations` service wrapped in a layer.
 *
 * @since 1.0.0
 * @category environment
 */
export const layer: () => Layer.Layer<never, never, Annotations> = testServices.annotationsLayer as any

/**
 * Constructs a new `Annotations` service.
 *
 * @since 1.0.0
 * @category constructors
 */
export const make: (ref: Ref.Ref<TestAnnotationMap.TestAnnotationMap>) => Annotations = internal.make as any

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
> = testServices.supervisedFibers as any

// TODO(Mike/Max): withAnnotation after TestSuccess / TestFailure

/**
 * Executes the specified workflow with the specified implementation of the
 * `Annotations` service.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const withAnnotations: (
  annotations: Annotations
) => <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A> = testServices.withAnnotations as any

/**
 * Sets the implementation of the annotations service to the specified value
 * and restores it to its original value when the scope is closed.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const withAnnotationsScoped: (annotations: Annotations) => Effect.Effect<Scope.Scope, never, void> = testServices
  .withAnnotationsScoped as any
