import * as Channel from "@effect/stream/Channel"
import * as ChildExecutorDecision from "@effect/stream/Channel/ChildExecutorDecision"
import * as UpstreamPullRequest from "@effect/stream/Channel/UpstreamPullRequest"
import * as UpstreamPullStrategy from "@effect/stream/Channel/UpstreamPullStrategy"
import * as Stream from "@effect/stream/Stream"
import * as Chunk from "@fp-ts/data/Chunk"
import * as Either from "@fp-ts/data/Either"
import * as Equal from "@fp-ts/data/Equal"
import { constVoid, identity, pipe } from "@fp-ts/data/Function"
import * as Option from "@fp-ts/data/Option"

/** @internal */
export const flatMapStream = <A, R2, A2>(f: (a: A) => Stream.Stream<R2, never, Option.Option<A2>>) => {
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
                () => UpstreamPullStrategy.PullAfterAllEnqueued(Option.none),
                () => UpstreamPullStrategy.PullAfterNext(Option.none)
              )
            ),
          (activeDownstreamCount) =>
            UpstreamPullStrategy.PullAfterAllEnqueued<Chunk.Chunk<Either.Either<boolean, A2>>>(
              activeDownstreamCount > 0 ?
                Option.some(Chunk.of(Either.left(false))) :
                Option.none
            )
        ),
        (chunk) =>
          pipe(
            Chunk.head(chunk),
            Option.match(
              () => ChildExecutorDecision.Continue,
              (either) =>
                Equal.equals(Either.left(true))(either) ?
                  ChildExecutorDecision.Yield :
                  ChildExecutorDecision.Continue
            )
          )
      ),
      Stream.fromChannel,
      Stream.filter((either) => !Equal.equals(Either.left(true))(either)),
      Stream.map(Either.match(() => Option.none, Option.some))
    )
}

/**
 * An implementation of `Stream.merge` that supports breadth first search.
 *
 * @internal
 */
export const mergeStream = <R2, A2>(that: Stream.Stream<R2, never, Option.Option<A2>>) => {
  return <R, A>(self: Stream.Stream<R, never, Option.Option<A>>): Stream.Stream<R | R2, never, Option.Option<A | A2>> =>
    pipe(
      Stream.fromIterable<Option.Option<Stream.Stream<R | R2, never, Option.Option<A | A2>>>>([
        Option.some(self),
        Option.some(that)
      ]),
      flatMapStream(identity)
    )
}
