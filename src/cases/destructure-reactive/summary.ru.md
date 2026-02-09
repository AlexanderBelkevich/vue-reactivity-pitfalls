> **По-простому:** если применить деструктуризацию к полям в `reactive`, можно потерять реактивность.

## Код

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

## Как тестировать

- Нажми "state.count++" и увидишь, что `localCount` не меняется.
- Нажми "localCount++" — `state.count` останется прежним.
- Снова "state.count++" — `localCount` обновится из-за ререндера.

Ожидаемо: `localCount` меняется, но UI узнает об этом только при другом ререндере.

::: actions
::: state

## Почему так происходит?

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

> Стоит отметить, что `toRefs` обернет **ВСЕ** поля `reactive` объекта в `ref`'ы. Поэтому для больших объектов это может быть не оптимально, особенно если вам нужно извлечь только некоторые поля.

Также важно понимать, что `toRef` полезен не только для работы с `reactive` объектами, но и в целом это мощная утилита для работы с реактивностью. И желательно ознакомиться с ее возможностями и использовать ее в своих проектах при необходимости.

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

### Пропсы

Достаточно схожая ситуация обстоит пропсами. Особенно до версии `3.5.0`, где была добавлена поддержка деструктуризации пропсов.

```javascript
// до версии 3.5.0
const { count } = defineProps({ count: { type: Number, default: 0 } })

// не будет реактивным, так как count будет просто значением, а не ref
const doubleCount = computed(() => {
  return count * 2
})
```

В версии `3.5.0` была добавлена поддержка деструктуризации пропсов. Однако это синтаксический сахар и специфичен только для `defineProps`.

```javascript
// начиная с версии 3.5.0
const { count } = defineProps({ 
  count: { type: Number, default: 0 }
})

// будет реактивным, та как компилятор знает о count как о поле props
const doubleCount = computed(() => {
  return count * 2 // компилятор преобразует в props.count * 2
})
```

Но как и было сказано, это работает только для `defineProps`.

```javascript
const props = defineProps({ 
  count: { type: Number, default: 0 }
})
const { count } = props // теперь count будет просто значением, а не ref

// не будет реактивным, так как count будет просто значением, а не ref
const doubleCount = computed(() => {
  return count * 2
})
```

### Для pinia-сторов

Многое сказанное выше схоже с `pinia`-сторами. Однако `pinia` сторы нельзя использовать с `toRefs`, так как это не является оптимальным подходом (у `pinia` объекты сторов имеют более сложную структуру, чем обычные `reactive` объекты). Поэтому `pinia` предоставляет свою собственную функцию `toRefs` для сторов: `storeToRefs`.

```javascript
const store = useCounterStore()
const { count } = storeToRefs(store)

console.log(count.value) // 0
store.increment()
console.log(count.value) // 1 ✅
```

## Особый случай

Все описанное выше по большей мере относится когда мы извлекаем примитивные значения из `reactive` объекта. Но есть особый случай, когда мы извлекаем объект из `reactive` объекта.

```javascript
const state = reactive({ data: { count: 0 } })
const { data } = state

console.log(data) // { count: 0 }
state.data.count++
console.log(data) // { count: 1 } ✅
```

Как мы видим, `data` остается реактивным и мы можем изменять его значения. И тут вновь никакой магии Vue тут нет, тот же самый принцип, что и с обычным объектом. 

```javascript
const state = { data: { count: 0 } }
const { data } = state

console.log(data) // { count: 0 }
state.data.count++
console.log(data) // { count: 1 } ✅
```

Единственное что нужно участь, что объект извлекаемый из `reactive` объекта будет тоже `reactive`-оберткой над объектом.

```javascript
import { reactive, isReactive } from 'vue'
const initialState = { data: { count: 0 } }
const state = reactive(initialState)
const { data } = state

console.log(isReactive(data)) // ✅
console.log(isReactive(initialState.data)) // ❌ начальный объект не тронут
```

И тут важно понимать, что это обертка над объектом и они все еще связаны, просто Vue отслеживает изменения благодаря `reactive`-обертке.

```javascript
import { reactive, isReactive } from 'vue'
const initialState = { data: { count: 0 } }
const state = reactive(initialState)
const { data } = state

watchEffect(() => {
  // выводим на каждое изменение в data.count
  console.log(state.data.count)
}, { flush: 'sync' })

data.count++ // ✅ выведет 1
console.log(initialState.data.count) // 1 ✅ они все еще связаны
initialState.data.count++ // не выведется, так как мы изменили через нереактивный объект
console.log(initialState.data.count) // 2 ✅ объекты связаны, поэтому изменения отражаются
```

Ситуация выше выглядит запутанной, но на самом деле все достаточно просто. `reactive` это именно обертка над объектом, а не сам объект. Сам по себе `reactive` ничего не хранит, он лишь отслеживает чтения/записи в объект, а все данные хранятся в обычном объекте.

## Что важно помнить

- Все описанное выше не магия Vue, а обычная логика работы с JavaScript.
- Деструктуризация `reactive` дает обычное значение, не `ref`.
- Если нужна связь — используй `computed`/`toRef`/`toRefs`.
- Нереактивные переменные "обновляются" только когда кто-то другой вызывает реактивное изменение.

## Термины и ссылки

- **`reactive()`** — Делает объект реактивным (deep proxy). [Документация](https://vuejs.org/api/reactivity-core.html#reactive)
- **`toRef()`** — Швейцарский нож для превращения различных данных в `ref`. [Документация](https://vuejs.org/api/reactivity-utilities.html#toref)
- **`toRefs()`** — Преобразует `reactive` объект в набор `ref` по полям. [Документация](https://vuejs.org/api/reactivity-utilities.html#torefs)
- **storeToRefs** — Преобразует `pinia`-стор в набор `ref` по полям. [Документация](https://pinia.vuejs.org/api/pinia/functions/storeToRefs.html)