import type * as ErrorMessage from "@effect/test/ErrorMessage"
import type * as GenFailureDetails from "@effect/test/GenFailureDetails"
import * as errorMessage from "@effect/test/internal/errorMessage"
import * as OpCodes from "@effect/test/internal/opCodes/testTrace"
import * as result from "@effect/test/internal/result"
import type * as Result from "@effect/test/Result"
import type * as TestArrow from "@effect/test/TestArrow"
import type * as TestTrace from "@effect/test/TestTrace"
import * as Chunk from "@fp-ts/data/Chunk"
import type { LazyArg } from "@fp-ts/data/Function"
import { pipe } from "@fp-ts/data/Function"
import * as HashSet from "@fp-ts/data/HashSet"
import * as Option from "@fp-ts/data/Option"

/** @internal */
const TestTraceSymbolKey = "@effect/test/TestTrace"

/** @internal */
export const TestTraceTypeId: TestTrace.TestTraceTypeId = Symbol.for(
  TestTraceSymbolKey
) as TestTrace.TestTraceTypeId

// /** @internal */
const proto = {
  [TestTraceTypeId]: {
    _A: (_: never) => _
  }
}

/** @internal */
export type Primitive =
  | And
  | AndThen
  | Node
  | Not
  | Or

/** @internal */
export type Op<Tag extends string, Body = {}> = TestTrace.TestTrace<never> & Body & {
  readonly _tag: Tag
}

/** @internal */
export interface And extends
  Op<OpCodes.OP_AND, {
    readonly left: TestTrace.TestTrace<boolean>
    readonly right: TestTrace.TestTrace<boolean>
  }>
{}

/** @internal */
export interface AndThen extends
  Op<OpCodes.OP_AND_THEN, {
    readonly left: TestTrace.TestTrace<never>
    readonly right: TestTrace.TestTrace<never>
  }>
{}

/** @internal */
export interface Node extends
  Op<OpCodes.OP_NODE, {
    readonly params: {
      readonly message: ErrorMessage.ErrorMessage
      readonly children: Option.Option<TestTrace.TestTrace<boolean>>
      readonly span: Option.Option<TestArrow.TestArrow.Span>
      readonly parentSpan: Option.Option<TestArrow.TestArrow.Span>
      readonly fullCode: Option.Option<string>
      readonly location: Option.Option<string>
      readonly annotations: HashSet.HashSet<string> // TODO(Mike/Max) (?)
      readonly completeCode: Option.Option<string>
      readonly customLabel: Option.Option<string>
      readonly genFailureDetails: Option.Option<GenFailureDetails.GenFailureDetails>
    }
  }>
{}

/** @internal */
export interface Not extends
  Op<OpCodes.OP_NOT, {
    readonly trace: TestTrace.TestTrace<boolean>
  }>
{}

/** @internal */
export interface Or extends
  Op<OpCodes.OP_OR, {
    readonly left: TestTrace.TestTrace<boolean>
    readonly right: TestTrace.TestTrace<boolean>
  }>
{}

/** @internal */
export const and = (
  left: TestTrace.TestTrace<boolean>,
  right: TestTrace.TestTrace<boolean>
): TestTrace.TestTrace<boolean> =>
  Object.create(proto, {
    _tag: { value: OpCodes.OP_AND, enumerable: true },
    left: { value: left, enumerable: true },
    right: { value: right, enumerable: true },
    result: {
      value: () =>
        pipe(
          left.result(),
          result.zipWith(right.result(), (a, b) => a && b)
        ),
      enumerable: true
    }
  })

/** @internal */
export const andThen = <A, B>(left: TestTrace.TestTrace<A>, right: TestTrace.TestTrace<B>): TestTrace.TestTrace<B> =>
  Object.create(proto, {
    _tag: { value: OpCodes.OP_AND_THEN, enumerable: true },
    left: { value: left, enumerable: true },
    right: { value: right, enumerable: true },
    result: { value: right.result, enumerable: true }
  })

/** @internal */
export const annotate = (...annotations: Array<string>) => {
  return <A>(self: TestTrace.TestTrace<A>): TestTrace.TestTrace<A> => {
    const op = self as Primitive
    switch (op._tag) {
      case "AndThen": {
        return annotate(...annotations)(op.right)
      }
      case "Node": {
        return node(op.result, {
          annotations: pipe(
            op.params.annotations,
            HashSet.union(HashSet.from(annotations))
          )
        })
      }
      default: {
        return self
      }
    }
  }
}

/** @internal */
export const boolean = (value: boolean, message: ErrorMessage.ErrorMessage): TestTrace.TestTrace<boolean> =>
  node(() => result.succeed(value), { message })

/** @internal */
export const node = <A>(
  result: LazyArg<Result.Result<A>>,
  params: Partial<{
    readonly message: ErrorMessage.ErrorMessage
    readonly children: Option.Option<TestTrace.TestTrace<boolean>>
    readonly span: Option.Option<TestArrow.TestArrow.Span>
    readonly parentSpan: Option.Option<TestArrow.TestArrow.Span>
    readonly fullCode: Option.Option<string>
    readonly location: Option.Option<string>
    readonly annotations: HashSet.HashSet<string> // TODO(Mike/Max) (?)
    readonly completeCode: Option.Option<string>
    readonly customLabel: Option.Option<string>
    readonly genFailureDetails: Option.Option<GenFailureDetails.GenFailureDetails>
  }> = {}
): TestTrace.TestTrace<A> =>
  Object.create(proto, {
    _tag: {
      value: OpCodes.OP_NODE,
      enumerable: true
    },
    result: {
      value: result,
      enumerable: true
    },
    params: {
      value: {
        message: errorMessage.choice("Result was true", "Result was false"),
        children: Option.none,
        span: Option.none,
        parentSpan: Option.none,
        fullCode: Option.none,
        location: Option.none,
        annotations: HashSet.empty(),
        completeCode: Option.none,
        customLabel: Option.none,
        genFailureDetails: Option.none,
        ...params
      },
      enumerable: true
    }
  })

/** @internal */
export const not = (trace: TestTrace.TestTrace<boolean>): TestTrace.TestTrace<boolean> =>
  Object.create({
    _tag: { value: OpCodes.OP_NOT, enumerable: true },
    trace: { value: trace, enumerable: true },
    result: {
      value: () => {
        const r = trace.result()
        return r._tag === "Succeed" ? result.succeed(!r.value) : r
      },
      enumerable: true
    }
  })

/** @internal */
export const or = (
  left: TestTrace.TestTrace<boolean>,
  right: TestTrace.TestTrace<boolean>
): TestTrace.TestTrace<boolean> =>
  Object.create(proto, {
    _tag: { value: OpCodes.OP_OR, enumerable: true },
    left: { value: left, enumerable: true },
    right: { value: right, enumerable: true },
    result: {
      value: () =>
        pipe(
          left.result(),
          result.zipWith(right.result(), (a, b) => a || b)
        ),
      enumerable: true
    }
  })

/** @internal */
export const die = (defect: unknown): TestTrace.TestTrace<never> =>
  node(() => result.die(defect), { message: errorMessage.defect(defect) })

/** @internal */
export const isDie = <A>(self: TestTrace.TestTrace<A>): boolean => {
  const op = self as Primitive
  switch (op._tag) {
    case "And": {
      return isDie(op.left) || isDie(op.right)
    }
    case "AndThen": {
      return isDie(op.left) || isDie(op.right)
    }
    case "Node": {
      return op.result()._tag === "Die"
    }
    case "Not": {
      return isDie(op.trace)
    }
    case "Or": {
      return isDie(op.left) || isDie(op.right)
    }
  }
}

/** @internal */
export const prune = (negated: boolean) => {
  return (self: TestTrace.TestTrace<boolean>): Option.Option<TestTrace.TestTrace<boolean>> => {
    const op = self as Primitive
    switch (op._tag) {
      case "And": {
        const left = prune(negated)(op.left)
        const right = prune(negated)(op.right)
        if (Option.isNone(left) && Option.isSome(right) && !negated) {
          return Option.some(right.value)
        }
        if (Option.isSome(left) && Option.isNone(right) && !negated) {
          return Option.some(left.value)
        }
        if (Option.isSome(left) && Option.isSome(right)) {
          return Option.some(and(left.value, right.value))
        }
        return Option.none
      }
      case "AndThen": {
        const rightOp = op.right as Primitive
        if (rightOp._tag === "Node" && pipe(rightOp.params.annotations, HashSet.has("Rethrow"))) {
          return prune(negated)(op.left)
        }
        return pipe(
          prune(negated)(op.right),
          Option.map((next) => andThen(op.left, next))
        )
      }
      case "Node": {
        const result = op.result()
        switch (result._tag) {
          case "Die": {
            return Option.some(self)
          }
          case "Fail": {
            if (negated) {
              return Option.none
            }
            return Option.some(self)
          }
          case "Succeed": {
            if (result.value === negated) {
              return Option.some(node(op.result, {
                ...op.params,
                children: pipe(op.params.children, Option.flatMap(prune(negated)))
              }))
            }
            return Option.none
          }
        }
      }
      case "Not": {
        return prune(!negated)(op.trace)
      }
      case "Or": {
        const left = prune(negated)(op.left)
        const right = prune(negated)(op.right)
        if (Option.isSome(left) && Option.isSome(right)) {
          return Option.some(or(left.value, right.value))
        }
        if ((Option.isSome(left) && Option.isNone(right)) && (negated || isDie(left.value))) {
          return Option.some(left.value)
        }
        if ((Option.isNone(left) && Option.isSome(right)) && (negated || isDie(right.value))) {
          return Option.some(right.value)
        }
        return Option.none
      }
    }
  }
}

/** @internal */
export const succeed = <A>(value: A): TestTrace.TestTrace<A> => node(() => result.succeed(value))

/** @internal */
export const sync = <A>(evaluate: LazyArg<A>): TestTrace.TestTrace<A> => node(() => result.succeed(evaluate()))

/** @internal */
export const values = <A>(self: TestTrace.TestTrace<A>): Chunk.Chunk<unknown> => {
  const op = self as Primitive
  switch (op._tag) {
    case "And": {
      return pipe(values(op.left), Chunk.concat(values(op.right)))
    }
    case "AndThen": {
      return pipe(values(op.left), Chunk.concat(values(op.right)))
    }
    case "Node": {
      const result = op.result()
      return result._tag === "Succeed" ? Chunk.of(result.value) : Chunk.empty()
    }
    case "Not": {
      return values(op.trace)
    }
    case "Or": {
      return pipe(values(op.left), Chunk.concat(values(op.right)))
    }
  }
}

/** @internal */
export const withCode = (fullCode: Option.Option<string>) => {
  return <A>(self: TestTrace.TestTrace<A>): TestTrace.TestTrace<A> => {
    const op = self as Primitive
    switch (op._tag) {
      case "And": {
        return and(
          withCode(fullCode)(op.left),
          withCode(fullCode)(op.right)
        ) as TestTrace.TestTrace<A>
      }
      case "AndThen": {
        return andThen(
          withCode(fullCode)(op.left),
          withCode(fullCode)(op.right)
        ) as TestTrace.TestTrace<A>
      }
      case "Node": {
        return node(op.result, {
          ...op.params,
          fullCode: pipe(fullCode, Option.orElse(op.params.fullCode)),
          children: pipe(op.params.children, Option.map(withCode(fullCode)))
        })
      }
      case "Not": {
        return not(withCode(fullCode)(op.trace)) as TestTrace.TestTrace<A>
      }
      case "Or": {
        return or(
          withCode(fullCode)(op.left),
          withCode(fullCode)(op.right)
        ) as TestTrace.TestTrace<A>
      }
    }
  }
}

/** @internal */
export const withCompleteCode = (completeCode: Option.Option<string>) => {
  return <A>(self: TestTrace.TestTrace<A>): TestTrace.TestTrace<A> => {
    const op = self as Primitive
    switch (op._tag) {
      case "And": {
        return and(
          withCompleteCode(completeCode)(op.left),
          withCompleteCode(completeCode)(op.right)
        ) as TestTrace.TestTrace<A>
      }
      case "AndThen": {
        return andThen(
          withCompleteCode(completeCode)(op.left),
          withCompleteCode(completeCode)(op.right)
        ) as TestTrace.TestTrace<A>
      }
      case "Node": {
        return node(op.result, {
          ...op.params,
          completeCode,
          children: pipe(op.params.children, Option.map(withCompleteCode(completeCode)))
        })
      }
      case "Not": {
        return not(withCompleteCode(completeCode)(op.trace)) as TestTrace.TestTrace<A>
      }
      case "Or": {
        return or(
          withCompleteCode(completeCode)(op.left),
          withCompleteCode(completeCode)(op.right)
        ) as TestTrace.TestTrace<A>
      }
    }
  }
}

/** @internal */
export const withCustomLabel = (customLabel: Option.Option<string>) => {
  return <A>(self: TestTrace.TestTrace<A>): TestTrace.TestTrace<A> => {
    if (Option.isSome(customLabel)) {
      const op = self as Primitive
      switch (op._tag) {
        case "And": {
          return and(
            withCustomLabel(customLabel)(op.left),
            withCustomLabel(customLabel)(op.right)
          ) as TestTrace.TestTrace<A>
        }
        case "AndThen": {
          return andThen(
            withCustomLabel(customLabel)(op.left),
            withCustomLabel(customLabel)(op.right)
          ) as TestTrace.TestTrace<A>
        }
        case "Node": {
          return node(op.result, {
            ...op.params,
            customLabel,
            children: pipe(op.params.children, Option.map(withCustomLabel(customLabel)))
          })
        }
        case "Not": {
          return not(withCustomLabel(customLabel)(op.trace)) as TestTrace.TestTrace<A>
        }
        case "Or": {
          return or(
            withCustomLabel(customLabel)(op.left),
            withCustomLabel(customLabel)(op.right)
          ) as TestTrace.TestTrace<A>
        }
      }
    }
    return self
  }
}

/** @internal */
export const withGenFailureDetails = (genFailureDetails: Option.Option<GenFailureDetails.GenFailureDetails>) => {
  return <A>(self: TestTrace.TestTrace<A>): TestTrace.TestTrace<A> => {
    const op = self as Primitive
    switch (op._tag) {
      case "And": {
        return and(
          withGenFailureDetails(genFailureDetails)(op.left),
          withGenFailureDetails(genFailureDetails)(op.right)
        ) as TestTrace.TestTrace<A>
      }
      case "AndThen": {
        return andThen(
          withGenFailureDetails(genFailureDetails)(op.left),
          withGenFailureDetails(genFailureDetails)(op.right)
        ) as TestTrace.TestTrace<A>
      }
      case "Node": {
        return node(op.result, {
          ...op.params,
          genFailureDetails: pipe(op.params.genFailureDetails, Option.orElse(genFailureDetails)),
          children: pipe(op.params.children, Option.map(withGenFailureDetails(genFailureDetails)))
        })
      }
      case "Not": {
        return not(withGenFailureDetails(genFailureDetails)(op.trace)) as TestTrace.TestTrace<A>
      }
      case "Or": {
        return or(
          withGenFailureDetails(genFailureDetails)(op.left),
          withGenFailureDetails(genFailureDetails)(op.right)
        ) as TestTrace.TestTrace<A>
      }
    }
  }
}

/** @internal */
export const withLocation = (location: Option.Option<string>) => {
  return <A>(self: TestTrace.TestTrace<A>): TestTrace.TestTrace<A> => {
    if (Option.isSome(location)) {
      const op = self as Primitive
      switch (op._tag) {
        case "And": {
          return and(
            withLocation(location)(op.left),
            withLocation(location)(op.right)
          ) as TestTrace.TestTrace<A>
        }
        case "AndThen": {
          return andThen(
            withLocation(location)(op.left),
            withLocation(location)(op.right)
          ) as TestTrace.TestTrace<A>
        }
        case "Node": {
          return node(op.result, {
            ...op.params,
            location,
            children: pipe(op.params.children, Option.map(withLocation(location)))
          })
        }
        case "Not": {
          return not(withLocation(location)(op.trace)) as TestTrace.TestTrace<A>
        }
        case "Or": {
          return or(
            withLocation(location)(op.left),
            withLocation(location)(op.right)
          ) as TestTrace.TestTrace<A>
        }
      }
    }
    return self
  }
}

/** @internal */
export const withParentSpan = (span: Option.Option<TestArrow.TestArrow.Span>) => {
  return <A>(self: TestTrace.TestTrace<A>): TestTrace.TestTrace<A> => {
    if (Option.isSome(span)) {
      const op = self as Primitive
      switch (op._tag) {
        case "And": {
          return and(
            withParentSpan(span)(op.left),
            withParentSpan(span)(op.right)
          ) as TestTrace.TestTrace<A>
        }
        case "AndThen": {
          return andThen(
            withParentSpan(span)(op.left),
            withParentSpan(span)(op.right)
          ) as TestTrace.TestTrace<A>
        }
        case "Node": {
          return node(op.result, {
            ...op.params,
            parentSpan: pipe(op.params.parentSpan, Option.orElse(span))
          })
        }
        case "Not": {
          return not(withParentSpan(span)(op.trace)) as TestTrace.TestTrace<A>
        }
        case "Or": {
          return or(
            withParentSpan(span)(op.left),
            withParentSpan(span)(op.right)
          ) as TestTrace.TestTrace<A>
        }
      }
    }
    return self
  }
}

/** @internal */
export const withSpan = (span: Option.Option<TestArrow.TestArrow.Span> = Option.none) => {
  return <A>(self: TestTrace.TestTrace<A>): TestTrace.TestTrace<A> => {
    if (Option.isSome(span)) {
      const op = self as Primitive
      switch (op._tag) {
        case "AndThen": {
          return andThen(op.left, withSpan(span)(op.right))
        }
        case "Node": {
          return node(op.result, { ...op.params, span })
        }
        default: {
          return self
        }
      }
    }
    return self
  }
}
