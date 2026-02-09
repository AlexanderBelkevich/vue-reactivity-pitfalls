# Destructuring reactive

> In simple words: the value becomes a plain variable and is no longer tied to state.

Fields in `reactive` are not reactive by themselves.
Vue tracks access to a field in `reactive`, but not the value stored there.
When we use destructuring, we read the value, and then it is no longer tied to `reactive`.
And if in the case of an object, its fields will remain reactive, then extracting primitive values, we lose reactivity.

## Code

```javascript
const state = reactive({ 
  count: 0, 
  object: { deepCount: 1 },
})
let { 
  count: localCount,
  object: localObject,
} = state

state.count++ // ✅
localCount++ // ❌
localObject.deepCount++ // ✅
```

## How to test

- Click "state.count++" — localCount does not change.
- Click "localCount++" — state.count stays the same.
- Click "state.count++" again — localCount updates due to a rerender.

Expected: localCount changes, but the UI only sees it after a different rerender.

::: actions
::: state

## Key takeaways

- Destructuring reactive gives a plain value, not a ref.
- If you need the link, use toRef/toRefs.
- UI updates only because of other reactive changes.

## Terms and links

- **reactive()** — Makes an object reactive (deep proxy). [Docs](https://vuejs.org/api/reactivity-core.html#reactive)
- **toRefs()** — Turns a reactive object into refs per field. [Docs](https://vuejs.org/api/reactivity-utilities.html#torefs)