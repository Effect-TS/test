/**
 * @since 1.0.0
 */
import type * as GenFailureDetails from "@effect/test/GenFailureDetails"
import * as internal from "@effect/test/internal/testResult"
import type * as TestArrow from "@effect/test/TestArrow"
import type * as TestTrace from "@effect/test/TestTrace"
import type * as Option from "@fp-ts/data/Option"

/**
 * @since 1.0.0
 * @category symbols
 */
export const TestResultTypeId: unique symbol = internal.TestResultTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type TestResultTypeId = typeof TestResultTypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface TestResult extends TestResult.Proto {
  readonly arrow: TestArrow.TestArrow<unknown, boolean>
}

/**
 * @since 1.0.0
 */
export declare namespace TestResult {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Proto {
    readonly [TestResultTypeId]: TestResultTypeId
  }
}

/**
 * @since 1.0.0
 * @category getters
 */
export const failures: (self: TestResult) => Option.Option<TestTrace.TestTrace<boolean>> = internal.failures

/**
 * @since 1.0.0
 * @category getters
 */
export const isFailure: (self: TestResult) => boolean = internal.isFailure

/**
 * @since 1.0.0
 * @category getters
 */
export const isSuccess: (self: TestResult) => boolean = internal.isSuccess

/**
 * @since 1.0.0
 * @category constructors
 */
export const make: (arrow: TestArrow.TestArrow<unknown, boolean>) => TestResult = internal.make

/**
 * @since 1.0.0
 * @category getters
 */
export const result: (self: TestResult) => TestTrace.TestTrace<boolean> = internal.result

/**
 * @since 1.0.0
 * @category mutations
 */
export const setGenFailureDetails: (
  details: GenFailureDetails.GenFailureDetails<unknown>
) => (self: TestResult) => TestResult = internal.setGenFailureDetails
