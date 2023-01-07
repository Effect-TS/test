import type * as Assertion from "@effect/test/Assertion"
import type * as GenFailureDetails from "@effect/test/GenFailureDetails"
import * as OpCodes from "@effect/test/internal/opCodes/testArrow"
import * as testTrace from "@effect/test/internal/testTrace"
import type * as TestArrow from "@effect/test/TestArrow"
import type * as TestTrace from "@effect/test/TestTrace"
import * as Either from "@fp-ts/data/Either"
import type { LazyArg } from "@fp-ts/data/Function"
import { pipe } from "@fp-ts/data/Function"
import * as Option from "@fp-ts/data/Option"

/** @internal */
const TestArrowSymbolKey = "@effect/test/TestArrow"

/** @internal */
export const TestArrowTypeId: TestArrow.TestArrowTypeId = Symbol.for(
  TestArrowSymbolKey
) as TestArrow.TestArrowTypeId

/** @internal */
const proto = {
  [TestArrowTypeId]: {
    _A: (_: unknown) => _,
    _B: (_: never) => _
  }
}

/** @internal */
export type Primitive =
  | And
  | AndThen
  | Meta
  | Not
  | Or
  | Suspend
  | TestArrowF

/** @internal */
export type Op<Tag extends string, Body = {}> = TestArrow.TestArrow<unknown, never> & Body & {
  readonly _tag: Tag
}

/** @internal */
export interface And extends
  Op<OpCodes.OP_AND, {
    readonly left: TestArrow.TestArrow<unknown, boolean>
    readonly right: TestArrow.TestArrow<unknown, boolean>
  }>
{}

/** @internal */
export interface AndThen extends
  Op<OpCodes.OP_AND_THEN, {
    readonly f: TestArrow.TestArrow<unknown, never>
    readonly g: TestArrow.TestArrow<unknown, never>
  }>
{}

/** @internal */
export interface Meta extends
  Op<OpCodes.OP_META, {
    readonly params: {
      readonly arrow: TestArrow.TestArrow<unknown, never>
      readonly span: Option.Option<TestArrow.TestArrow.Span>
      readonly parentSpan: Option.Option<TestArrow.TestArrow.Span>
      readonly code: Option.Option<string>
      readonly location: Option.Option<string>
      readonly completeCode: Option.Option<string>
      readonly customLabel: Option.Option<string>
      readonly genFailureDetails: Option.Option<GenFailureDetails.GenFailureDetails>
    }
  }>
{}

/** @internal */
export interface Not extends
  Op<OpCodes.OP_NOT, {
    readonly arrow: TestArrow.TestArrow<unknown, boolean>
  }>
{}

/** @internal */
export interface Or extends
  Op<OpCodes.OP_OR, {
    readonly left: TestArrow.TestArrow<unknown, boolean>
    readonly right: TestArrow.TestArrow<unknown, boolean>
  }>
{}

/** @internal */
export interface TestArrowF extends
  Op<OpCodes.OP_TEST_ARROW_F, {
    readonly f: (either: Either.Either<unknown, unknown>) => TestTrace.TestTrace<never>
  }>
{}

/** @internal */
export interface Suspend extends
  Op<OpCodes.OP_SUSPEND, {
    readonly f: (value: unknown) => TestArrow.TestArrow<unknown, never>
  }>
{}

/** @internal */
const Meta = <A, B>(params: {
  arrow: TestArrow.TestArrow<A, B>
  span: Option.Option<TestArrow.TestArrow.Span>
  parentSpan: Option.Option<TestArrow.TestArrow.Span>
  code: Option.Option<string>
  location: Option.Option<string>
  completeCode: Option.Option<string>
  customLabel: Option.Option<string>
  genFailureDetails: Option.Option<GenFailureDetails.GenFailureDetails>
}): TestArrow.TestArrow<A, B> =>
  Object.create(proto, {
    _tag: { value: OpCodes.OP_META, enumerable: true },
    params: { value: params, enumerable: true }
  })

/** @internal */
const TestArrowF = <A, B>(
  f: (either: Either.Either<unknown, A>) => TestTrace.TestTrace<B>
): TestArrow.TestArrow<A, B> =>
  Object.create(proto, {
    _tag: { value: OpCodes.OP_TEST_ARROW_F, enumerable: true },
    f: { value: f, enumerable: true }
  })

/** @internal */
const attempt = <A>(evaluate: LazyArg<TestTrace.TestTrace<A>>): TestTrace.TestTrace<A> => {
  try {
    return evaluate()
  } catch (error) {
    // TODO(Mike/Max): implement
    return testTrace.die(error)
  }
}

/** @internal */
export const andThen = <B, C>(that: TestArrow.TestArrow<B, C>) => {
  return <A>(self: TestArrow.TestArrow<A, B>): TestArrow.TestArrow<A, C> =>
    Object.create(proto, {
      _tag: { value: OpCodes.OP_AND_THEN, enumerable: true },
      f: { value: self, enumerable: true },
      g: { value: that, enumerable: true }
    })
}

/** @internal */
export const make = <A, B>(f: (a: A) => TestTrace.TestTrace<B>): TestArrow.TestArrow<A, B> =>
  makeEither((defect) => pipe(testTrace.die(defect), testTrace.annotate("Rethrow")), f)

/** @internal */
export const makeEither = <A, B>(
  onFail: (defect: unknown) => TestTrace.TestTrace<B>,
  onSucceed: (value: A) => TestTrace.TestTrace<B>
): TestArrow.TestArrow<A, B> => TestArrowF<A, B>(Either.match(onFail, onSucceed))

/** @internal */
const defaultMetaParams = {
  span: Option.none,
  parentSpan: Option.none,
  code: Option.none,
  location: Option.none,
  completeCode: Option.none,
  customLabel: Option.none,
  genFailureDetails: Option.none
}
/** @internal */
export const meta = (params: Partial<{
  span: Option.Option<TestArrow.TestArrow.Span>
  parentSpan: Option.Option<TestArrow.TestArrow.Span>
  code: Option.Option<string>
  location: Option.Option<string>
  completeCode: Option.Option<string>
  customLabel: Option.Option<string>
  genFailureDetails: Option.Option<GenFailureDetails.GenFailureDetails>
}> = {}) => {
  return <A, B>(self: TestArrow.TestArrow<A, B>): TestArrow.TestArrow<A, B> => {
    const resolvedParams = { ...defaultMetaParams, ...params, arrow: self }
    const op = self as Primitive
    if (op._tag === "Meta") {
      return Meta({
        ...op.params,
        span: pipe(op.params.span, Option.orElse(resolvedParams.span)),
        parentSpan: pipe(op.params.parentSpan, Option.orElse(resolvedParams.parentSpan)),
        code: pipe(op.params.code, Option.orElse(resolvedParams.code)),
        completeCode: pipe(op.params.completeCode, Option.orElse(resolvedParams.completeCode)),
        customLabel: pipe(op.params.customLabel, Option.orElse(resolvedParams.customLabel)),
        genFailureDetails: pipe(op.params.genFailureDetails, Option.orElse(resolvedParams.genFailureDetails))
      })
    }
    return Meta(resolvedParams)
  }
}

/** @internal */
export const run = <A>(input: Either.Either<unknown, A>) => {
  return <B>(self: TestArrow.TestArrow<A, B>): TestTrace.TestTrace<B> =>
    attempt(() => {
      const op = self as Primitive
      switch (op._tag) {
        case "And": {
          return testTrace.and(
            run(input)(op.left),
            run(input)(op.right)
          ) as TestTrace.TestTrace<B>
        }
        case "AndThen": {
          const trace = run(input)(op.f)
          const result = trace.result()
          switch (result._tag) {
            case "Die": {
              return testTrace.andThen(trace, run(Either.left(result.defect))(op.g))
            }
            case "Fail": {
              return trace
            }
            case "Succeed": {
              return testTrace.andThen(trace, run(Either.right(result.value))(op.g))
            }
          }
        }
        case "Meta": {
          return pipe(
            op.params.arrow,
            run(input),
            testTrace.withSpan(op.params.span),
            testTrace.withCode(op.params.code),
            testTrace.withParentSpan(op.params.parentSpan),
            testTrace.withLocation(op.params.location),
            testTrace.withCompleteCode(op.params.completeCode),
            testTrace.withCustomLabel(op.params.customLabel),
            testTrace.withGenFailureDetails(op.params.genFailureDetails)
          )
        }
        case "Not": {
          return testTrace.not(run(input)(op.arrow)) as TestTrace.TestTrace<B>
        }
        case "Or": {
          return testTrace.or(
            run(input)(op.left),
            run(input)(op.right)
          ) as TestTrace.TestTrace<B>
        }
        case "Suspend": {
          switch (input._tag) {
            case "Left": {
              return testTrace.die(input.left)
            }
            case "Right": {
              return run(input)(op.f(input.right))
            }
          }
        }
        case "TestArrowF": {
          return op.f(input)
        }
      }
    })
}

/** @internal */
export const setGenFailureDetails = (details: GenFailureDetails.GenFailureDetails) => {
  return <A, B>(self: TestArrow.TestArrow<A, B>): TestArrow.TestArrow<A, B> =>
    meta({ genFailureDetails: Option.some(details) })(self)
}

/** @internal */
export const span = (span: readonly [start: number, end: number]) => {
  return <A, B>(self: TestArrow.TestArrow<A, B>): TestArrow.TestArrow<A, B> =>
    meta({ span: Option.some({ start: span[0], end: span[1] }) })(self)
}

/** @internal */
export const succeed = <A>(value: A): TestArrow.TestArrow<unknown, A> => TestArrowF(() => testTrace.succeed(value))

/** @internal */
export const sync = <A>(evaluate: LazyArg<A>): TestArrow.TestArrow<unknown, A> =>
  TestArrowF(() => testTrace.sync(evaluate))

/** @internal */
export const withCode = (code: string, ...args: Array<Assertion.Assertion.Arguments>) => {
  return <A, B>(self: TestArrow.TestArrow<A, B>): TestArrow.TestArrow<A, B> =>
    meta({ code: args.length === 0 ? Option.some(code) : Option.some(`${code}(${args.join(", ")})`) })(self)
}

/** @internal */
export const withCompleteCode = (completeCode: string) => {
  return <A, B>(self: TestArrow.TestArrow<A, B>): TestArrow.TestArrow<A, B> =>
    meta({ completeCode: Option.some(completeCode) })(self)
}

// TODO(Mike/Max): possible (?)
// def withLocation(implicit sourceLocation: SourceLocation): TestArrow[A, B] =
// meta(location = Some(s"${sourceLocation.path}:${sourceLocation.line}"))

/** @internal */
export const withParentSpan = (span: readonly [start: number, end: number]) => {
  return <A, B>(self: TestArrow.TestArrow<A, B>): TestArrow.TestArrow<A, B> =>
    meta({ parentSpan: Option.some({ start: span[0], end: span[1] }) })(self)
}
