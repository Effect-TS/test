/**
 * @since 1.0.0
 */
import type * as FiberRef from "@effect/io/FiberRef"
import * as internal from "@effect/io/internal/testing/testServices"
import type * as Annotations from "@effect/test/Annotations"
import type * as Live from "@effect/test/Live"
import type * as Sized from "@effect/test/Sized"
import type * as TestConfig from "@effect/test/TestConfig"
import type * as Context from "@fp-ts/data/Context"

/**
 * @since 1.0.0
 * @category models
 */
export type TestServices =
  | Annotations.Annotations
  | Live.Live
  | Sized.Sized
  | TestConfig.TestConfig

/**
 * The default Effect test services.
 *
 * @since 1.0.0
 * @category environment
 */
export const liveServices: Context.Context<TestServices> = internal.liveServices as any

/**
 * @since 1.0.0
 * @category fiberRefs
 */
export const currentServices: FiberRef.FiberRef<Context.Context<TestServices>> = internal.currentServices as any
