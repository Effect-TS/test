/**
 * @since 1.0.0
 */
import type * as DefaultServices from "@effect/io/DefaultServices"
import * as internal from "@effect/io/internal/testing/testEnvironment"
import type * as Layer from "@effect/io/Layer"
import type * as Annotations from "@effect/test/Annotations"
import type * as Live from "@effect/test/Live"
import type * as TestConfig from "@effect/test/TestConfig"

/**
 * Represents the environment provided to tests.
 *
 * @since 1.0.0
 * @category models
 */
export type TestEnvironment =
  | Annotations.Annotations
  | Live.Live
  | TestConfig.TestConfig

/**
 * @since 1.0.0
 * @category environment
 */
export const live: Layer.Layer<DefaultServices.DefaultServices, never, TestEnvironment> = internal.live as any

/**
 * @since 1.0.0
 * @category environment
 */
export const TestEnvironment: Layer.Layer<never, never, TestEnvironment> = internal.TestEnvironment as any
