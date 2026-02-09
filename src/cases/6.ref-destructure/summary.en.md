> **In simple words:** if you “pull out” the value from a `ref` (e.g. via destructuring or assigning `ref.value` to a variable), you get a plain value. Reactivity stays only on the ref itself; the variable holding the copy is not linked to it.

## Code

```javascript
const counter = ref({ value: 0 })
let plainValue = counter.value.value

counter.value.value++  // plainValue will not change ❌
plainValue++           // counter.value.value will not change ❌
```

## How to test

- Click «counter.value.value++» — the display of `counter.value.value` will update, while `plainValue` stays the same (until another rerender happens).
- Click «plainValue++» — only the local variable changes; `counter.value.value` and its UI will not update.
- Click «counter.value.value++» again — a rerender will happen, and on screen `plainValue` will show the value from the last read during render.

Expected: `plainValue` is a snapshot at read time; there is no link to the ref; the UI “picks up” plainValue only on rerender due to other reactive changes.

::: actions
::: state

> **Attention:** Generated with AI, so may contain errors. Requires checking and refinement.

## Why does this happen?

A `ref` stores its value in `.value`. When we write `let plainValue = counter.value.value`, we read the current value once and assign it to a plain variable. From then on that variable is not connected to the ref: it’s just a number (or object, or string). Changing `counter.value.value` won’t update `plainValue`, and changing `plainValue` won’t update the ref.

Same idea as with destructuring `reactive`: we read the value and work with a copy. Reactivity lives only at the “source” — the ref. In the template Vue tracks access to refs (and reactive), so on rerender it will read `plainValue` again — and the screen will show whatever that variable had at that render. But the variable itself is not reactive: if only your code changes it and doesn’t touch the ref, a rerender may happen later (due to another reactive change) or not when you expect.

## Difference from reactive

With `reactive` we did `const { count } = state` and lost the link to the field. With `ref` we do `const x = ref.value` (or the nested `counter.value.value`) — and we lose the link to the ref. In both cases the “pulled out” value is plain, not reactive. The only difference is the API: with ref everything lives behind `.value`, with reactive — behind object fields.

## When you need the link

- Work with the ref directly: `counter.value` and if needed `counter.value.value`, without assigning to a separate variable for display.
- If the value came from `reactive` and you need to “pull it out” while keeping reactivity — use `toRef` / `toRefs` (see the toRef/toRefs case). For a ref itself there is no toRef equivalent: the ref is already a single reactive cell; you can’t “half-unwrap” it reactively.

## What to remember

- Assigning `ref.value` (or a nested field) to a variable gives a copy, not a link.
- To change things, update the ref via `.value`; then everyone that depends on it will update.
- The copy variable updates in the UI only on rerender, when the component reads its value again.

## Terms and links

- **`ref()`** — reactive reference to a value, access via `.value`. [Docs](https://vuejs.org/api/reactivity-core.html#ref)
- **`toRef()`** — creates a ref tied to a field of a reactive object (for “pulling out from reactive”). [Docs](https://vuejs.org/api/reactivity-utilities.html#toref)
