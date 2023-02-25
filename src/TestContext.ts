/**
 * @since 1.0.0
 */
import type * as DefaultServices from "@effect/io/DefaultServices"
import * as internal from "@effect/io/internal_effect_untraced/testing/testEnvironment"
import type * as TS from "@effect/io/internal_effect_untraced/testing/testServices"
import type * as Layer from "@effect/io/Layer"

/**
 * Represents the environment provided to tests.
 *
 * @since 1.0.0
 * @category models
 */
export type TestContext = TS.TestServices
/**
 * @since 1.0.0
 * @category context
 */
export const live: Layer.Layer<DefaultServices.DefaultServices, never, TestContext> = internal.live

/**
 * @since 1.0.0
 * @category context
 */
export const TestContext: Layer.Layer<never, never, TestContext> = internal.testContext()
