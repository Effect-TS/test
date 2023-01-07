/**
 * @since 1.0.0
 */
import type * as GenFailureDetails from "@effect/test/GenFailureDetails"
import * as internal from "@effect/test/internal/testTrace"
import type * as Result from "@effect/test/Result"
import type * as TestArrow from "@effect/test/TestArrow"
import type * as Chunk from "@fp-ts/data/Chunk"
import type { LazyArg } from "@fp-ts/data/Function"
import type * as Option from "@fp-ts/data/Option"

/**
 * @since 1.0.0
 * @category symbols
 */
export const TestTraceTypeId: unique symbol = internal.TestTraceTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type TestTraceTypeId = typeof TestTraceTypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface TestTrace<A> extends TestTrace.Variance<A> {
  result(): Result.Result<A>
}

/**
 * @since 1.0.0
 */
export declare namespace TestTrace {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Variance<A> {
    readonly [TestTraceTypeId]: {
      readonly _A: (_: never) => A
    }
  }
}

/**
 * @since 1.0.0
 * @category mutations
 */
export const annotate: (...annotations: Array<string>) => <A>(self: TestTrace<A>) => TestTrace<A> = internal.annotate

/**
 * @since 1.0.0
 * @category constructors
 */
export const boolean = internal.boolean

/**
 * @since 1.0.0
 * @category constructors
 */
export const die: (defect: unknown) => TestTrace<never> = internal.die

/**
 * Returns `true` if the `TestTrace` contains a die result, `false` otherwise.
 *
 * @since 1.0.0
 * @category getters
 */
export const isDie: <A>(self: TestTrace<A>) => boolean = internal.isDie

/**
 * Prune all non-failures from the trace.
 *
 * @since 1.0.0
 * @category mutations
 */
export const prune: (negated: boolean) => (self: TestTrace<boolean>) => Option.Option<TestTrace<boolean>> =
  internal.prune

/**
 * Constructs a successful `TestTrace` from the specified value.
 *
 * @since 1.0.0
 * @category constructors
 */
export const succeed: <A>(value: A) => TestTrace<A> = internal.succeed

/**
 * Constructs a successful `TestTrace` from the specified lazily-evaluated
 * value.
 *
 * @since 1.0.0
 * @category constructors
 */
export const sync: <A>(evaluate: LazyArg<A>) => TestTrace<A> = internal.sync

/**
 * @since 1.0.0
 * @category getters
 */
export const values: <A>(self: TestTrace<A>) => Chunk.Chunk<unknown> = internal.values

/**
 * Apply the code to every node in the tree.
 *
 * @since 1.0.0
 * @category mutations
 */
export const withCode: (fullCode: Option.Option<string>) => <A>(self: TestTrace<A>) => TestTrace<A> = internal.withCode

/**
 * Apply the code to every node in the tree.
 *
 * @since 1.0.0
 * @category mutations
 */
export const withCompleteCode: (completeCode: Option.Option<string>) => <A>(self: TestTrace<A>) => TestTrace<A> =
  internal.withCompleteCode

/**
 * Apply a custom label to every node in the trace.
 *
 * @since 1.0.0
 * @category mutations
 */
export const withCustomLabel: (customLabel: Option.Option<string>) => <A>(self: TestTrace<A>) => TestTrace<A> =
  internal.withCustomLabel

/**
 * Apply the failure details to every node in the tree.
 *
 * @since 1.0.0
 * @category mutations
 */
export const withGenFailureDetails: (
  genFailureDetails: Option.Option<GenFailureDetails.GenFailureDetails<unknown>>
) => <A>(self: TestTrace<A>) => TestTrace<A> = internal.withGenFailureDetails

/**
 * Apply the location to every node in the tree.
 *
 * @since 1.0.0
 * @category mutations
 */
export const withLocation: (location: Option.Option<string>) => <A>(self: TestTrace<A>) => TestTrace<A> =
  internal.withLocation

/**
 * Apply the parent span to every node in the tree.
 *
 * @since 1.0.0
 * @category mutations
 */
export const withParentSpan: (
  span: Option.Option<TestArrow.TestArrow.Span>
) => <A>(self: TestTrace<A>) => TestTrace<A> = internal.withParentSpan

/**
 * Apply the metadata to the rightmost node in the trace.
 *
 * @since 1.0.0
 * @category mutations
 */
export const withSpan: (span?: Option.Option<TestArrow.TestArrow.Span>) => <A>(self: TestTrace<A>) => TestTrace<A> =
  internal.withSpan
