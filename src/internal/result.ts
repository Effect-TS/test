import type * as Result from "@effect/test/Result"

/** @internal */
export const die = (defect: unknown): Result.Result<never> => ({
  _tag: "Die",
  defect
})

/** @internal */
export const fail: Result.Result<never> = {
  _tag: "Fail"
}

/** @internal */
export const succeed = <A>(value: A): Result.Result<A> => ({
  _tag: "Succeed",
  value
})

/** @internal */
export const zipWith = <B, A, C>(that: Result.Result<B>, f: (a: A, b: B) => C) => {
  return (self: Result.Result<A>): Result.Result<C> => {
    switch (self._tag) {
      case "Die": {
        return die(self.defect)
      }
      case "Fail": {
        return fail
      }
      case "Succeed": {
        switch (that._tag) {
          case "Die": {
            return die(that.defect)
          }
          case "Fail": {
            return fail
          }
          case "Succeed": {
            return succeed(f(self.value, that.value))
          }
        }
      }
    }
  }
}
