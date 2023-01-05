---
title: TestClock.ts
nav_order: 6
parent: Modules
---

## TestClock overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [environment](#environment)
  - [defaultTestClock](#defaulttestclock)
  - [live](#live)
- [getters](#getters)
  - [currentTimeMillis](#currenttimemillis)
  - [sleeps](#sleeps)
  - [testClock](#testclock)
  - [testClockWith](#testclockwith)
- [models](#models)
  - [TestClock (interface)](#testclock-interface)
- [mutations](#mutations)
  - [adjust](#adjust)
  - [adjustWith](#adjustwith)
  - [setTime](#settime)
- [utils](#utils)
  - [save](#save)
  - [sleep](#sleep)

---

# environment

## defaultTestClock

The default `Layer` containing a `TestClock`.

**Signature**

```ts
export declare const defaultTestClock: Layer.Layer<Annotations.Annotations | Live.Live, never, TestClock>
```

Added in v1.0.0

## live

Constructs a `Layer` containing a `TestClock`.

**Signature**

```ts
export declare const live: (data: TestClock.Data) => Layer.Layer<Annotations.Annotations | Live.Live, never, TestClock>
```

Added in v1.0.0

# getters

## currentTimeMillis

Accesses the current time of a `TestClock` instance in the environment in
milliseconds.

**Signature**

```ts
export declare const currentTimeMillis: () => Effect.Effect<never, never, number>
```

Added in v1.0.0

## sleeps

Accesses a `TestClock` instance in the environment and returns a list of
times that effects are scheduled to run.

**Signature**

```ts
export declare const sleeps: () => Effect.Effect<never, never, Chunk.Chunk<number>>
```

Added in v1.0.0

## testClock

Retrieves the `TestClock` service for this test.

**Signature**

```ts
export declare const testClock: () => Effect.Effect<never, never, TestClock>
```

Added in v1.0.0

## testClockWith

Retrieves the `TestClock` service for this test and uses it to run the
specified workflow.

**Signature**

```ts
export declare const testClockWith: <R, E, A>(
  f: (testClock: TestClock) => Effect.Effect<R, E, A>
) => Effect.Effect<R, E, A>
```

Added in v1.0.0

# models

## TestClock (interface)

A `TestClock` makes it easy to deterministically and efficiently test effects
involving the passage of time.

Instead of waiting for actual time to pass, `sleep` and methods implemented
in terms of it schedule effects to take place at a given clock time. Users
can adjust the clock time using the `adjust` and `setTime` methods, and all
effects scheduled to take place on or before that time will automatically be
run in order.

For example, here is how we can test `Effect.timeout` using `TestClock`:

```ts
import * as Effect from '@effect/io/Effect'
import * as Fiber from '@effect/io/Fiber'
import * as TestClock from '@effect/test/TestClock'
import * as Duration from '@fp-ts/data/Duration'
import { pipe } from '@fp-ts/data/Function'
import * as Option from '@fp-ts/data/Option'
import * as assert from 'node:assert'

Effect.gen(function* ($) {
  const fiber = yield* $(pipe(Effect.sleep(Duration.minutes(5)), Effect.timeout(Duration.minutes(1)), Effect.fork))
  yield* $(TestClock.adjust(Duration.minutes(1)))
  const result = yield* $(Fiber.join(fiber))
  assert.deepStrictEqual(result, Option.none)
})
```

Note how we forked the fiber that `sleep` was invoked on. Calls to `sleep`
and methods derived from it will semantically block until the time is set to
on or after the time they are scheduled to run. If we didn't fork the fiber
on which we called sleep we would never get to set the time on the line
below. Thus, a useful pattern when using `TestClock` is to fork the effect
being tested, then adjust the clock time, and finally verify that the
expected effects have been performed.

**Signature**

```ts
export interface TestClock extends Clock.Clock {
  /**
   * Increments the current clock time by the specified duration. Any effects
   * that were scheduled to occur on or before the new time will be run in
   * order.
   *
   * @macro traced
   */
  adjust(duration: Duration.Duration): Effect.Effect<never, never, void>

  /**
   * Increments the current clock time by the specified duration. Any effects
   * that were scheduled to occur on or before the new time will be run in
   * order.
   *
   * @macro traced
   */
  adjustWith(duration: Duration.Duration): <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>

  /**
   * Saves the `TestClock`'s current state in an effect which, when run, will
   * restore the `TestClock` state to the saved state.
   *
   * @macro traced
   */
  save(): Effect.Effect<never, never, Effect.Effect<never, never, void>>

  /**
   * Sets the current clock time to the specified instant. Any effects that
   * were scheduled to occur on or before the new time will be run in order.
   *
   * @macro traced
   */
  setTime(time: number): Effect.Effect<never, never, void>

  /**
   * Returns a list of the times at which all queued effects are scheduled to
   * resume.
   *
   * @macro traced
   */
  sleeps(): Effect.Effect<never, never, Chunk.Chunk<number>>
}
```

Added in v1.0.0

# mutations

## adjust

Accesses a `TestClock` instance in the environment and increments the time
by the specified duration, running any actions scheduled for on or before
the new time in order.

**Signature**

```ts
export declare const adjust: (duration: Duration.Duration) => Effect.Effect<never, never, void>
```

Added in v1.0.0

## adjustWith

Accesses a `TestClock` instance in the environment within the scope of the
specified `effect` workflow and increments the time by the specified duration,
running any actions scheduled for on or before the new time in order.

**Signature**

```ts
export declare const adjustWith: (
  duration: Duration.Duration
) => <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>
```

Added in v1.0.0

## setTime

Accesses a `TestClock` instance in the environment and sets the clock time
to the specified `Instant`, running any actions scheduled for on or before
the new time in order.

**Signature**

```ts
export declare const setTime: (instant: number) => Effect.Effect<never, never, void>
```

Added in v1.0.0

# utils

## save

Accesses a `TestClock` instance in the environment and saves the clock
state in an effect which, when run, will restore the `TestClock` to the
saved state.

**Signature**

```ts
export declare const save: () => Effect.Effect<never, never, Effect.Effect<never, never, void>>
```

Added in v1.0.0

## sleep

Semantically blocks the current fiber until the clock time is equal to or
greater than the specified duration. Once the clock time is adjusted to
on or after the duration, the fiber will automatically be resumed.

**Signature**

```ts
export declare const sleep: (duration: Duration.Duration) => Effect.Effect<never, never, void>
```

Added in v1.0.0
