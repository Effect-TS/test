import type * as GenFailureDetails from "@effect/test/GenFailureDetails"
import * as testArrow from "@effect/test/internal/testArrow"
import * as testTrace from "@effect/test/internal/testTrace"
import type * as TestArrow from "@effect/test/TestArrow"
import type * as TestResult from "@effect/test/TestResult"
import type * as TestTrace from "@effect/test/TestTrace"
import * as Either from "@fp-ts/data/Either"
import * as Option from "@fp-ts/data/Option"

/** @internal */
const TestResultSymbolKey = "@effect/test/TestResult"

/** @internal */
export const TestResultTypeId: TestResult.TestResultTypeId = Symbol.for(
  TestResultSymbolKey
) as TestResult.TestResultTypeId

/** @internal */
class TestResultImpl implements TestResult.TestResult {
  readonly [TestResultTypeId]: TestResult.TestResultTypeId = TestResultTypeId
  constructor(readonly arrow: TestArrow.TestArrow<unknown, boolean>) {}
}

/** @internal */
export const failures = (self: TestResult.TestResult): Option.Option<TestTrace.TestTrace<boolean>> =>
  testTrace.prune(false)(result(self))

/** @internal */
export const isFailure = (self: TestResult.TestResult): boolean => Option.isSome(failures(self))

/** @internal */
export const isSuccess = (self: TestResult.TestResult): boolean => Option.isNone(failures(self))

/** @internal */
export const make = (arrow: TestArrow.TestArrow<unknown, boolean>): TestResult.TestResult => new TestResultImpl(arrow)

/** @internal */
export const result = (self: TestResult.TestResult): TestTrace.TestTrace<boolean> =>
  testArrow.run(Either.right(void 0))(self.arrow)

/** @internal */
export const setGenFailureDetails = (details: GenFailureDetails.GenFailureDetails) => {
  return (self: TestResult.TestResult): TestResult.TestResult =>
    new TestResultImpl(testArrow.setGenFailureDetails(details)(self.arrow))
}
