> **In simple words:** `toRef` and `toRefs` keep the link to the field in `reactive`; plain destructuring gives only a copy of the value — reactivity is lost.

## Code

```javascript
const state = reactive({ a: 1, b: 2 })
const aRef = toRef(state, 'a')
const { b } = state  // plain value

aRef.value++  // state.a changes ✅
state.b++     // b does not change ❌
```

## How to test

- Click «aRef.value++» — both `aRef.value` and `state.a` will update.
- Click «state.b++» — `state.b` will change, while `b` (plain) will stay the same.

Expected: with `toRef` the variable and the field in `reactive` stay in sync; with destructuring the link is lost.

::: actions
::: state

> **Attention:** Generated with AI, so may contain errors. Requires checking and refinement.

## Why does this happen?

In the “Destructuring reactive” case we already covered it: with destructuring we read the value from the object and then work with a copy. Vue tracks access to the field in `reactive`, but does not “bind” that value to the new variable.

`toRef(state, 'a')` does something different: it does not copy the value, it creates a **ref** that on read and write accesses `state.a`. So it’s not a snapshot, but a live reference to that one field. So `aRef.value++` effectively does `state.a++`, and vice versa.

`toRefs(state)` — the same idea, but for all fields of the object: returns an object where each field is wrapped in a `ref` tied to the corresponding field of `state`.

## When to use toRef, when toRefs?

- **toRef** — when you need to “pull out” one field and keep reactivity (e.g. pass to a composable or template by name).
- **toRefs** — when you need to spread all fields of the object (e.g. after `reactive` in a composable, return a “flat” object of refs for the template).

> `toRefs` wraps **all** fields of the object. For large objects, if you only need a few fields, it’s better to use several `toRef` calls to avoid extra refs.

## Relation to other cases

- **Destructuring reactive** — there we show the problem: `const { b } = state` gives a plain value. The solution when you need the link is `toRef` / `toRefs`.
- **Destructuring ref** — there we talk about `ref`; for a primitive inside a `ref` you can’t “save” reactivity via destructuring; you have to work with `.value` or use `toRef` if the value came from `reactive`.

## What to remember

- Destructuring `reactive` gives a copy of the value, not a link.
- If you need a link to a field — use `toRef(state, 'field')` or `toRefs(state)`.
- `toRef`/`toRefs` return refs: in code use `.value`, in the template Vue unwraps automatically.

## Terms and links

- **`toRef()`** — creates a ref tied to a specific field of a reactive object. [Docs](https://vuejs.org/api/reactivity-utilities.html#toref)
- **`toRefs()`** — converts a reactive object into an object of refs per field. [Docs](https://vuejs.org/api/reactivity-utilities.html#torefs)
- **`reactive()`** — makes an object reactive (deep proxy). [Docs](https://vuejs.org/api/reactivity-core.html#reactive)
