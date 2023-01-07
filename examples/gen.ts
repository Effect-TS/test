import * as Effect from "@effect/io/Effect"
import { checkN } from "@effect/test"
import * as Assertion from "@effect/test/Assertion"
import * as Gen from "@effect/test/Gen"
import * as TestRuntime from "@effect/test/Runtime"
import * as TestResult from "@effect/test/TestResult"
import * as TestTrace from "@effect/test/TestTrace"
import * as Chunk from "@fp-ts/data/Chunk"
import { constFalse, constVoid, pipe } from "@fp-ts/data/Function"
import * as Option from "@fp-ts/data/Option"
import * as util from "node:util"

const gen = Gen.integer({ min: 0, max: 100 })

const test = (n: number): Effect.Effect<never, never, TestResult.TestResult> =>
  Effect.sync(() =>
    n % 2 === 0 ?
      Assertion.assert(Assertion.anything())(constVoid) :
      Assertion.assert(Assertion.nothing())(() => n)
  )

const program = pipe(
  checkN(100)(gen)(test),
  Effect.map((result) =>
    pipe(
      TestResult.failures(result),
      Option.match(
        constFalse,
        (trace) => {
          console.log(Array.from(TestTrace.values(trace)))
          return pipe(
            Chunk.head(TestTrace.values(trace)),
            Option.match(constFalse, (u) => String(u) === "1")
          )
        }
      )
    )
  ),
  Assertion.assertEffect(Assertion.isTrue())
)

TestRuntime.unsafeRun(program, (exit) => {
  if (exit._tag === "Success") {
    console.log(util.inspect(exit.value, { depth: null, colors: true }))
  } else {
    console.log(exit.cause)
  }
})
