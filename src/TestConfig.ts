/**
 * @since 1.0.0
 */
import type * as Effect from "@effect/io/Effect"
import * as internal from "@effect/io/internal/testing/testConfig"
import * as testServices from "@effect/io/internal/testing/testServices"
import type * as Layer from "@effect/io/Layer"
import type * as Scope from "@effect/io/Scope"
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
 * Constructs a new `TestConfig`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const make: (params: {
  readonly repeats: number
  readonly retries: number
  readonly samples: number
  readonly shrinks: number
}) => TestConfig = internal.make

/**
 * Constructs a new `TestConfig` service with the specified settings.
 *
 * @since 1.0.0
 * @category environment
 */
export const layer: (
  params: {
    readonly repeats: number
    readonly retries: number
    readonly samples: number
    readonly shrinks: number
  }
) => Layer.Layer<never, never, TestConfig> = testServices.testConfigLayer

/**
 * The number of times to repeat tests to ensure they are stable.
 *
 * @macro traced
 * @since 1.0.0
 * @category getters
 */
export const repeats: () => Effect.Effect<never, never, number> = testServices.repeats

/**
 * The number of times to retry flaky tests.
 *
 * @macro traced
 * @since 1.0.0
 * @category getters
 */
export const retries: () => Effect.Effect<never, never, number> = testServices.retries

/**
 * The number of sufficient samples to check for a random variable.
 *
 * @macro traced
 * @since 1.0.0
 * @category getters
 */
export const samples: () => Effect.Effect<never, never, number> = testServices.samples

/**
 * The maximum number of shrinkings to minimize large failures.
 *
 * @macro traced
 * @since 1.0.0
 * @category getters
 */
export const shrinks: () => Effect.Effect<never, never, number> = testServices.shrinks

/**
 * Retrieves the `TestConfig` service for this test.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const testConfig: () => Effect.Effect<never, never, TestConfig> = testServices.testConfig

/**
 * Retrieves the `TestConfig` service for this test and uses it to run the
 * specified workflow.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const testConfigWith: <R, E, A>(
  f: (config: TestConfig) => Effect.Effect<R, E, A>
) => Effect.Effect<R, E, A> = testServices.testConfigWith

/**
 * Executes the specified workflow with the specified implementation of the
 * config service.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const withTestConfig: (
  config: TestConfig
) => <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A> = testServices.withTestConfig

/**
 * Sets the implementation of the config service to the specified value and
 * restores it to its original value when the scope is closed.
 *
 * @macro traced
 * @since 1.0.0
 * @category utils
 */
export const withTestConfigScoped: (config: TestConfig) => Effect.Effect<Scope.Scope, never, void> =
  testServices.withTestConfigScoped
