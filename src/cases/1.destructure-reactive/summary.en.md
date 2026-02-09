> **In simple words:** if you destructure fields from `reactive`, you can lose reactivity.

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
```

## How to test

- Click "state.count++" and you'll see that `localCount` does not change.
- Click "localCount++" — `state.count` will stay the same.
- Click "state.count++" again — `localCount` will update due to a rerender.

Expected: `localCount` changes, but the UI only learns about it on another rerender.

::: actions
::: state

## Why does this happen?

Fields in `reactive` are not reactive by themselves.
Vue tracks access to a field in `reactive`, but not the value stored there.
When we use destructuring, we read the value, and then it is no longer tied to `reactive`.
And if in the case of an object its fields will remain reactive, when extracting primitive values we lose reactivity.

This is similar to working with a plain object rather than `reactive`.
```javascript
const state = { count: 0 }

let localCount = state.count

// we changed the value in the object
state.count++ 

// but localCount did not change and is not tied to the object
console.log(localCount) // 0
localCount = 5
console.log(state.count) // 1
```

But is destructuring to blame? No, destructuring simply reads the value from the object. The same would happen if we used a plain variable.
```javascript
const state = { count: 0 }

let localCount = state.count

// we changed the value in the object
state.count++ 

// but localCount did not change and is not tied to the object
console.log(localCount) // 0
localCount = 5
console.log(state.count) // 1
```

The same happens with `reactive`. There is no Vue magic here, the same principle as with a plain object. We read the value from `reactive`, and then it is no longer tied to `reactive`.

Does this mean we cannot use destructuring with `reactive`? No, but we need to understand the use case.

## We want to read a value from `reactive` and get the current value from it

It's worth considering using plain `computed` for such cases. Sometimes it can be a more readable and logical solution. Especially when you need to get a value from a deeply nested field.

```javascript
const state = reactive({ count: 0 })
const localCount = computed(() => state.count)

console.log(localCount.value) // 0
state.count++
console.log(localCount.value) // 1 ✅
```

## We want to keep the value in sync with `reactive`

In this case we can use Vue's `toRef` or `toRefs`.

- `toRef` — creates a `ref` tied to a specific field of a `reactive` object.
- `toRefs` — creates a set of `ref`s for the fields of a `reactive` object.

```javascript
const state = reactive({ count: 0 })
const { count: localCount } = toRefs(state)
const { count: localCount2 } = toRef(state, 'count')

console.log(localCount.value) // 0
console.log(localCount2.value) // 0
state.count++
console.log(localCount.value) // 1 ✅
console.log(localCount2.value) // 1 ✅
localCount.value++
console.log(state.count) // 2 ✅
localCount2.value++
console.log(state.count) // 3 ✅
```

> Note that `toRefs` will wrap **ALL** fields of the `reactive` object in `ref`s. So for large objects this may not be optimal, especially if you only need to extract some fields.

It's also important to understand that `toRef` is useful not only for working with `reactive` objects, but in general it's a powerful utility for reactivity. It's a good idea to learn its capabilities and use it in your projects when needed.

## We want to optimize computations inside `computed` / `watchEffect`

Here we assume you're already inside some reactive context, e.g. inside `computed` or `watchEffect`. And you're aware that access to fields of a `reactive` object can be costly (or you just want to keep the code shorter). In this case we can use destructuring without fearing to lose reactivity. Because the value will be read from `reactive` inside the reactive context and Vue will track that access.

```javascript
const state = reactive({ deep: { state: { count: 0 } } })
const doubleCount = computed(() => {
  const { count } = state.deep.state
  return count * 2
})

console.log(doubleCount.value) // 0
state.deep.state.count++
console.log(doubleCount.value) // 2 ✅
```

In this case it's strongly not recommended to use `toRef` or `toRefs` instead, since we can already track changes in the `reactive` object. And `toRef` and `toRefs` would be redundant and would only create extra `ref`s inside the reactive context.

## Besides `reactive`, what else does the above apply to?

### Props

A fairly similar situation applies to props. Especially before version `3.5.0`, when destructuring of props was added.

```javascript
// before version 3.5.0
const { count } = defineProps({ count: { type: Number, default: 0 } })

// will not be reactive, because count will be a plain value, not a ref
const doubleCount = computed(() => {
  return count * 2
})
```

In version `3.5.0` support for destructuring props was added. However this is syntactic sugar and specific only to `defineProps`.

```javascript
// starting from version 3.5.0
const { count } = defineProps({ 
  count: { type: Number, default: 0 }
})

// will be reactive, because the compiler knows about count as a prop field
const doubleCount = computed(() => {
  return count * 2 // compiler transforms to props.count * 2
})
```

But as said, this only works with `defineProps`.

```javascript
const props = defineProps({ 
  count: { type: Number, default: 0 }
})
const { count } = props // now count will be a plain value, not a ref

// will not be reactive, because count will be a plain value, not a ref
const doubleCount = computed(() => {
  return count * 2
})
```

### Pinia stores

Much of the above is similar for Pinia stores. However Pinia stores should not be used with `toRefs`, as that is not an optimal approach (Pinia store objects have a more complex structure than plain `reactive` objects). So Pinia provides its own `toRefs` for stores: `storeToRefs`.

```javascript
const store = useCounterStore()
const { count } = storeToRefs(store)

console.log(count.value) // 0
store.increment()
console.log(count.value) // 1 ✅
```

## Special case

Most of what was described above applies when we extract primitive values from a `reactive` object. But there is a special case when we extract an object from a `reactive` object.

```javascript
const state = reactive({ data: { count: 0 } })
const { data } = state

console.log(data) // { count: 0 }
state.data.count++
console.log(data) // { count: 1 } ✅
```

As we can see, `data` remains reactive and we can change its values. And again there is no Vue magic here, the same principle as with a plain object.

```javascript
const state = { data: { count: 0 } }
const { data } = state

console.log(data) // { count: 0 }
state.data.count++
console.log(data) // { count: 1 } ✅
```

The only thing to keep in mind is that an object extracted from a `reactive` object will also be a `reactive` wrapper around that object.

```javascript
import { reactive, isReactive } from 'vue'
const initialState = { data: { count: 0 } }
const state = reactive(initialState)
const { data } = state

console.log(isReactive(data)) // ✅
console.log(isReactive(initialState.data)) // ❌ initial object untouched
```

And it's important to understand that this is a wrapper around the object and they are still linked; Vue tracks changes thanks to the `reactive` wrapper.

```javascript
import { reactive, isReactive } from 'vue'
const initialState = { data: { count: 0 } }
const state = reactive(initialState)
const { data } = state

watchEffect(() => {
  // log on every change to data.count
  console.log(state.data.count)
}, { flush: 'sync' })

data.count++ // ✅ will log 1
console.log(initialState.data.count) // 1 ✅ they are still linked
initialState.data.count++ // won't trigger, because we changed via non-reactive object
console.log(initialState.data.count) // 2 ✅ objects are linked, so changes are reflected
```

The situation above may look confusing, but it's actually quite simple. `reactive` is exactly a wrapper around the object, not the object itself. By itself `reactive` doesn't store anything; it only tracks reads/writes to the object, and all data lives in the plain object.

## What to remember

- None of the above is Vue magic, it's plain JavaScript behavior.
- Destructuring `reactive` gives a plain value, not a `ref`.
- If you need the link — use `computed` / `toRef` / `toRefs`.
- Non-reactive variables "update" only when something else triggers a reactive change.

## Terms and links

- **`reactive()`** — Makes an object reactive (deep proxy). [Docs](https://vuejs.org/api/reactivity-core.html#reactive)
- **`toRef()`** — Swiss army knife for turning various data into a `ref`. [Docs](https://vuejs.org/api/reactivity-utilities.html#toref)
- **`toRefs()`** — Converts a `reactive` object into a set of `ref`s per field. [Docs](https://vuejs.org/api/reactivity-utilities.html#torefs)
- **storeToRefs** — Converts a Pinia store into a set of `ref`s per field. [Docs](https://pinia.vuejs.org/api/pinia/functions/storeToRefs.html)
