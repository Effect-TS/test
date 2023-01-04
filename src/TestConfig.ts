/**
 * @since 1.0.0
 */
import type * as Effect from "@effect/io/Effect"
import * as internal from "@effect/io/internal/testing/testConfig"
import type * as Layer from "@effect/io/Layer"
import type * as Context from "@fp-ts/data/Context"

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
 * @category environment
 */
export const Tag: Context.Tag<TestConfig> = internal.Tag

/**
 * The default `TestConfig`.
 *
 * @since 1.0.0
 * @category environment
 */
export const defaultTestConfig: Layer.Layer<never, never, TestConfig> = internal.defaultTestConfig

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
 * @category environment
 */
export const live: (
  params: {
    readonly repeats: number
    readonly retries: number
    readonly samples: number
    readonly shrinks: number
  }
) => Layer.Layer<never, never, TestConfig> = internal.live

/**
 * The number of times to repeat tests to ensure they are stable.
 *
 * @macro traced
 * @since 1.0.0
 * @category getters
 */
export const repeats: () => Effect.Effect<TestConfig, never, number> = internal.repeats

/**
 * The number of times to retry flaky tests.
 *
 * @macro traced
 * @since 1.0.0
 * @category getters
 */
export const retries: () => Effect.Effect<TestConfig, never, number> = internal.retries

/**
 * The number of sufficient samples to check for a random variable.
 *
 * @macro traced
 * @since 1.0.0
 * @category getters
 */
export const samples: () => Effect.Effect<TestConfig, never, number> = internal.samples

/**
 * The maximum number of shrinkings to minimize large failures.
 *
 * @macro traced
 * @since 1.0.0
 * @category getters
 */
export const shrinks: () => Effect.Effect<TestConfig, never, number> = internal.shrinks
