/**
 * @since 1.0.0
 */
import type * as Context from "@effect/data/Context"
import * as Effect from "@effect/io/Effect"
import * as internal from "@effect/io/internal_effect_untraced/testing/testConfig"
import * as Layer from "@effect/io/Layer"

/**
 * The `TestConfig` service provides access to default configuration settings
 * used by tests, including the number of times to repeat tests to ensure
 * they are stable, the number of times to retry flaky tests, the sufficient
 * number of samples to check from a random variable, and the maximum number of
 * shrinkings to minimize large failures.
 *
 * @since 1.0.0
 * @category models
 */
export interface TestConfig {
  /**
   * The number of times to repeat tests to ensure they are stable.
   */
  readonly repeats: number
  /**
   * The number of times to retry flaky tests.
   */
  readonly retries: number
  /**
   * The number of sufficient samples to check for a random variable.
   */
  readonly samples: number
  /**
   * The maximum number of shrinkings to minimize large failures
   */
  readonly shrinks: number
}

/**
 * The `Context` tag for `TestConfig`.
 *
 * @since 1.0.0
 * @category context
 */
export const TestConfig: Context.Tag<TestConfig, TestConfig> = internal.TestClock

/**
 * Constructs a new `TestConfig`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const make = (params: {
  readonly repeats: number
  readonly retries: number
  readonly samples: number
  readonly shrinks: number
}): TestConfig => params

/**
 * Constructs a new `TestConfig` service with the specified settings.
 *
 * @since 1.0.0
 * @category context
 */
export const live: (
  params: {
    readonly repeats: number
    readonly retries: number
    readonly samples: number
    readonly shrinks: number
  }
) => Layer.Layer<never, never, TestConfig> = (params) => Layer.succeed(internal.TestClock, params)

/**
 * The default `TestConfig`.
 *
 * @since 1.0.0
 * @category context
 */
export const defaultTestConfig: Layer.Layer<never, never, TestConfig> = live({
  repeats: 100,
  retries: 100,
  samples: 200,
  shrinks: 1000
})

/**
 * The number of times to repeat tests to ensure they are stable.
 *
 * @since 1.0.0
 * @category getters
 */
export const repeats: () => Effect.Effect<TestConfig, never, number> = () =>
  Effect.map(internal.TestClock, (_) => _.repeats)

/**
 * The number of times to retry flaky tests.
 *
 * @since 1.0.0
 * @category getters
 */
export const retries: () => Effect.Effect<TestConfig, never, number> = () =>
  Effect.map(internal.TestClock, (_) => _.retries)

/**
 * The number of sufficient samples to check for a random variable.
 *
 * @since 1.0.0
 * @category getters
 */
export const samples: () => Effect.Effect<TestConfig, never, number> = () =>
  Effect.map(internal.TestClock, (_) => _.samples)

/**
 * The maximum number of shrinkings to minimize large failures.
 *
 * @since 1.0.0
 * @category getters
 */
export const shrinks: () => Effect.Effect<TestConfig, never, number> = () =>
  Effect.map(internal.TestClock, (_) => _.shrinks)
