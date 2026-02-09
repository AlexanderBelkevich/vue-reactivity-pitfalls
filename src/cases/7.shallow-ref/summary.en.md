> **In simple words:** `shallowRef` tracks only **replacement** of `.value`. Changes inside the object (fields, array, etc.) do not trigger reactivity until you replace the whole object or call `triggerRef`.

## Code

```javascript
const data = shallowRef({ count: 0 })

data.value.count += 1   // Vue does not see the change ❌
triggerRef(data)        // we tell Vue about the change ✅
data.value = { count: 1 }  // replacing .value — Vue sees it ✅
```

## How to test

- Click «count++ (no triggerRef)» — the value inside the object changes, but the watch won’t run and the UI may not update.
- Click «triggerRef(data)» — Vue will re-run dependencies of this shallowRef; the watch will run.
- Click «Replace object» — a new object is assigned to `data.value`; replacement is tracked, the watch will run.

Expected: without replacing `.value` or without `triggerRef`, inner changes are not treated as a change of the reactive source.

::: actions
::: state

> **Attention:** Generated with AI, so may contain errors. Requires checking and refinement.

## Why does this happen?

A normal `ref` makes its value deeply reactive by default: if `.value` is an object, Vue wraps it in reactive and tracks all nested fields. That’s convenient, but for large or rarely changing structures it’s unnecessary cost.

`shallowRef` does not wrap the contents of `.value` in a proxy. It stores the object you pass “as is” and only tracks the reference itself: did it change. So reactivity triggers when you assign `data.value = newObject`, but not when you do `data.value.count++`. For Vue the “source” is the shallowRef and its `.value`; what’s inside the object is not tracked.

If you mutate the object inside and want Vue to react, you either replace the whole object (`data.value = { ...data.value, count: data.value.count + 1 }`) or explicitly tell Vue to “re-check this ref” — that’s what `triggerRef(data)` is for.

## When shallowRef is useful

- Large objects (e.g. instances from third-party libs, heavy data structures) where deep tracking isn’t needed or is expensive.
- When updates happen in “batches”: you change the object’s internals, then call `triggerRef` once, and Vue updates everything that depends on it.
- When the logic always replaces the object entirely rather than mutating fields — then shallowRef behaves predictably and without extra proxying.

## watch with deep: true and shallowRef

The demo uses `watch(data, ..., { deep: true })`. Important: `deep` here means that when the watch runs, Vue will dig into nested fields for comparison/tracking, but the watch **runs** for a shallowRef only when the `.value` reference changes or when `triggerRef` is called. So `deep` does not turn shallowRef into a deep ref; it only affects how watch inspects the value after the source has “changed”. For shallowRef, “changed” means a new reference or triggerRef.

## What to remember

- `shallowRef` reacts to replacing `.value` and to calling `triggerRef`, but not to mutations inside the object.
- If you change fields inside — either replace the whole object or call `triggerRef` after the changes.
- Use shallowRef where deep tracking isn’t needed, to avoid paying for it in performance.

## Terms and links

- **`shallowRef()`** — only `.value` is reactive; contents are not wrapped in a proxy. [Docs](https://vuejs.org/api/reactivity-advanced.html#shallowref)
- **`triggerRef()`** — forces dependencies of the shallowRef to update. [Docs](https://vuejs.org/api/reactivity-advanced.html#triggerref)
