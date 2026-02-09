Fields in `reactive` are not reactive by themselves.
Vue tracks access to a field in `reactive`, but not the value stored there.
When we use destructuring, we read the value, and then it is no longer tied to `reactive`.
And if in the case of an object, its fields will remain reactive, then extracting primitive values, we lose reactivity.