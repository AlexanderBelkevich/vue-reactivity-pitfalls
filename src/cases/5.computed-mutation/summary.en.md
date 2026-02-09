> **In simple words:** if inside a `computed` you call mutating methods like `sort()`, `reverse()` or `splice()`, you are changing the **original** data. Reading the computed can cause side effects.

## Code

```javascript
const state = reactive({ list: [3, 1, 2] })
const sorted = computed(() => state.list.sort((a, b) => a - b))
const safeSorted = computed(() => [...state.list].sort((a, b) => a - b))
```

## How to test

- Right after opening the case `list` is already sorted — on first access to `sorted.value` inside the computed, `state.list.sort()` was called and mutated the original array.
- Click «Add 4» or «Shuffle» and see the difference: `sorted` mutates `list`, `safeSorted` works on a copy and leaves the original array unchanged.

Expected: mutating methods in computed change the source; copying before sort avoids that.

::: actions
::: state

> **Attention:** Generated with AI, so may contain errors. Requires checking and refinement.

## Why does this happen?

In JavaScript, methods like `sort`, `reverse`, `splice` change the array **in place**. They don’t return a new array “alongside” — they reorder elements in the same object. When in a computed we write `state.list.sort(...)`, we call this method on the reactive array. Vue doesn’t copy the array for you: the computed just runs your code. Result: the original `state.list` is sorted after the first computation of sorted.

This is not a Vue quirk but the behavior of array methods. The same would happen with a plain object:

```javascript
const obj = { list: [3, 1, 2] }
const sorted = () => obj.list.sort((a, b) => a - b)
sorted()
console.log(obj.list)  // [1, 2, 3] — array was mutated
```

By contract, computed is expected to be “pure”: the result depends only on reactive data and should not mutate it. Otherwise every read of the computed would inadvertently change app state, which is hard to track and debug.

## How to write safely

- Before mutating, make a copy: `[...state.list].sort(...)` or `state.list.slice().sort(...)`.
- Same for `reverse`, `splice`, etc.: work on a copy and leave the original data untouched.
- If you need a “sorted version” of the original list without changing the source — in the computed return the result of sorting a copy.

## When mutation in computed is especially tricky

- On first read of the computed (e.g. on render) the array is mutated; later reads may rely on already changed data.
- If other computed or watch depend on the same array — they will see a change caused by “just reading” another computed, which obscures cause and effect.

## What to remember

- `sort`, `reverse`, `splice` and similar methods mutate the array in place.
- In computed use a copy: `[...list].sort()` instead of `list.sort()`.
- Reading a computed should not change the original reactive data.

## Terms and links

- **`computed()`** — cached derived value, recomputes when dependencies change. [Docs](https://vuejs.org/api/reactivity-core.html#computed)
- **`reactive()`** — makes an object reactive (deep proxy). [Docs](https://vuejs.org/api/reactivity-core.html#reactive)
