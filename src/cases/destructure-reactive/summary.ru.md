Сами по себе поля `reactive` не являются реактивными.
Vue отследитвает обращение к полю в `reactive`, но не само значение которое там хранится.
Когда мы используем деструктуризацию, то мы читаем значение, а дальше оно уже не связано с `reactive`.
И если в случае с объектом, его поля останутся реактивными, то извлекая примитивные значения, мы теряем реактивность.

Это схоже с тем как если бы мы работали с обычным объектом, а не с `reactive`.
```javascript
const state = { count: 0 }

let localCount = state.count

// мы поменяли значение в объекте
state.count++ 

// но localCount не изменился и не связан с объектом
console.log(localCount) // 0
localCount = 5
console.log(state.count) // 1
```

Но виновата ли деструктуризация? Нет, деструктуризация просто читает значение из объекта. Тоже самое произошло бы если бы мы использовали обычную переменную.
```javascript
const state = { count: 0 }

let localCount = state.count

// мы поменяли значение в объекте
state.count++ 

// но localCount не изменился и не связан с объектом
console.log(localCount) // 0
localCount = 5
console.log(state.count) // 1
```

Тоже самое и происходит с `reactive`. Никакой магии Vue тут нет, тот же самый принцип, что и с обычным объектом. Мы читаем значение из `reactive`, а дальше оно уже не связано с `reactive`.

Значит ли это что мы не можем использовать деструктуризацию с `reactive`? Нет, но нам нужно понять сценарий использования.

## Хотим читать значение из `reactive` и получать из него актуальное значение

Стоит задуматься об использовании просто `computed` для таких случаев. Иногда это может быть более читаемым и логичным решением. Особенно если нужно получать значение из глубоко вложенного поля.

```javascript
const state = reactive({ count: 0 })
const localCount = computed(() => state.count)

console.log(localCount.value) // 0
state.count++
console.log(localCount.value) // 1 ✅
```

## Хотим синхронизировать значение с `reactive`

В этом случае мы можем использовать специальные методы Vue `toRef` или `toRefs`.

- `toRef` — создает `ref`, связанный с конкретным полем `reactive` объекта.
- `toRefs` — создает набор `ref` по полям `reactive` объекта.

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

## Хотим оптимизировать вычисления внутри `computed` / `watchEffect`

Тут предполагается, что вы уже внутри некоторого реактивного контекста, например внутри `computed` или `watchEffect`. И вы осознаете, что доступ к полям `reactive` объекта может быть дорогим (либо вам просто хочется сделать запись короче). В этом случае мы можем использовать деструктуризацию не боясь потерять реактивность. Так как значение будет читаться из `reactive` внутри реактивного контекста и Vue будет отслеживать это обращение.

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

В данном случае строго не рекомендуется наоборот использовать `toRef` или `toRefs`, так как мы и так можем отслеживать изменения в `reactive` объекте. А `toRef` и `toRefs` будут просто избыточными и будут порождать лишние `ref` внутри реактивного контекста.

## Для чего кроме `reactive` описанное выше является верным?

Достаточно схожая ситуация обстоит пропсами. Особенно до версии `3.5.0`, где была добавлена поддержка деструктуризации пропсов.
