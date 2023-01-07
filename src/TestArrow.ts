/**
 * @since 1.0.0
 */
import type * as Assertion from "@effect/test/Assertion"
import type * as GenFailureDetails from "@effect/test/GenFailureDetails"
import * as internal from "@effect/test/internal/testArrow"
import type * as TestTrace from "@effect/test/TestTrace"
import type * as Either from "@fp-ts/data/Either"
import type { LazyArg } from "@fp-ts/data/Function"
import type * as Option from "@fp-ts/data/Option"

/**
 * @since 1.0.0
 * @category symbols
 */
export const TestArrowTypeId: unique symbol = internal.TestArrowTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type TestArrowTypeId = typeof TestArrowTypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface TestArrow<A, B> extends TestArrow.Variance<A, B> {}

/**
 * @since 1.0.0
 */
export declare namespace TestArrow {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Variance<A, B> {
    readonly [TestArrowTypeId]: {
      readonly _A: (_: A) => void
      readonly _B: (_: never) => B
    }
  }

  /**
   * @since 1.0.0
   * @category models
   */
  export interface Span {
    readonly start: number
    readonly end: number
  }
}

/**
 * @since 1.0.0
 * @category mutations
 */
export const andThen: <B, C>(that: TestArrow<B, C>) => <A>(self: TestArrow<A, B>) => TestArrow<A, C> = internal.andThen

/**
 * @since 1.0.0
 * @category constructors
 */
export const meta: (
  params?: Partial<{
    span: Option.Option<TestArrow.Span>
    parentSpan: Option.Option<TestArrow.Span>
    code: Option.Option<string>
    location: Option.Option<string>
    completeCode: Option.Option<string>
    customLabel: Option.Option<string>
    genFailureDetails: Option.Option<GenFailureDetails.GenFailureDetails>
  }>
) => <A, B>(self: TestArrow<A, B>) => TestArrow<A, B> = internal.meta

/**
 * @since 1.0.0
 * @category destructors
 */
export const run: <A>(input: Either.Either<unknown, A>) => <B>(self: TestArrow<A, B>) => TestTrace.TestTrace<B> =
  internal.run

/**
 * @since 1.0.0
 * @category mutations
 */
export const setGenFailureDetails: (
  details: GenFailureDetails.GenFailureDetails<unknown>
) => <A, B>(self: TestArrow<A, B>) => TestArrow<A, B> = internal.setGenFailureDetails

/**
 * @since 1.0.0
 * @category mutations
 */
export const span: (span: readonly [start: number, end: number]) => <A, B>(self: TestArrow<A, B>) => TestArrow<A, B> =
  internal.span

/**
 * @since 1.0.0
 * @category constructors
 */
export const succeed: <A>(value: A) => TestArrow<unknown, A> = internal.succeed

/**
 * @since 1.0.0
 * @category constructors
 */
export const sync: <A>(evaluate: LazyArg<A>) => TestArrow<unknown, A> = internal.sync

/**
 * @since 1.0.0
 * @category mutations
 */
export const withCode: (
  code: string,
  ...args: Array<Assertion.Assertion.Arguments>
) => <A, B>(self: TestArrow<A, B>) => TestArrow<A, B> = internal.withCode

/**
 * @since 1.0.0
 * @category mutations
 */
export const withCompleteCode: (completeCode: string) => <A, B>(self: TestArrow<A, B>) => TestArrow<A, B> =
  internal.withCompleteCode

/**
 * @since 1.0.0
 * @category mutations
 */
export const withParentSpan: (
  span: readonly [start: number, end: number]
) => <A, B>(self: TestArrow<A, B>) => TestArrow<A, B> = internal.withParentSpan
