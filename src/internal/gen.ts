import * as Cause from "@effect/io/Cause"
import * as Effect from "@effect/io/Effect"
import * as FiberRef from "@effect/io/FiberRef"
import * as testServices from "@effect/io/internal/testing/testServices"
import * as Random from "@effect/io/Random"
import * as Stream from "@effect/stream/Stream"
import type * as Gen from "@effect/test/Gen"
import * as _sample from "@effect/test/internal/sample"
import { flatMapStream } from "@effect/test/internal/stream-utils"
import type { NonEmptyArrayGen, TupleGen } from "@effect/test/internal/types"
import type * as Sample from "@effect/test/Sample"
import type * as Sized from "@effect/test/Sized"
import { pipe } from "@fp-ts/data/Function"
import * as Number from "@fp-ts/data/Number"
import * as Option from "@fp-ts/data/Option"
import * as SortedMap from "@fp-ts/data/SortedMap"

/** @internal */
const GenSymbolKey = "@effect/test/Gen"

/** @internal */
export const GenTypeId: Gen.GenTypeId = Symbol.for(
  GenSymbolKey
) as Gen.GenTypeId

/** @internal */
const genVariance = {
  _R: (_: never) => _,
  _A: (_: never) => _
}

/** @internal */
class GenImpl<R, A> implements Gen.Gen<R, A> {
  readonly [GenTypeId] = genVariance
  constructor(
    readonly sample: Stream.Stream<R, never, Option.Option<Sample.Sample<R, A>>>
  ) {}
}

/** @internal */
export const isGen = (u: unknown): u is Gen.Gen<unknown, unknown> =>
  typeof u === "object" && u != null && GenTypeId in u

/** @internal */
export const constant = <A>(value: A): Gen.Gen<never, A> =>
  new GenImpl(Stream.succeed(Option.some(_sample.noShrink(value))))

/** @internal */
export const constantSample = <R, A>(sample: Sample.Sample<R, A>): Gen.Gen<R, A> =>
  fromEffectSample(Effect.succeed(sample))

/** @internal */
export const flatMap = <A, R2, A2>(f: (a: A) => Gen.Gen<R2, A2>) => {
  return <R>(self: Gen.Gen<R, A>): Gen.Gen<R | R2, A2> =>
    new GenImpl(
      pipe(
        self.sample,
        flatMapStream((sample) => {
          const values = f(sample.value).sample
          const shrinks = pipe(new GenImpl(sample.shrink), flatMap(f)).sample
          return pipe(
            values,
            Stream.map((option) =>
              pipe(
                option,
                Option.map(_sample.flatMap((a2) => _sample.make(a2, shrinks)))
              )
            )
          )
        })
      )
    )
}

/** @internal */
export const fromEffect = <R, A>(effect: Effect.Effect<R, never, A>): Gen.Gen<R, A> =>
  fromEffectSample(pipe(effect, Effect.map(_sample.noShrink)))

/** @internal */
export const fromEffectSample = <R, A>(effect: Effect.Effect<R, never, Sample.Sample<R, A>>): Gen.Gen<R, A> =>
  new GenImpl(Stream.fromEffect(Effect.asSome(effect)))

/** @internal */
export const integer = (constraints: Gen.Gen.IntegerConstraints = {}): Gen.Gen<never, number> =>
  fromEffectSample(Effect.suspendSucceed(() => {
    const min = constraints.min ?? -0x80000000
    const max = constraints.min ?? 0x7fffffff
    if (min > max) {
      return Effect.die(Cause.IllegalArgumentException("Invalid bounds"))
    }
    return pipe(
      Random.nextIntBetween(min, max),
      Effect.map(_sample.shrinkIntegral(min))
    )
  }))

/** @internal */
export const map = <A, B>(f: (a: A) => B) => {
  return <R>(self: Gen.Gen<R, A>): Gen.Gen<R, B> =>
    new GenImpl(pipe(self.sample, Stream.map(Option.map(_sample.map(f)))))
}

/** @internal */
export const uniform = (): Gen.Gen<never, number> =>
  fromEffectSample(pipe(Random.next(), Effect.map(_sample.shrinkFractional(0))))

/** @internal */
export const weighted = <R, A>(...gens: Array<readonly [Gen.Gen<R, A>, number]>): Gen.Gen<R, A> => {
  const sum = gens.map(([, weight]) => weight).reduce((b, a) => b + a, 0)
  const [map] = gens.reduce(
    ([map, acc], [gen, n]) => {
      if ((acc + n) / sum > acc / sum) {
        return [pipe(map, SortedMap.set((acc + n) / sum, gen)), acc + n] as const
      }
      return [map, acc] as const
    },
    [SortedMap.empty<number, Gen.Gen<R, A>>(Number.Order), 0 as number] as const
  )
  return pipe(
    uniform(),
    flatMap((n) =>
      pipe(
        sortedMapGetGte(map, n),
        Option.getOrElse(() => {
          throw Cause.NoSuchElementException(
            "BUG: Gen.weighted - please report an issue at https://github.com/Effect-TS/test/issues"
          )
        })
      )
    )
  )
}

// TODO(Mike/Max): consider adding this to `@fp-ts/data`
/** @internal */
const sortedMapGetGte = <K, V>(map: SortedMap.SortedMap<K, V>, key: K): Option.Option<V> => {
  const cmp = SortedMap.getOrder(map).compare
  let node = (map as any).tree.root
  let lastValue: Option.Option<V> = Option.none
  while (node) {
    const d = cmp(node.key)(key)
    if (d <= 0) {
      lastValue = Option.some(node.value)
      node = node.left
    } else {
      if (lastValue._tag === "Some") {
        break
      }
      node = node.right
    }
  }
  return lastValue
}

/** @internal */
export const tuple = <T extends NonEmptyArrayGen>(
  ...tuple: T
): Gen.Gen<
  [T[number]] extends [{ [GenTypeId]: { _R: (_: never) => infer R } }] ? R : never,
  TupleGen<T>
> => {
  let result = pipe(tuple[0])
  const rest = tuple.slice(1)
  let isFirst = true
  for (const gen of rest) {
    if (isFirst) {
      result = pipe(result, zip(gen))
      isFirst = false
    } else {
      result = pipe(result, zipFlatten(gen))
    }
  }
  return result as any
}

/** @internal */
export const zip = <R2, A2>(that: Gen.Gen<R2, A2>) => {
  return <R, A>(self: Gen.Gen<R, A>): Gen.Gen<R | R2, readonly [A, A2]> => pipe(self, zipWith(that, (a, a2) => [a, a2]))
}

/** @internal */
export const zipFlatten = <R2, A2>(that: Gen.Gen<R2, A2>) => {
  return <R, A extends ReadonlyArray<any>>(self: Gen.Gen<R, A>): Gen.Gen<R | R2, readonly [...A, A2]> =>
    pipe(self, zipWith(that, (a, a2) => [...a, a2]))
}

/** @internal */
export const zipLeft = <R2, A2>(that: Gen.Gen<R2, A2>) => {
  return <R, A>(self: Gen.Gen<R, A>): Gen.Gen<R | R2, A> => pipe(self, zipWith(that, (a) => a))
}

/** @internal */
export const zipRight = <R2, A2>(that: Gen.Gen<R2, A2>) => {
  return <R, A>(self: Gen.Gen<R, A>): Gen.Gen<R | R2, A2> => pipe(self, zipWith(that, (_, a2) => a2))
}

/** @internal */
export const zipWith = <R2, A2, A, A3>(that: Gen.Gen<R2, A2>, f: (a: A, a2: A2) => A3) => {
  return <R>(self: Gen.Gen<R, A>): Gen.Gen<R | R2, A3> => pipe(self, flatMap((a) => pipe(that, map((a2) => f(a, a2)))))
}

// Circular with Sized

/** @internal */
export const withSizeGen = (size: number) => {
  return <R, A>(self: Gen.Gen<R, A>): Gen.Gen<R, A> =>
    pipe(
      fromEffect<never, Sized.Sized>(testServices.sized() as any),
      flatMap((sized) =>
        new GenImpl(
          pipe(
            Stream.fromEffect(FiberRef.get(sized.fiberRef)),
            Stream.flatMap((oldSize) =>
              pipe(
                Stream.scoped(FiberRef.locallyScoped(sized.fiberRef)(size)),
                Stream.crossRight(
                  pipe(
                    self.sample,
                    Stream.mapEffect((option) =>
                      pipe(
                        oldSize,
                        FiberRef.set(sized.fiberRef),
                        Effect.as(option)
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
}
