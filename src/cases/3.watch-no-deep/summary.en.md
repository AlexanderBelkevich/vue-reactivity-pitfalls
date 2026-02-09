> **In simple words:** `watch` on an object without the `deep` option reacts only to **reference change** of that object. Changes inside (fields, array elements) are not tracked by default.

## Code

```javascript
const state = reactive({
  profile: { name: 'Ira', skills: ['Vue'] },
})

watch(() => state.profile, () => log('shallow'))           // only state.profile replacement
watch(() => state.profile, () => log('deep'), { deep: true })  // both replacement and inner changes
```

## How to test

- Click «Add skill» — only the array inside `profile` changes, the reference to `state.profile` is the same. Only the callback with `deep: true` will run.
- Click «Replace profile» — a new object is assigned, the reference changes. Both watchers will run.

Expected: without `deep` the reaction is only to object replacement; with `deep` — also to nested changes.

::: actions
::: state

> **Attention:** Generated with AI, so may contain errors. Requires checking and refinement.

## Why does this happen?

Vue by default compares the “source” by reference when watching it. The source is what the getter returns (or the ref/reactive itself). For `() => state.profile` the source is the value of `state.profile` — the object. When we do `state.profile.skills.push('Pinia')`, the object `state.profile` itself does not change; only its inner state changes. Same object reference → shallow watch does not trigger.

When we do `state.profile = { name: 'Ira', skills: ['Vue', 'Pinia'] }`, we replace the object. The reference changes → both watchers see the change.

This is not a Vue “bug”, but intentional behavior: deep watching is more expensive (all nested fields must be traversed and tracked), so by default watch is “shallow”.

## When do you need deep?

- You need to react to a change in **any** field inside the object or array element — use `{ deep: true }`.
- You only need to react to “replacing” the whole object (e.g. a new API response) — you don’t need `deep`, shallow is enough.

> With `deep: true` Vue tracks all nested properties. For large or frequently changing structures this can be costly. Sometimes it’s simpler and faster not to mutate the object but replace it entirely (`state.profile = { ...newProfile }`), then shallow watch is enough.

## Alternatives

- Watch a specific field instead of the whole object: `watch(() => state.profile.name, ...)` — triggers on name change, no `deep` needed.
- For complex structures you can watch several fields or a “normalized” value (e.g. JSON.stringify for content comparison — be careful with key order and types).

## What to remember

- `watch` on an object without `deep` reacts to reference change, not to changes inside.
- Nested fields and array mutations do not trigger such a watch.
- When you need to react to “everything inside” — use `deep: true`; consider the cost for large objects.

## Terms and links

- **`watch()`** — watches a source and runs the callback when it changes. [Docs](https://vuejs.org/api/reactivity-core.html#watch)
- **`deep` option** — enables tracking of nested changes. [Docs](https://vuejs.org/api/reactivity-core.html#watch)
