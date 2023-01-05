import * as Effect from "@effect/io/Effect"
import * as Stream from "@effect/stream/Stream"
import * as Sample from "@effect/test/Sample"
import * as it from "@effect/test/test/utils/extend"
import * as Equal from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"
import * as Option from "@fp-ts/data/Option"
import { assert, describe } from "vitest"

const equalEffects = <A, B>(
  left: Effect.Effect<never, never, Sample.Sample<never, A>>,
  right: Effect.Effect<never, never, Sample.Sample<never, B>>
): Effect.Effect<never, never, boolean> =>
  pipe(left, Effect.flatMap((a) => pipe(right, Effect.flatMap((b) => equalSamples(a, b)))))

const equalSamples = <A, B>(
  left: Sample.Sample<never, A>,
  right: Sample.Sample<never, B>
): Effect.Effect<never, never, boolean> =>
  Equal.equals(left.value, right.value) ? equalShrinks(left.shrink, right.shrink) : Effect.succeed(false)

const equalShrinks = <A, B>(
  left: Stream.Stream<never, never, Option.Option<Sample.Sample<never, A>>>,
  right: Stream.Stream<never, never, Option.Option<Sample.Sample<never, B>>>
): Effect.Effect<never, never, boolean> =>
  pipe(
    left,
    Stream.zip(right),
    Stream.mapEffect(([left, right]) => {
      if (Option.isSome(left) && Option.isSome(right)) {
        return equalSamples(left.value, right.value)
      }
      if (Option.isNone(left) && Option.isNone(right)) {
        return Effect.succeed(true)
      }
      return Effect.succeed(false)
    }),
    Stream.runFold(true, (x, y) => x && y)
  )

describe.concurrent("Sample", () => {
  it.effect("monad left identity", () =>
    Effect.gen(function*($) {
      const sample1 = Sample.shrinkIntegral(0)(2)
      const sample2 = pipe(sample1, Sample.flatMap(Sample.noShrink))
      const result = yield* $(equalSamples(sample1, sample2))
      assert.isTrue(result)
    }), 10_000)

  it.effect("monad right identity", () =>
    Effect.gen(function*($) {
      const n = 2
      const f = (n: number): Sample.Sample<never, number> => Sample.shrinkIntegral(0)(n)
      const sample1 = pipe(Sample.noShrink(n), Sample.flatMap(f))
      const sample2 = f(n)
      const result = yield* $(equalSamples(sample1, sample2))
      assert.isTrue(result)
    }), 10_000)

  it.effect("monad associativity", () =>
    Effect.gen(function*($) {
      const sample = Sample.shrinkIntegral(0)(2)
      const f = (n: number): Sample.Sample<never, number> => Sample.shrinkIntegral(0)(n + 1)
      const g = (n: number): Sample.Sample<never, number> => Sample.shrinkIntegral(0)(n + 2)
      const sample1 = pipe(sample, Sample.flatMap(f), Sample.flatMap(g))
      const sample2 = pipe(sample, Sample.flatMap((a) => pipe(f(a), Sample.flatMap(g))))
      const result = yield* $(equalSamples(sample1, sample2))
      assert.isTrue(result)
    }), 10_000)

  it.effect("traverse fusion", () =>
    Effect.gen(function*($) {
      const sample = Sample.shrinkIntegral(0)(2)
      const f = (n: number): Effect.Effect<never, never, number> => Effect.succeed(n + 1)
      const g = (n: number): Effect.Effect<never, never, number> => Effect.succeed(n + 2)
      const sample1 = pipe(sample, Sample.forEach((a) => pipe(f(a), Effect.flatMap(g))))
      const sample2 = pipe(sample, Sample.forEach(f), Effect.flatMap(Sample.forEach(g)))
      const result = yield* $(equalEffects(sample1, sample2))
      assert.isTrue(result)
    }), 10_000)
})
