/**
 * @since 1.0.0
 */
import type * as DefaultServices from "@effect/io/DefaultServices"
import * as internal from "@effect/io/internal/testing/testEnvironment"
import type * as Layer from "@effect/io/Layer"
import type * as TestServices from "@effect/test/TestServices"

/**
 * @since 1.0.0
 * @category environment
 */
export const layer: Layer.Layer<DefaultServices.DefaultServices, never, TestServices.TestServices> = internal
  .live as any

/**
 * @since 1.0.0
 * @category environment
 */
export const liveEnvironment: () => Layer.Layer<never, never, DefaultServices.DefaultServices> = internal
  .liveEnvironment as any

/**
 * @since 1.0.0
 * @category environment
 */
export const testEnvironment: () => Layer.Layer<never, never, TestServices.TestServices> = internal
  .testEnvironment as any
