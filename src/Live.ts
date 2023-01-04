/**
 * @since 1.0.0
 */
import type * as Effect from "@effect/io/Effect"
import * as internal from "@effect/io/internal/testing/live"
import type * as Layer from "@effect/io/Layer"

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
  /**
   * Provides the specified `effect` with the "live" default Effect services.
   *
   * @macro traced
   */
  provide<R, E, A>(effect: Effect.Effect<R, E, A>): Effect.Effect<R, E, A>
}

/**
 * Constructs a new `Live` service that implements the `Live` interface. This
 * typically should not be necessary as the `TestEnvironment` already includes
 * the `Live` service but could be useful if you are mixing in interfaces to
 * create your own environment type.
 *
 * @since 1.0.0
 * @category environment
 */
export const defaultLive: Layer.Layer<never, never, internal.Live> = internal.defaultLive

/**
 * Provides the specified `effect` with the "live" default Effect services.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const live: <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R | Live, E, A> = internal.live

/**
 * Runs a transformation function with the live default Effect services while
 * ensuring that the workflow itself is run with the test services.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const withLive: <R, E, A, R2, E2, A2>(
  f: (effect: Effect.Effect<R, E, A>) => Effect.Effect<R2, E2, A2>
) => (effect: Effect.Effect<R, E, A>) => Effect.Effect<R | R2 | Live, E | E2, A2> = internal.withLive
