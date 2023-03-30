import * as Chunk from "@effect/data/Chunk"
import * as Debug from "@effect/data/Debug"
import * as Either from "@effect/data/Either"
import * as Equal from "@effect/data/Equal"
import { constFalse, constVoid, identity, pipe } from "@effect/data/Function"
import * as Option from "@effect/data/Option"
import type { Predicate } from "@effect/data/Predicate"
import * as Effect from "@effect/io/Effect"
import * as Channel from "@effect/stream/Channel"
import * as ChildExecutorDecision from "@effect/stream/Channel/ChildExecutorDecision"
import * as UpstreamPullRequest from "@effect/stream/Channel/UpstreamPullRequest"
import * as UpstreamPullStrategy from "@effect/stream/Channel/UpstreamPullStrategy"
import * as Stream from "@effect/stream/Stream"
import type * as Sample from "@effect/test/Sample"

/** @internal */
const SampleSymbolKey = "@effect/test/Sample"

/** @internal */
export const SampleTypeId: Sample.SampleTypeId = Symbol.for(
  SampleSymbolKey
) as Sample.SampleTypeId

/** @internal */
const sampleVariance = {
  _R: (_: never) => _,
  _A: (_: never) => _
}

/** @internal */
class SampleImpl<R, A> implements Sample.Sample<R, A> {
  readonly [SampleTypeId] = sampleVariance
  constructor(
    readonly value: A,
    readonly shrink: Stream.Stream<R, never, Option.Option<Sample.Sample<R, A>>>
  ) {}
}

/** @internal */
export const filter = <A>(predicate: Predicate<A>) => {
  return <R>(self: Sample.Sample<R, A>): Stream.Stream<R, never, Option.Option<Sample.Sample<R, A>>> =>
    predicate(self.value) ?
      Stream.make(
        Option.some(
          new SampleImpl(
            self.value,
            pipe(
              self.shrink,
              Stream.flatMap((option) =>
                pipe(
                  option,
                  Option.map(filter(predicate)),
                  Option.getOrElse(() => Stream.empty)
                )
              )
            )
          )
        )
      ) :
      pipe(
        self.shrink,
        Stream.flatMap((option) =>
          pipe(
            option,
            Option.map(filter(predicate)),
            Option.getOrElse(() => Stream.empty)
          )
        )
      )
}

/** @internal */
export const flatMap = <A, R2, A2>(f: (a: A) => Sample.Sample<R2, A2>) => {
  return <R>(self: Sample.Sample<R, A>): Sample.Sample<R | R2, A2> => {
    const sample = f(self.value)
    return new SampleImpl(
      sample.value,
      pipe(
        sample.shrink,
        mergeStream(
          pipe(
            self.shrink,
            Stream.map((option) => pipe(option, Option.map(flatMap(f))))
          )
        )
      )
    )
  }
}

/**
 * @internal
 */
export const forEach: <A, R2, A2>(
  f: (a: A) => Effect.Effect<R2, never, A2>
) => <R>(self: Sample.Sample<R, A>) => Effect.Effect<R2 | R, never, Sample.Sample<R2 | R, A2>> = Debug
  .pipeableWithTrace((trace) =>
    <A, R2, A2>(f: (a: A) => Effect.Effect<R2, never, A2>) => {
      return <R>(self: Sample.Sample<R, A>): Effect.Effect<R | R2, never, Sample.Sample<R | R2, A2>> =>
        pipe(
          f(self.value),
          Effect.map((a2) =>
            new SampleImpl(
              a2,
              pipe(
                self.shrink,
                Stream.mapEffect((option) => pipe(option, Effect.forEachOption(forEach(f))))
              )
            )
          )
        ).traced(trace)
    }
  )

/** @internal */
export const map = <A, B>(f: (a: A) => B) => {
  return <R>(self: Sample.Sample<R, A>): Sample.Sample<R, B> =>
    new SampleImpl(
      f(self.value),
      pipe(
        self.shrink,
        Stream.map((option) => pipe(option, Option.map(map(f))))
      )
    )
}

/** @internal */
export const noShrink = <A>(value: A): Sample.Sample<never, A> => new SampleImpl(value, Stream.empty)

/** @internal */
export const shrinkBigInt = (smallest: bigint) => {
  return (value: bigint): Sample.Sample<never, bigint> =>
    unfold(value, (max) => [
      max,
      Stream.unfold(smallest, (min) => {
        const mid = min + (max - min) / BigInt(2)
        if (mid === max) {
          return Option.none()
        } else if (bigIntAbs(max - mid) === BigInt(1)) {
          return Option.some([mid, max])
        } else {
          return Option.some([mid, mid])
        }
      })
    ])
}

/** @internal */
const bigIntAbs = (x: bigint): bigint => x < BigInt(0) ? -x : x

/** @internal */
export const shrinkFractional = (smallest: number) => {
  return (value: number): Sample.Sample<never, number> =>
    unfold(value, (max) => [
      max,
      Stream.unfold(smallest, (min) => {
        const mid = min + (max - min) / 2
        if (mid === max) {
          return Option.none()
        } else if (Math.abs(max - mid) < 0.001) {
          return Option.some([min, max])
        } else {
          return Option.some([mid, mid])
        }
      })
    ])
}

/** @internal */
export const shrinkIntegral = (smallest: number) => {
  return (value: number): Sample.Sample<never, number> =>
    unfold(value, (max) => [
      max,
      Stream.unfold(smallest, (min) => {
        const mid = min + ((max - min) / 2 | 0)
        if (mid === max) {
          return Option.none()
        } else if (Math.abs(max - mid) === 1) {
          return Option.some([mid, max])
        } else {
          return Option.some([mid, mid])
        }
      })
    ])
}

/** @internal */
export const shrinkSearch = <A>(predicate: Predicate<A>) => {
  return <R>(self: Sample.Sample<R, A>): Stream.Stream<R, never, A> =>
    predicate(self.value) ?
      Stream.make(self.value) :
      pipe(
        Stream.make(self.value),
        Stream.concat(
          pipe(
            self.shrink,
            Stream.takeUntil((option) =>
              pipe(
                option,
                Option.match(constFalse, (sample) => predicate(sample.value))
              )
            ),
            Stream.flatMap((option) =>
              pipe(
                option,
                Option.map(shrinkSearch(predicate)),
                Option.getOrElse(() => Stream.empty)
              )
            )
          )
        )
      )
}

/** @internal */
export const unfold = <S, A, R>(
  start: S,
  f: (s: S) => readonly [A, Stream.Stream<R, never, S>]
): Sample.Sample<R, A> => {
  const [value, shrink] = f(start)
  return new SampleImpl(
    value,
    pipe(shrink, Stream.map((s) => Option.some(unfold(s, f))), Stream.intersperse(Option.none()))
  )
}

/** @internal */
export const zip = <R2, A2>(that: Sample.Sample<R2, A2>) => {
  return <R, A>(self: Sample.Sample<R, A>): Sample.Sample<R | R2, readonly [A, A2]> =>
    pipe(self, zipWith(that, (a, a2) => [a, a2]))
}

/** @internal */
export function zipFlatten<R2, A2>(that: Sample.Sample<R2, A2>) {
  return <R, A extends ReadonlyArray<any>>(
    self: Sample.Sample<R, A>
  ): Sample.Sample<R | R2, readonly [...A, A2]> => pipe(self, zipWith(that, (a, b) => [...a, b]))
}

/** @internal */
export const zipWith = <R2, A2, A, A3>(that: Sample.Sample<R2, A2>, f: (a: A, a2: A2) => A3) => {
  return <R>(self: Sample.Sample<R, A>): Sample.Sample<R | R2, A3> =>
    pipe(self, flatMap((a) => pipe(that, map((b) => f(a, b)))))
}

/**
 * An implementation of `Stream.merge` that supports breadth first search.
 *
 * @internal
 */
const mergeStream = <R2, A2>(that: Stream.Stream<R2, never, Option.Option<A2>>) => {
  return <R, A>(self: Stream.Stream<R, never, Option.Option<A>>): Stream.Stream<R | R2, never, Option.Option<A | A2>> =>
    pipe(
      Stream.fromIterable<Option.Option<Stream.Stream<R | R2, never, Option.Option<A | A2>>>>([
        Option.some(self),
        Option.some(that)
      ]),
      flatMapStream(identity)
    )
}

/** @internal */
const flatMapStream = <A, R2, A2>(f: (a: A) => Stream.Stream<R2, never, Option.Option<A2>>) => {
  return <R>(self: Stream.Stream<R, never, Option.Option<A>>): Stream.Stream<R | R2, never, Option.Option<A2>> =>
    pipe(
      Stream.rechunk(1)(self).channel,
      Channel.concatMapWithCustom(
        (chunk) =>
          pipe(
            chunk,
            Chunk.map(Option.match(
              () => Stream.make(Either.left(false)).channel,
              (a) =>
                pipe(
                  f(a),
                  Stream.rechunk(1),
                  Stream.map(Option.match(
                    () => Either.left(true),
                    Either.right
                  ))
                ).channel
            )),
            Chunk.reduce(
              Channel.unit() as Channel.Channel<
                R2,
                unknown,
                unknown,
                unknown,
                never,
                Chunk.Chunk<Either.Either<boolean, A2>>,
                unknown
              >,
              (acc, curr) => pipe(acc, Channel.zipRight(curr))
            )
          ),
        constVoid,
        constVoid,
        UpstreamPullRequest.match(
          (chunk) =>
            pipe(
              Chunk.head(chunk),
              Option.flatten,
              Option.match(
                () => UpstreamPullStrategy.PullAfterAllEnqueued(Option.none()),
                () => UpstreamPullStrategy.PullAfterNext(Option.none())
              )
            ),
          (activeDownstreamCount) =>
            UpstreamPullStrategy.PullAfterAllEnqueued<Chunk.Chunk<Either.Either<boolean, A2>>>(
              activeDownstreamCount > 0 ?
                Option.some(Chunk.of(Either.left(false))) :
                Option.none()
            )
        ),
        (chunk) =>
          pipe(
            Chunk.head(chunk),
            Option.match(
              () => ChildExecutorDecision.Continue(),
              (either) =>
                Equal.equals(Either.left(true))(either) ?
                  ChildExecutorDecision.Yield() :
                  ChildExecutorDecision.Continue()
            )
          )
      ),
      Stream.fromChannel,
      Stream.filter((either) => !Equal.equals(Either.left(true))(either)),
      Stream.map(Either.match(() => Option.none(), Option.some))
    )
}
