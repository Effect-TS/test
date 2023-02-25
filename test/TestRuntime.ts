import * as Duration from "@effect/data/Duration"
import { pipe } from "@effect/data/Function"
import * as Option from "@effect/data/Option"
import * as Effect from "@effect/io/Effect"
import * as Fiber from "@effect/io/Fiber"
import * as TestRuntime from "@effect/test/Runtime"
import * as TestClock from "@effect/test/TestClock"
import { assert, describe, it } from "vitest"

describe.concurrent("TestRuntime", () => {
  it("should use TestClock", () =>
    TestRuntime.runPromise(Effect.gen(function*($) {
      const fiber = yield* $(pipe(
        Effect.sleep(Duration.minutes(5)),
        Effect.timeout(Duration.minutes(1)),
        Effect.fork
      ))
      yield* $(TestClock.adjust(Duration.minutes(1)))
      const result = yield* $(Fiber.join(fiber))
      assert.deepStrictEqual(result, Option.none())
    })))
})
