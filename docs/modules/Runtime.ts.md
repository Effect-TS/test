---
title: Runtime.ts
nav_order: 3
parent: Modules
---

## Runtime overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
  - [testRuntime](#testruntime)
- [execution](#execution)
  - [unsafeFork](#unsafefork)
  - [unsafeRun](#unsaferun)
  - [unsafeRunPromise](#unsaferunpromise)
  - [unsafeRunPromiseEither](#unsaferunpromiseeither)
  - [unsafeRunPromiseExit](#unsaferunpromiseexit)
  - [unsafeRunSync](#unsaferunsync)
  - [unsafeRunSyncEither](#unsaferunsynceither)
  - [unsafeRunSyncExit](#unsaferunsyncexit)

---

# constructors

## make

**Signature**

```ts
export declare const make: <R>(
  context: Context.Context<R>,
  runtimeFlags: RuntimeFlags,
  fiberRefs: FiberRefs.FiberRefs
) => Runtime.Runtime<R>
```

Added in v1.0.0

## testRuntime

**Signature**

```ts
export declare const testRuntime: Runtime.Runtime<never>
```

Added in v1.0.0

# execution

## unsafeFork

**Signature**

```ts
export declare const unsafeFork: <E, A>(
  effect: Effect.Effect<never, E, A>,
  scheduler?: Scheduler | undefined
) => RuntimeFiber<E, A>
```

Added in v1.0.0

## unsafeRun

**Signature**

```ts
export declare const unsafeRun: <E, A>(
  effect: Effect.Effect<never, E, A>,
  onExit?: ((exit: Exit<E, A>) => void) | undefined
) => Runtime.Cancel<E, A>
```

Added in v1.0.0

## unsafeRunPromise

**Signature**

```ts
export declare const unsafeRunPromise: <E, A>(effect: Effect.Effect<never, E, A>) => Promise<A>
```

Added in v1.0.0

## unsafeRunPromiseEither

**Signature**

```ts
export declare const unsafeRunPromiseEither: <E, A>(effect: Effect.Effect<never, E, A>) => Promise<Either<E, A>>
```

Added in v1.0.0

## unsafeRunPromiseExit

**Signature**

```ts
export declare const unsafeRunPromiseExit: <E, A>(effect: Effect.Effect<never, E, A>) => Promise<Exit<E, A>>
```

Added in v1.0.0

## unsafeRunSync

**Signature**

```ts
export declare const unsafeRunSync: <E, A>(effect: Effect.Effect<never, E, A>) => A
```

Added in v1.0.0

## unsafeRunSyncEither

**Signature**

```ts
export declare const unsafeRunSyncEither: <E, A>(effect: Effect.Effect<never, E, A>) => Either<E, A>
```

Added in v1.0.0

## unsafeRunSyncExit

**Signature**

```ts
export declare const unsafeRunSyncExit: <E, A>(effect: Effect.Effect<never, E, A>) => Exit<E, A>
```

Added in v1.0.0
