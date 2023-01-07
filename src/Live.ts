/**
 * @since 1.0.0
 */
import type * as DefaultServices from "@effect/io/DefaultServices"
import type * as Effect from "@effect/io/Effect"
import * as internal from "@effect/io/internal/testing/live"
import * as testServices from "@effect/io/internal/testing/testServices"
import type * as Layer from "@effect/io/Layer"
import type * as Scope from "@effect/io/Scope"
import type * as Context from "@fp-ts/data/Context"

/**
 * @since 1.0.0
 * @category symbols
 */
export const LiveTypeId: unique symbol = internal.LiveTypeId as unknown as LiveTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type LiveTypeId = typeof LiveTypeId

/**
 * The `Live` trait provides access to the "live" default Effect services from
 * within tests for workflows such as printing test results to the console or
 * timing out tests where it is necessary to access the real implementations of
 * these services.
 *
 * @since 1.0.0
 * @category models
 */
export interface Live {
  readonly [LiveTypeId]: LiveTypeId
  /**
   * Provides the specified `effect` with the "live" default Effect services.
   *
   * @macro traced
   */
  provide<R, E, A>(effect: Effect.Effect<R, E, A>): Effect.Effect<R, E, A>
}

/**
 * The `Context` tag for `Live`.
 *
 * @since 1.0.0
 * @category environment
 */
export const Tag: Context.Tag<Live> = internal.Tag as any

/**
 * Constructs a new `Live` service wrapped in a layer.
 *
 * @since 1.0.0
 * @category environment
 */
export const layer: () => Layer.Layer<DefaultServices.DefaultServices, never, Live> = testServices.liveLayer as any

/**
 * Retrieves the `Live` service for this test.
 *
 * @macro traced
 * @since 1.0.0
 * @category environment
 */
export const live: () => Effect.Effect<never, never, Live> = testServices.live as any

/**
 * Retrieves the Live service for this test and uses it to run the specified
 * workflow.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const liveWith: <R, E, A>(f: (live: Live) => Effect.Effect<R, E, A>) => Effect.Effect<R, E, A> = testServices
  .liveWith as any

/**
 * Constructs a new `Live` service that implements the `Live` interface. This
 * typically should not be necessary as the `TestEnvironment` already includes
 * the `Live` service but could be useful if you are mixing in interfaces to
 * create your own environment type.
 *
 * @since 1.0.0
 * @category constructors
 */
export const make: (services: Context.Context<DefaultServices.DefaultServices>) => internal.Live = internal.make as any

/**
 * Provides the specified `effect` with the "live" default Effect services.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const provideLive: <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A> = testServices.provideLive

/**
 * Runs a transformation function with the live default Effect services while
 * ensuring that the workflow itself is run with the test services.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const provideWithLive: <R, E, A, R2, E2, A2>(
  f: (effect: Effect.Effect<R, E, A>) => Effect.Effect<R2, E2, A2>
) => (self: Effect.Effect<R, E, A>) => Effect.Effect<R | R2, E | E2, A2> = testServices.provideWithLive

/**
 * Runs a transformation function with the live default Effect services while
 * ensuring that the workflow itself is run with the test services.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const withLive: (live: Live) => <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A> =
  testServices.withLive as any

/**
 * Sets the implementation of the live service to the specified value and
 * restores it to its original value when the scope is closed.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const withLiveScoped: (live: Live) => Effect.Effect<Scope.Scope, never, void> = testServices
  .withLiveScoped as any
