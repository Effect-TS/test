/**
 * @since 1.0.0
 */
import type * as Chunk from "@effect/data/Chunk"
import type * as Duration from "@effect/data/Duration"
import type * as Clock from "@effect/io/Clock"
import type * as Deferred from "@effect/io/Deferred"
import type * as Effect from "@effect/io/Effect"
import * as internal from "@effect/io/internal_effect_untraced/testing/testClock"
import type * as Layer from "@effect/io/Layer"
import type * as Annotations from "@effect/test/Annotations"
import type * as Live from "@effect/test/Live"

/**
 * A `TestClock` makes it easy to deterministically and efficiently test effects
 * involving the passage of time.
 *
 * Instead of waiting for actual time to pass, `sleep` and methods implemented
 * in terms of it schedule effects to take place at a given clock time. Users
 * can adjust the clock time using the `adjust` and `setTime` methods, and all
 * effects scheduled to take place on or before that time will automatically be
 * run in order.
 *
 * For example, here is how we can test `Effect.timeout` using `TestClock`:
 *
 * ```ts
 * import * as Effect from "@effect/io/Effect"
 * import * as Fiber from "@effect/io/Fiber"
 * import * as TestClock from "@effect/test/TestClock"
 * import * as Duration from "@effect/data/Duration"
 * import { pipe } from "@effect/data/Function"
 * import * as Option from "@effect/data/Option"
 * import * as assert from "node:assert"
 *
 * Effect.gen(function*($) {
 *   const fiber = yield* $(pipe(
 *     Effect.sleep(Duration.minutes(5)),
 *     Effect.timeout(Duration.minutes(1)),
 *     Effect.fork
 *   ))
 *   yield* $(TestClock.adjust(Duration.minutes(1)))
 *   const result = yield* $(Fiber.join(fiber))
 *   assert.deepStrictEqual(result, Option.none())
 * })
 * ```
 *
 * Note how we forked the fiber that `sleep` was invoked on. Calls to `sleep`
 * and methods derived from it will semantically block until the time is set to
 * on or after the time they are scheduled to run. If we didn't fork the fiber
 * on which we called sleep we would never get to set the time on the line
 * below. Thus, a useful pattern when using `TestClock` is to fork the effect
 * being tested, then adjust the clock time, and finally verify that the
 * expected effects have been performed.
 *
 * @since 1.0.0
 * @category models
 */
export interface TestClock extends Clock.Clock {
  /**
   * Increments the current clock time by the specified duration. Any effects
   * that were scheduled to occur on or before the new time will be run in
   * order.
   */
  adjust(duration: Duration.Duration): Effect.Effect<never, never, void>

  /**
   * Increments the current clock time by the specified duration. Any effects
   * that were scheduled to occur on or before the new time will be run in
   * order.
   */
  adjustWith(duration: Duration.Duration): <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>

  /**
   * Saves the `TestClock`'s current state in an effect which, when run, will
   * restore the `TestClock` state to the saved state.
   */
  save(): Effect.Effect<never, never, Effect.Effect<never, never, void>>

  /**
   * Sets the current clock time to the specified instant. Any effects that
   * were scheduled to occur on or before the new time will be run in order.
   */
  setTime(time: number): Effect.Effect<never, never, void>

  /**
   * Returns a list of the times at which all queued effects are scheduled to
   * resume.
   */
  sleeps(): Effect.Effect<never, never, Chunk.Chunk<number>>
}

/**
 * @since 1.0.0
 */
export declare namespace TestClock {
  /**
   * `Data` represents the state of the `TestClock`, including the clock time.
   *
   * @since 1.0.0
   * @category models
   */
  export interface Data {
    readonly instant: number
    readonly sleeps: Chunk.Chunk<readonly [number, Deferred.Deferred<never, void>]>
  }
}

/**
 * The default `Layer` containing a `TestClock`.
 *
 * @since 1.0.0
 * @category context
 */
export const defaultTestClock: Layer.Layer<Annotations.Annotations | Live.Live, never, TestClock> = internal
  .defaultTestClock as any

/**
 * Constructs a `Layer` containing a `TestClock`.
 *
 * @since 1.0.0
 * @category context
 */
export const live: (data: TestClock.Data) => Layer.Layer<Annotations.Annotations | Live.Live, never, TestClock> =
  internal.live as any

/**
 * Accesses a `TestClock` instance in the environment and increments the time
 * by the specified duration, running any actions scheduled for on or before
 * the new time in order.
 *
 * @since 1.0.0
 * @category mutations
 */
export const adjust: (duration: Duration.Duration) => Effect.Effect<never, never, void> = internal.adjust

/**
 * Accesses a `TestClock` instance in the environment within the scope of the
 * specified `effect` workflow and increments the time by the specified duration,
 * running any actions scheduled for on or before the new time in order.
 *
 * @since 1.0.0
 * @category mutations
 */
export const adjustWith: (
  duration: Duration.Duration
) => <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A> = internal.adjustWith

/**
 * Accesses the current time of a `TestClock` instance in the environment in
 * milliseconds.
 *
 * @since 1.0.0
 * @category getters
 */
export const currentTimeMillis: () => Effect.Effect<never, never, number> = internal.currentTimeMillis

/**
 * Accesses a `TestClock` instance in the environment and saves the clock
 * state in an effect which, when run, will restore the `TestClock` to the
 * saved state.
 *
 * @since 1.0.0
 * @category utils
 */
export const save: () => Effect.Effect<never, never, Effect.Effect<never, never, void>> = internal.save

/**
 * Accesses a `TestClock` instance in the environment and sets the clock time
 * to the specified `Instant`, running any actions scheduled for on or before
 * the new time in order.
 *
 * @since 1.0.0
 * @category mutations
 */
export const setTime: (instant: number) => Effect.Effect<never, never, void> = internal.setTime

/**
 * Semantically blocks the current fiber until the clock time is equal to or
 * greater than the specified duration. Once the clock time is adjusted to
 * on or after the duration, the fiber will automatically be resumed.
 *
 * @since 1.0.0
 * @category utils
 */
export const sleep: (duration: Duration.Duration) => Effect.Effect<never, never, void> = internal.sleep

/**
 * Accesses a `TestClock` instance in the environment and returns a list of
 * times that effects are scheduled to run.
 *
 * @since 1.0.0
 * @category getters
 */
export const sleeps: () => Effect.Effect<never, never, Chunk.Chunk<number>> = internal.sleeps

/**
 * Retrieves the `TestClock` service for this test.
 *
 * @since 1.0.0
 * @category getters
 */
export const testClock: () => Effect.Effect<never, never, TestClock> = internal.testClock

/**
 * Retrieves the `TestClock` service for this test and uses it to run the
 * specified workflow.
 *
 * @since 1.0.0
 * @category getters
 */
export const testClockWith: <R, E, A>(f: (testClock: TestClock) => Effect.Effect<R, E, A>) => Effect.Effect<R, E, A> =
  internal.testClockWith
