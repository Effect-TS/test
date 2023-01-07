import type * as ErrorMessage from "@effect/test/ErrorMessage"

/** @internal */
export const choice = (success: string, failure: string): ErrorMessage.ErrorMessage => ({
  _tag: "Choice",
  success,
  failure
})

/** @internal */
export const combine = (that: string | ErrorMessage.ErrorMessage) => {
  return (self: ErrorMessage.ErrorMessage): ErrorMessage.ErrorMessage => ({
    _tag: "Combine",
    left: self,
    right: typeof that === "string" ? text(that) : that,
    spacing: 1
  })
}

/** @internal */
export const combineMessage = (that: ErrorMessage.ErrorMessage) => {
  return (self: ErrorMessage.ErrorMessage): ErrorMessage.ErrorMessage => ({
    _tag: "CombineMessage",
    left: self,
    right: that
  })
}

/** @internal */
export const custom = (string: string): ErrorMessage.ErrorMessage => ({
  _tag: "Custom",
  string
})

/** @internal */
export const defect = (defect: unknown): ErrorMessage.ErrorMessage => ({
  _tag: "ThrowableEffect",
  defect
})

// TODO(Mike/Max): implement PrettyPrint (?)
export const pretty = (value: unknown): ErrorMessage.ErrorMessage => ({
  _tag: "Value",
  value: JSON.stringify(value, undefined, 2)
})

/** @internal */
export const text = (string: string): ErrorMessage.ErrorMessage => choice(string, string)

/** @internal */
export const value = (value: unknown): ErrorMessage.ErrorMessage => ({
  _tag: "Value",
  value
})

/** @internal */
export const did: ErrorMessage.ErrorMessage = choice("did", "did not")

/** @internal */
export const equals: ErrorMessage.ErrorMessage = choice("was equal to", "was not equal to")

/** @internal */
export const had: ErrorMessage.ErrorMessage = choice("had", "did not have")

/** @internal */
export const was: ErrorMessage.ErrorMessage = choice("was", "was not")
