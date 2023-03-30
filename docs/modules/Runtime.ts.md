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
  - [runCallback](#runcallback)
  - [runFork](#runfork)
  - [runPromise](#runpromise)
  - [runPromiseEither](#runpromiseeither)
  - [runPromiseExit](#runpromiseexit)
  - [runSync](#runsync)
  - [runSyncEither](#runsynceither)
  - [runSyncExit](#runsyncexit)

---

# constructors

## make

**Signature**

```ts
export declare const make: <R>(
  context: Context.Context<R>,
  runtimeFlags: RuntimeFlags,
  fiberRefs: FiberRefs.FiberRefs
) => TestRuntime<R>
```

Added in v1.0.0

## testRuntime

**Signature**

```ts
export declare const testRuntime: TestRuntime<never>
```

Added in v1.0.0

# execution

## runCallback

**Signature**

```ts
export declare const runCallback: <E, A>(
  effect: Effect.Effect<never, E, A>,
  onExit?: ((exit: Exit<E, A>) => void) | undefined
) => Runtime.Cancel<E, A>
```

Added in v1.0.0

## runFork

**Signature**

```ts
export declare const runFork: <E, A>(
  effect: Effect.Effect<never, E, A>,
  options?: Runtime.RunForkOptions | undefined
) => RuntimeFiber<E, A>
```

Added in v1.0.0

## runPromise

**Signature**

```ts
export declare const runPromise: <E, A>(effect: Effect.Effect<never, E, A>) => Promise<A>
```

Added in v1.0.0

## runPromiseEither

**Signature**

```ts
export declare const runPromiseEither: <E, A>(effect: Effect.Effect<never, E, A>) => Promise<Either<E, A>>
```

Added in v1.0.0

## runPromiseExit

**Signature**

```ts
export declare const runPromiseExit: <E, A>(effect: Effect.Effect<never, E, A>) => Promise<Exit<E, A>>
```

Added in v1.0.0

## runSync

**Signature**

```ts
export declare const runSync: <E, A>(effect: Effect.Effect<never, E, A>) => A
```

Added in v1.0.0

## runSyncEither

**Signature**

```ts
export declare const runSyncEither: <E, A>(effect: Effect.Effect<never, E, A>) => Either<E, A>
```

Added in v1.0.0

## runSyncExit

**Signature**

```ts
export declare const runSyncExit: <E, A>(effect: Effect.Effect<never, E, A>) => Exit<E, A>
```

Added in v1.0.0
