/**
 * @since 1.0.0
 */
import type * as Effect from "@effect/io/Effect"
import type * as FiberRef from "@effect/io/FiberRef"
import * as internal from "@effect/io/internal/testing/sized"
import * as testServices from "@effect/io/internal/testing/testServices"
import type * as Layer from "@effect/io/Layer"
import type * as Scope from "@effect/io/Scope"
import type * as Gen from "@effect/test/Gen"
import * as gen from "@effect/test/internal/gen"
import type * as Context from "@fp-ts/data/Context"

/**
 * @since 1.0.0
 * @category symbols
 */
export const SizedTypeId: unique symbol = internal.SizedTypeId as unknown as SizedTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type SizedTypeId = typeof SizedTypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface Sized {
  readonly [SizedTypeId]: SizedTypeId
  /** @internal */
  readonly fiberRef: FiberRef.FiberRef<number>
  /** @macro traced */
  size(): Effect.Effect<never, never, number>
  /** @macro traced */
  withSize(size: number): <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>
}

/**
 * The `Context` tag for `Sized`.
 *
 * @since 1.0.0
 * @category environment
 */
export const Tag: Context.Context<Sized> = internal.Tag as any

/**
 * Constructs a new `Sized` from a `FiberRef`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const fromFiberRef: (fiberRef: FiberRef.FiberRef<number>) => Sized = internal.fromFiberRef as any

/**
 * @since 1.0.0
 * @category environment
 */
export const layer: (size: number) => Layer.Layer<never, never, Sized> = testServices.sizedLayer as any

/**
 * Constructs a new `Sized`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const make: (size: number) => Sized = internal.make as any

/**
 * Retrieves the `Sized` service for this test.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const sized: () => Effect.Effect<never, never, Sized> = testServices.sized as any

/**
 * Retrieves the `Sized` service for this test and uses it to run the specified
 * workflow.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const sizedWith: <R, E, A>(f: (sized: Sized) => Effect.Effect<R, E, A>) => Effect.Effect<R, E, A> = testServices
  .sizedWith as any

/**
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const withSize: (size: number) => <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A> =
  testServices.withSize

/**
 * @since 1.0.0
 * @category utils
 */
export const withSizeGen: (size: number) => <R, A>(self: Gen.Gen<R, A>) => Gen.Gen<R, A> = gen.withSizeGen

/**
 * Executes the specified workflow with the specified implementation of the
 * `Sized` service.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const withSized: (sized: Sized) => <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A> =
  testServices.withSized as any

/**
 * Sets the implementation of the sized service to the specified value and
 * restores it to its original value when the scope is closed.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const withSizedScoped: (sized: Sized) => Effect.Effect<Scope.Scope, never, void> = testServices
  .withSizedScoped as any
