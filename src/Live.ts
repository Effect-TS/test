/**
 * @since 1.0.0
 */
import * as Context from "@effect/data/Context"
import { pipe } from "@effect/data/Function"
import type * as DefaultServices from "@effect/io/DefaultServices"
import * as Effect from "@effect/io/Effect"
import * as FiberRef from "@effect/io/FiberRef"
import * as internal from "@effect/io/internal_effect_untraced/testing/live"
import * as testServices from "@effect/io/internal_effect_untraced/testing/testServices"
import * as Layer from "@effect/io/Layer"
import type * as Scope from "@effect/io/Scope"
import { currentServices } from "@effect/io/src/DefaultServices"

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
  provide<R, E, A>(effect: Effect.Effect<R, E, A>): Effect.Effect<R, E, A>
}

/**
 * Constructs a new `Live` service that implements the `Live` interface. This
 * typically should not be necessary as the `TestEnvironment` already includes
 * the `Live` service but could be useful if you are mixing in interfaces to
 * create your own environment type.
 *
 * @since 1.0.0
 * @category context
 */
export const defaultLive: Layer.Layer<never, never, Live> = Layer.effect(
  internal.Live,
  Effect.contextWith<never, Live>((env) => ({
    [LiveTypeId]: LiveTypeId,
    provide: (effect) =>
      pipe(
        effect,
        FiberRef.locallyWith(currentServices, Context.merge(env))
      )
  })) as any
) as any

/**
 * Provides a workflow with the "live" default Effect services.
 *
 * @since 1.0.0
 */
export const provideLive: <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R | Live, E, A> =
  testServices.provideLive

/**
 * Runs a transformation function with the live default Effect services while
 * ensuring that the workflow itself is run with the test services.
 *
 * @since 1.0.0
 */
export const withLive: {
  (live: Live): <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>
  <R, E, A>(effect: Effect.Effect<R, E, A>, live: Live): Effect.Effect<R, E, A>
} = testServices.withLive as any

/**
 * Sets the implementation of the live service to the specified value and
 * restores it to its original value when the scope is closed.
 *
 * @since 1.0.0
 */

export const withLiveScoped: (live: Live) => Effect.Effect<Scope.Scope, never, void> = testServices
  .withLiveScoped as any

/**
 * Constructs a new `Live` service wrapped in a layer.
 *
 * @since 1.0.0
 */
export const live: () => Layer.Layer<DefaultServices.DefaultServices, never, Live> = testServices.liveLayer as any
