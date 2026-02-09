> **In simple words:** `markRaw` marks an object so that Vue **does not make it reactive**. Changes inside such an object are not tracked and do not trigger updates. Useful for third-party instances and heavy structures, but easy to forget and expect reactivity where there is none.

## Code

```javascript
const rawConfig = markRaw({ theme: 'light' })
const state = reactive({ config: rawConfig })

state.config.theme = 'dark'  // watch won’t run, UI won’t update ❌
state.config = { theme: 'neon' }  // replacing the field in state — will trigger ✅
```

## How to test

- Click «theme = dark» — the value inside `state.config` changes, but the watch on `state.config.theme` won’t run and the UI may not update, because the config object itself is marked as raw.
- Click «Replace config» — a new object is assigned to `state.config`; that’s a change in the reactive object `state`, so the watch will run.

Expected: changes inside a `markRaw`-marked object do not trigger reactivity; replacing the field itself in reactive does.

::: actions
::: state

> **Attention:** Generated with AI, so may contain errors. Requires checking and refinement.

## Why does this happen?

When Vue meets an object in the reactive tree (e.g. inside `reactive` or in a `ref`), by default it wraps it in a proxy to track reads and writes. But some objects must not become reactive: instances of third-party classes, large immutable structures, objects with circular refs or with fields that shouldn’t be proxied.

`markRaw` marks an object with an internal flag. When Vue walks the tree and creates proxies, it checks this flag and **skips** such an object: doesn’t wrap it, doesn’t track nested fields. The object is stored “as is”. So when we do `state.config.theme = 'dark'`, we change a field of a plain object; the reactive system is not attached to it and doesn’t see the change. But assigning `state.config = { theme: 'neon' }` is a change to a field of the reactive object `state`, and that is tracked.

## When to use markRaw

- You store in state an instance of a class or an object from a third-party lib (e.g. a map instance, editor, engine) that must not be wrapped in a proxy.
- Large data structures that shouldn’t react to every inner change, or objects with special requirements (getters/setters, frozen objects).
- When the nested object is conceptually “config” or “external dependency”, and you only care about replacing it as a whole, not about reactivity of its fields.

## Common mistake

You mark an object as raw for optimization or proxy incompatibility, but in code or template you expect that when fields of that object change, computed, watch or UI will update. In that case there will be no reactivity: either don’t use markRaw for that object, or only react to replacing the object (e.g. watch `state.config` and when it changes, use the new object).

## Relation to shallowRef

Both `markRaw` and `shallowRef` limit how deep reactivity goes. Difference: `markRaw` — “don’t wrap this object in a proxy anywhere” (it can sit inside reactive/ref but stays raw). `shallowRef` — “only replacement of `.value` is reactive”; the object in `.value` is not wrapped in deep reactive by default. For objects nested in reactive that must not be reactive, use `markRaw`.

## What to remember

- `markRaw` keeps the object out of the reactive system; changes inside are not tracked.
- Use it for third-party instances and structures that must not be proxied.
- If you mark an object as raw, don’t expect reactive updates when its fields change — only when the reference in the reactive tree is replaced.

## Terms and links

- **`markRaw()`** — marks an object so it will not be wrapped in a reactive proxy. [Docs](https://vuejs.org/api/reactivity-advanced.html#markraw)
- **`reactive()`** — makes an object reactive (deep proxy). [Docs](https://vuejs.org/api/reactivity-core.html#reactive)
