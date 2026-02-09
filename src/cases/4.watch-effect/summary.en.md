> **In simple words:** `watchEffect` on each run “attaches” to everything reactive that was read inside the function. Often extra things become dependencies — and the effect runs more often than needed.

## Code

```javascript
const state = reactive({
  query: 'vue',
  items: ['vue', 'reactivity', 'watch'],
})

watchEffect(() => {
  log(`query=${state.query}, items.length=${state.items.length}`)
})
```

## How to test

- Right after opening the case the effect has already run once (watchEffect runs on creation).
- Click «query = pinia» — `state.query` changes, the effect re-runs.
- Click «Add item» — `state.items.length` changes, the effect re-runs again, even though you might only care about `query`.

Expected: the effect reacts to any reactive value read inside; extra dependencies cause extra runs.

::: actions
::: state

> **Attention:** Generated with AI, so may contain errors. Requires checking and refinement.

## Why does this happen?

`watchEffect` does not take an explicit list of dependencies. It runs the function you pass and while running it collects all reactive accesses (ref, reactive, computed, etc.). Everything you touched is considered a dependency. Any of them changes — the effect re-runs.

In the example we access both `state.query` and `state.items.length`. Adding an element to the array changes the length → the effect runs. If we only wanted to react to the search query changing, this “dependency” on `items.length` would be accidental and unwanted.

There’s no magic: Vue simply remembers that during the function run we read `state.query` and `state.items`. Both become dependencies of one effect.

## When watchEffect is handy, when it’s risky

- **Handy** when dependencies match what you actually read: one effect, automatic dependency collection, no need to list sources manually.
- **Risky** when the effect has a lot of code and some data is read “along the way” (e.g. for logging or a condition). Then any change to that data will re-run the effect, even when the effect’s logic shouldn’t depend on it.

## How to reduce extra runs

- Move into a separate effect only the logic that really should depend on specific data.
- Use **watch** with an explicit source: `watch(() => state.query, () => { ... })` — the effect will run only when `query` changes, even if inside the callback you touch `state.items`. With watch, dependencies are defined by the first argument, not by what’s read inside.
- Minimize what you read inside watchEffect: don’t touch large lists or fields “just in case” if they’re not needed for the effect’s logic.

## What to remember

- `watchEffect` tracks everything reactive that was read inside the function.
- Accidental reads (e.g. `items.length` in a log line) add an extra dependency and extra re-runs.
- For strict control over what to react to, use `watch` with an explicit source.

## Terms and links

- **`watchEffect()`** — runs the function immediately and re-runs when any of the collected dependencies change. [Docs](https://vuejs.org/api/reactivity-core.html#watcheffect)
- **`watch()`** — watches a given source and runs the callback when it changes. [Docs](https://vuejs.org/api/reactivity-core.html#watch)
