import {
  computed,
  isReactive,
  markRaw,
  reactive,
  ref,
  shallowRef,
  toRef,
  triggerRef,
  watch,
  watchEffect,
} from 'vue'

const makeView = (items) => items.map((item) => ({ label: item.label, get: item.get }))

export const cases = [
  {
    id: 'destructure-reactive',
    short: {
      ru: 'теряем реактивность',
      en: 'reactivity is lost',
    },
    text: {
      ru: {
        title: 'Деструктуризация reactive',
        summary: 'Если вытащить поля из reactive, связь с реактивностью теряется.',
        plain:
          'Значение превращается в обычную переменную и больше не связано со state.',
        steps: [
          'Нажми “state.count++” и увидишь, что localCount не меняется.',
          'Нажми “localCount++” — state.count останется прежним.',
          'Снова “state.count++” — localCount обновится из-за ререндера.',
        ],
        expected:
          'localCount меняется, но UI узнает об этом только при другом ререндере.',
        checklist: [
          'Деструктурировал reactive и ждешь реактивности.',
          'Используешь обычные переменные вместо toRef/toRefs.',
        ],
        notes: [
          'Деструктуризация reactive дает обычное значение, не ref.',
          'Если нужна связь — используй toRef/toRefs.',
          'UI обновится только из-за других реактивных изменений.',
        ],
      },
      en: {
        title: 'Destructuring reactive',
        summary: 'When you destructure a reactive object, the reactive link is lost.',
        plain:
          'The value becomes a plain variable and is no longer tied to state.',
        steps: [
          'Click “state.count++” — localCount does not change.',
          'Click “localCount++” — state.count stays the same.',
          'Click “state.count++” again — localCount updates due to a rerender.',
        ],
        expected:
          'localCount changes, but the UI only sees it after a different rerender.',
        checklist: [
          'You destructured reactive and expected reactivity.',
          'Using plain variables instead of toRef/toRefs.',
        ],
        notes: [
          'Destructuring reactive gives a plain value, not a ref.',
          'If you need the link, use toRef/toRefs.',
          'UI updates only because of other reactive changes.',
        ],
      },
    },
    code: `const state = reactive({ count: 0 })\nconst { count } = state\n\nstate.count++ // UI updates\n// count does not change`,
    terms: [
      {
        name: 'reactive()',
        desc: {
          ru: 'Делает объект реактивным (deep proxy).',
          en: 'Makes an object reactive (deep proxy).',
        },
        link: 'https://vuejs.org/api/reactivity-core.html#reactive',
      },
      {
        name: 'toRefs()',
        desc: {
          ru: 'Преобразует reactive объект в набор ref по полям.',
          en: 'Turns a reactive object into refs per field.',
        },
        link: 'https://vuejs.org/api/reactivity-utilities.html#torefs',
      },
    ],
    create({ log, lang }) {
      const t =
        lang === 'ru'
          ? {
              logState: 'state.count изменился',
              logLocal: 'localCount изменился, но UI не знает об этом (state не тронут)',
            }
          : {
              logState: 'state.count changed',
              logLocal: 'localCount changed, but UI does not know (state untouched)',
            }

      const state = reactive({ count: 0 })
      let localCount = state.count

      return {
        view: makeView([
          { label: 'state.count', get: () => state.count },
          { label: 'localCount', get: () => localCount },
        ]),
        actions: [
          {
            label: 'state.count++',
            run: () => {
              state.count += 1
              log(t.logState)
            },
          },
          {
            label: 'localCount++',
            run: () => {
              localCount += 1
              log(t.logLocal)
            },
          },
        ],
      }
    },
  },
  {
    id: 'toref-torefs',
    short: {
      ru: 'спасти реактивность',
      en: 'keep it reactive',
    },
    text: {
      ru: {
        title: 'toRef / toRefs',
        summary: 'toRef и toRefs сохраняют связь с reactive, деструктуризация — нет.',
        plain: 'toRef связывает переменную с полем объекта. Деструктуризация — копия.',
        steps: [
          'Нажми “aRef.value++” — state.a меняется вместе с aRef.',
          'Нажми “state.b++” — b (plain) не меняется.',
        ],
        expected: 'toRef сохраняет связь с reactive, а деструктуризация — нет.',
        checklist: [
          'Нужна реактивность — используй toRef/toRefs.',
          'Не деструктурируй reactive напрямую.',
        ],
        notes: [
          'toRef привязывает одно поле к reactive.',
          'toRefs делает это для всех полей сразу.',
        ],
      },
      en: {
        title: 'toRef / toRefs',
        summary: 'toRef and toRefs keep the link to reactive, destructuring does not.',
        plain: 'toRef links a variable to a field. Destructuring is just a copy.',
        steps: [
          'Click “aRef.value++” — state.a changes with aRef.',
          'Click “state.b++” — b (plain) stays the same.',
        ],
        expected: 'toRef keeps the link to reactive, destructuring does not.',
        checklist: [
          'Need reactivity? Use toRef/toRefs.',
          'Do not destructure reactive directly.',
        ],
        notes: [
          'toRef binds a single field to reactive.',
          'toRefs does the same for all fields.',
        ],
      },
    },
    code: `const state = reactive({ a: 1, b: 2 })\nconst aRef = toRef(state, 'a')\nconst { b } = state // plain value\n\naRef.value++ // state.a changes`,
    terms: [
      {
        name: 'toRef()',
        desc: {
          ru: 'Создает ref, связанный с конкретным полем reactive объекта.',
          en: 'Creates a ref linked to a field on a reactive object.',
        },
        link: 'https://vuejs.org/api/reactivity-utilities.html#toref',
      },
      {
        name: 'reactive()',
        desc: {
          ru: 'Делает объект реактивным (deep proxy).',
          en: 'Makes an object reactive (deep proxy).',
        },
        link: 'https://vuejs.org/api/reactivity-core.html#reactive',
      },
    ],
    create({ log, lang }) {
      const t =
        lang === 'ru'
          ? {
              logA: 'aRef и state.a синхронизированы',
              logB: 'state.b изменился, но b (plain) нет',
            }
          : {
              logA: 'aRef and state.a stay in sync',
              logB: 'state.b changed, but b (plain) did not',
            }

      const state = reactive({ a: 1, b: 2 })
      const aRef = toRef(state, 'a')
      const { b } = state

      return {
        view: makeView([
          { label: 'state.a', get: () => state.a },
          { label: 'aRef.value', get: () => aRef.value },
          { label: 'state.b', get: () => state.b },
          { label: 'b (plain)', get: () => b },
        ]),
        actions: [
          {
            label: 'aRef.value++',
            run: () => {
              aRef.value += 1
              log(t.logA)
            },
          },
          {
            label: 'state.b++',
            run: () => {
              state.b += 1
              log(t.logB)
            },
          },
        ],
      }
    },
  },
  {
    id: 'watch-no-deep',
    short: {
      ru: 'не видит вложенность',
      en: 'misses nested changes',
    },
    text: {
      ru: {
        title: 'watch без deep',
        summary: 'watch по объекту без deep реагирует на ссылку, а не на поля.',
        plain: 'Пока ссылка та же, watch молчит. Срабатывает при замене объекта.',
        steps: [
          'Нажми “Добавить skill” — сработает только deep.',
          'Нажми “Заменить profile” — сработают оба.',
        ],
        expected: 'Shallow watch ловит только смену ссылки, deep — изменения внутри.',
        checklist: [
          'Ожидаешь реакцию на вложенные поля без deep.',
          'Используешь deep там, где проще заменить объект.',
        ],
        notes: [
          'Вложенные поля не триггерят shallow watch.',
          'deep = true помогает, но может быть дорогим.',
        ],
      },
      en: {
        title: 'watch without deep',
        summary: 'watch on an object without deep reacts to the reference, not fields.',
        plain: 'Same reference — watch is silent. It fires on object replacement.',
        steps: [
          'Click “Add skill” — only deep watch fires.',
          'Click “Replace profile” — both fire.',
        ],
        expected: 'Shallow watch catches reference changes; deep catches nested changes.',
        checklist: [
          'Expecting nested changes without deep.',
          'Using deep where replacing the object is simpler.',
        ],
        notes: [
          'Nested fields do not trigger shallow watch.',
          'deep = true helps, but can be costly.',
        ],
      },
    },
    code: `watch(() => state.profile, () => log('shallow'))\nwatch(() => state.profile, () => log('deep'), { deep: true })`,
    terms: [
      {
        name: 'watch()',
        desc: {
          ru: 'Следит за источником и вызывает коллбек при изменениях.',
          en: 'Watches a source and runs a callback on change.',
        },
        link: 'https://vuejs.org/api/reactivity-core.html#watch',
      },
      {
        name: 'deep option',
        desc: {
          ru: 'Опция, которая заставляет watch следить за вложенными изменениями.',
          en: 'Option that makes watch track nested changes.',
        },
        link: 'https://vuejs.org/api/reactivity-core.html#watch',
      },
    ],
    create({ log, lang }) {
      const t =
        lang === 'ru'
          ? {
              logShallow: 'watch (shallow): профиль изменен',
              logDeep: 'watch (deep): внутри что-то поменялось',
              addSkill: 'Добавить skill',
              replaceProfile: 'Заменить profile',
              logPush: 'skills.push выполнен',
              logReplace: 'profile заменен целиком',
            }
          : {
              logShallow: 'watch (shallow): profile replaced',
              logDeep: 'watch (deep): nested change detected',
              addSkill: 'Add skill',
              replaceProfile: 'Replace profile',
              logPush: 'skills.push executed',
              logReplace: 'profile replaced',
            }

      const state = reactive({
        profile: { name: 'Ира', skills: ['Vue'] },
      })

      watch(
        () => state.profile,
        () => log(t.logShallow),
      )

      watch(
        () => state.profile,
        () => log(t.logDeep),
        { deep: true },
      )

      return {
        view: makeView([
          { label: 'name', get: () => state.profile.name },
          { label: 'skills', get: () => state.profile.skills },
        ]),
        actions: [
          {
            label: t.addSkill,
            run: () => {
              state.profile.skills.push('Pinia')
              log(t.logPush)
            },
          },
          {
            label: t.replaceProfile,
            run: () => {
              state.profile = { name: 'Ира', skills: ['Vue', 'Pinia'] }
              log(t.logReplace)
            },
          },
        ],
      }
    },
  },
  {
    id: 'watch-effect',
    short: {
      ru: 'лишние триггеры',
      en: 'extra triggers',
    },
    text: {
      ru: {
        title: 'watchEffect',
        summary: 'watchEffect цепляется за всё, что ты прочитал. Часто это лишнее.',
        plain:
          'watchEffect следит за всем, что прочитал внутри функции — иногда слишком много.',
        steps: [
          'Сразу после открытия кейса watchEffect уже сработал.',
          'Нажми “query = pinia” — effect сработает снова.',
          'Нажми “Добавить item” — снова сработает из-за items.length.',
        ],
        expected:
          'watchEffect запускается сразу и реагирует на все зависимости внутри функции.',
        checklist: [
          'Случайно добавил лишнюю зависимость.',
          'Если список большой — эффект может часто перезапускаться.',
          'Нужен контроль — используй watch с явным источником.',
        ],
        notes: [
          'watchEffect не отличает важные зависимости от случайных.',
          'При больших массивах это может стать узким местом.',
        ],
      },
      en: {
        title: 'watchEffect',
        summary: 'watchEffect tracks everything you read. Often that is too much.',
        plain:
          'watchEffect reacts to every value read inside the function, even accidental ones.',
        steps: [
          'Right after opening, watchEffect already ran once.',
          'Click “query = pinia” — it runs again.',
          'Click “Add item” — it runs again because of items.length.',
        ],
        expected:
          'watchEffect runs immediately and reacts to all dependencies inside the function.',
        checklist: [
          'Accidentally added extra dependencies.',
          'On big lists it can rerun too often.',
          'Need control? Use watch with an explicit source.',
        ],
        notes: [
          'watchEffect does not separate important vs accidental deps.',
          'Large arrays can make this a bottleneck.',
        ],
      },
    },
    code: `watchEffect(() => {\n  log(state.query)\n  log(state.items.length)\n})`,
    terms: [
      {
        name: 'watchEffect()',
        desc: {
          ru: 'Автоматически собирает зависимости внутри функции.',
          en: 'Automatically tracks dependencies inside the function.',
        },
        link: 'https://vuejs.org/api/reactivity-core.html#watcheffect',
      },
      {
        name: 'watch()',
        desc: {
          ru: 'Следит за источником и вызывает коллбек при изменениях.',
          en: 'Watches a source and runs a callback on change.',
        },
        link: 'https://vuejs.org/api/reactivity-core.html#watch',
      },
    ],
    create({ log, lang }) {
      const t =
        lang === 'ru'
          ? {
              logEffect: (query, length) =>
                `watchEffect: query=${query}, items=${length}`,
              logQuery: 'query изменен',
              logPush: 'items.push выполнен',
              setQuery: 'query = "pinia"',
              addItem: 'Добавить item',
            }
          : {
              logEffect: (query, length) =>
                `watchEffect: query=${query}, items=${length}`,
              logQuery: 'query changed',
              logPush: 'items.push executed',
              setQuery: 'query = "pinia"',
              addItem: 'Add item',
            }

      const state = reactive({
        query: 'vue',
        items: ['vue', 'reactivity', 'watch'],
      })

      watchEffect(() => {
        log(t.logEffect(state.query, state.items.length))
      })

      return {
        view: makeView([
          { label: 'query', get: () => state.query },
          { label: 'items', get: () => state.items },
        ]),
        actions: [
          {
            label: t.setQuery,
            run: () => {
              state.query = 'pinia'
              log(t.logQuery)
            },
          },
          {
            label: t.addItem,
            run: () => {
              state.items.push('pinia')
              log(t.logPush)
            },
          },
        ],
      }
    },
  },
  {
    id: 'computed-mutation',
    short: {
      ru: 'sort() меняет источник',
      en: 'sort() mutates source',
    },
    text: {
      ru: {
        title: 'computed с мутирующей логикой',
        summary: 'Если в computed есть мутации, ты меняешь исходные данные.',
        plain: 'computed должен быть “чистым”, а sort() меняет исходный массив.',
        steps: [
          'Сразу после открытия list уже отсортирован — computed его “потрогал”.',
          'Нажми “Перемешать”, чтобы обновить list.',
          'Смотри, как sorted меняет исходный list (mutates).',
        ],
        expected: 'Мутирующие методы в computed меняют исходные данные даже при чтении.',
        checklist: [
          'Используешь sort/reverse/splice внутри computed.',
          'Не создаешь копию массива перед сортировкой.',
        ],
        notes: [
          'sort, reverse, splice — мутирующие методы.',
          'Используй копию массива: [...list].sort()',
          'Чтение computed может менять list, если внутри есть мутации.',
        ],
      },
      en: {
        title: 'computed with mutations',
        summary: 'If computed mutates data, you change the source itself.',
        plain: 'computed should be pure, but sort() mutates the original array.',
        steps: [
          'Right after opening, list is already sorted — computed touched it.',
          'Click “Shuffle”, then watch the list change.',
          'Notice sorted mutates the original list.',
        ],
        expected: 'Mutating methods inside computed change source data even on read.',
        checklist: [
          'Using sort/reverse/splice inside computed.',
          'Not copying arrays before sorting.',
        ],
        notes: [
          'sort, reverse, splice are mutating methods.',
          'Use a copy: [...list].sort()',
          'Reading computed can change list if it mutates inside.',
        ],
      },
    },
    code: `const sorted = computed(() => list.sort())\n// sort mutates list in-place`,
    terms: [
      {
        name: 'computed()',
        desc: {
          ru: 'Кэшируемое значение, пересчитывается при изменении зависимостей.',
          en: 'A cached value recomputed when dependencies change.',
        },
        link: 'https://vuejs.org/api/reactivity-core.html#computed',
      },
      {
        name: 'reactive()',
        desc: {
          ru: 'Делает объект реактивным (deep proxy).',
          en: 'Makes an object reactive (deep proxy).',
        },
        link: 'https://vuejs.org/api/reactivity-core.html#reactive',
      },
    ],
    create({ log, lang }) {
      const t =
        lang === 'ru'
          ? {
              addFour: 'Добавить 4',
              shuffle: 'Перемешать',
              logPush: 'list.push(4)',
              logReplace: 'list заменен',
              logList: (list) => `list изменен: ${list.join(', ')}`,
            }
          : {
              addFour: 'Add 4',
              shuffle: 'Shuffle',
              logPush: 'list.push(4)',
              logReplace: 'list replaced',
              logList: (list) => `list changed: ${list.join(', ')}`,
            }

      const state = reactive({ list: [3, 1, 2] })
      const sorted = computed(() => state.list.sort((a, b) => a - b))
      const safeSorted = computed(() => [...state.list].sort((a, b) => a - b))

      watch(
        () => state.list,
        () => log(t.logList(state.list)),
        { deep: true },
      )

      return {
        view: makeView([
          { label: 'list', get: () => state.list },
          { label: 'sorted (mutates)', get: () => sorted.value },
          { label: 'safeSorted', get: () => safeSorted.value },
        ]),
        actions: [
          {
            label: t.addFour,
            run: () => {
              state.list.push(4)
              log(t.logPush)
            },
          },
          {
            label: t.shuffle,
            run: () => {
              state.list = [2, 4, 1, 3]
              log(t.logReplace)
            },
          },
        ],
      }
    },
  },
  {
    id: 'ref-destructure',
    short: {
      ru: 'value превращается в копию',
      en: 'value becomes a copy',
    },
    text: {
      ru: {
        title: 'Деструктуризация ref',
        summary: 'Если вытащить поля из ref.value, реактивность тоже теряется.',
        plain: 'Вынул значение — получил снимок. Дальше связи нет.',
        steps: [
          'Нажми “counter.value.value++” — plainValue не изменится.',
          'Нажми “plainValue++” — counter.value.value останется прежним.',
          'Снова “counter.value.value++” — UI покажет новое plainValue.',
        ],
        expected: 'plainValue меняется, но UI узнает об этом только при ререндере.',
        checklist: [
          'Деструктурируешь ref.value и ждешь реактивности.',
          'Не используешь toRef/toRefs.',
        ],
        notes: [
          'Деструктуризация — это копия, не реактивное соединение.',
          'Используй toRef/toRefs или работай через counter.value.',
          'UI обновится только после реактивного изменения.',
        ],
      },
      en: {
        title: 'Destructuring ref',
        summary: 'If you destructure ref.value, reactivity is lost too.',
        plain: 'You get a snapshot. After that, there is no link.',
        steps: [
          'Click “counter.value.value++” — plainValue does not change.',
          'Click “plainValue++” — counter.value.value stays the same.',
          'Click “counter.value.value++” again — UI shows new plainValue.',
        ],
        expected: 'plainValue changes, but UI sees it only after a rerender.',
        checklist: [
          'Destructuring ref.value and expecting reactivity.',
          'Not using toRef/toRefs.',
        ],
        notes: [
          'Destructuring gives a copy, not a reactive link.',
          'Use toRef/toRefs or work via counter.value.',
          'UI updates only after a reactive change.',
        ],
      },
    },
    code: `const counter = ref({ value: 0 })\nconst { value } = counter.value\n\ncounter.value.value++ // value does not change`,
    terms: [
      {
        name: 'ref()',
        desc: {
          ru: 'Реактивная обертка для примитивов и объектов через .value.',
          en: 'Reactive wrapper for primitives and objects via .value.',
        },
        link: 'https://vuejs.org/api/reactivity-core.html#ref',
      },
      {
        name: 'toRef()',
        desc: {
          ru: 'Создает ref, связанный с конкретным полем reactive объекта.',
          en: 'Creates a ref linked to a field on a reactive object.',
        },
        link: 'https://vuejs.org/api/reactivity-utilities.html#toref',
      },
    ],
    create({ log, lang }) {
      const t =
        lang === 'ru'
          ? {
              logCounter: 'counter.value.value изменен',
              logPlain: 'plainValue изменен отдельно',
            }
          : {
              logCounter: 'counter.value.value changed',
              logPlain: 'plainValue changed separately',
            }

      const counter = ref({ value: 0 })
      let plainValue = counter.value.value

      return {
        view: makeView([
          { label: 'counter.value.value', get: () => counter.value.value },
          { label: 'plainValue', get: () => plainValue },
        ]),
        actions: [
          {
            label: 'counter.value.value++',
            run: () => {
              counter.value.value += 1
              log(t.logCounter)
            },
          },
          {
            label: 'plainValue++',
            run: () => {
              plainValue += 1
              log(t.logPlain)
            },
          },
        ],
      }
    },
  },
  {
    id: 'shallow-ref',
    short: {
      ru: 'внутри не отслеживается',
      en: 'inner changes ignored',
    },
    text: {
      ru: {
        title: 'shallowRef',
        summary: 'shallowRef отслеживает замену .value, а не изменения внутри объекта.',
        plain: 'Поля можно менять, но Vue не узнает, пока не сделать triggerRef.',
        steps: [
          'Нажми “count++ (без triggerRef)” — watch молчит.',
          'Нажми “triggerRef(data)” — watch сработает.',
          'Нажми “Заменить объект” — watch сработает.',
        ],
        expected: 'shallowRef видит только замену .value или triggerRef — иначе UI молчит.',
        checklist: [
          'Забываешь triggerRef после изменения полей.',
          'Ожидаешь deep реактивность от shallowRef.',
        ],
        notes: [
          'shallowRef удобен для больших объектов, но требует ручного triggerRef.',
        ],
      },
      en: {
        title: 'shallowRef',
        summary: 'shallowRef tracks .value replacement, not inner changes.',
        plain: 'You can change fields, but Vue will not know until triggerRef.',
        steps: [
          'Click “count++ (no triggerRef)” — watch stays silent.',
          'Click “triggerRef(data)” — watch runs.',
          'Click “Replace object” — watch runs.',
        ],
        expected: 'shallowRef sees only .value replacement or triggerRef — otherwise UI is silent.',
        checklist: [
          'Forgetting triggerRef after changing fields.',
          'Expecting deep reactivity from shallowRef.',
        ],
        notes: [
          'shallowRef is useful for big objects but needs manual triggerRef.',
        ],
      },
    },
    code: `const data = shallowRef({ count: 0 })\n// data.value.count++ does not trigger\ntriggerRef(data)`,
    terms: [
      {
        name: 'shallowRef()',
        desc: {
          ru: 'Реактивен только .value, внутренности не трекаются.',
          en: 'Only .value is reactive; inner changes are not tracked.',
        },
        link: 'https://vuejs.org/api/reactivity-advanced.html#shallowref',
      },
      {
        name: 'triggerRef()',
        desc: {
          ru: 'Ручной триггер реактивности для shallowRef.',
          en: 'Manually triggers reactivity for shallowRef.',
        },
        link: 'https://vuejs.org/api/reactivity-advanced.html#triggerref',
      },
    ],
    create({ log, lang }) {
      const t =
        lang === 'ru'
          ? {
              noTrigger: 'count++ (без triggerRef)',
              trigger: 'triggerRef(data)',
              replace: 'Заменить объект',
              logSilent: 'count изменен, но watch молчит',
              logTrigger: 'triggerRef вызван',
              logReplace: 'data.value заменен',
              logWatch: (count) => `watch: count=${count}`,
            }
          : {
              noTrigger: 'count++ (no triggerRef)',
              trigger: 'triggerRef(data)',
              replace: 'Replace object',
              logSilent: 'count changed, but watch is silent',
              logTrigger: 'triggerRef called',
              logReplace: 'data.value replaced',
              logWatch: (count) => `watch: count=${count}`,
            }

      const data = shallowRef({ count: 0 })

      watch(
        data,
        () => log(t.logWatch(data.value.count)),
        { deep: true },
      )

      return {
        view: makeView([
          { label: 'data.value.count', get: () => data.value.count },
        ]),
        actions: [
          {
            label: t.noTrigger,
            run: () => {
              data.value.count += 1
              log(t.logSilent)
            },
          },
          {
            label: t.trigger,
            run: () => {
              triggerRef(data)
              log(t.logTrigger)
            },
          },
          {
            label: t.replace,
            run: () => {
              data.value = { count: data.value.count + 1 }
              log(t.logReplace)
            },
          },
        ],
      }
    },
  },
  {
    id: 'mark-raw',
    short: {
      ru: 'объект без реактивности',
      en: 'object is raw',
    },
    text: {
      ru: {
        title: 'markRaw',
        summary: 'markRaw исключает объект из реактивной системы. Полезно, но легко забыть.',
        plain: 'markRaw говорит Vue: “не трогай этот объект”. И он не реагирует.',
        steps: [
          'Нажми “theme = dark” — watch не сработает и UI не обновится.',
          'Нажми “Заменить config” — watch сработает, UI обновится.',
        ],
        expected: 'markRaw исключает объект из реактивности.',
        checklist: [
          'Используешь markRaw и ждешь обновлений.',
          'Хочешь реактивность — не помечай объект как raw.',
        ],
        notes: [
          'markRaw нужен, когда не хочешь прокси вокруг объекта.',
          'Изменения внутри raw не триггерят обновления.',
        ],
      },
      en: {
        title: 'markRaw',
        summary: 'markRaw removes an object from the reactive system. Useful but easy to forget.',
        plain: 'markRaw tells Vue: “do not touch this object”. And it does not react.',
        steps: [
          'Click “theme = dark” — watch does not fire and UI stays the same.',
          'Click “Replace config” — watch fires and UI updates.',
        ],
        expected: 'markRaw excludes the object from reactivity.',
        checklist: [
          'Using markRaw and expecting updates.',
          'Need reactivity? Do not mark it raw.',
        ],
        notes: [
          'markRaw is for objects you do not want proxied.',
          'Changes inside raw objects do not trigger updates.',
        ],
      },
    },
    code: `const rawConfig = markRaw({ theme: 'light' })\nconst state = reactive({ config: rawConfig })`,
    terms: [
      {
        name: 'markRaw()',
        desc: {
          ru: 'Исключает объект из реактивности.',
          en: 'Excludes an object from reactivity.',
        },
        link: 'https://vuejs.org/api/reactivity-advanced.html#markraw',
      },
      {
        name: 'reactive()',
        desc: {
          ru: 'Делает объект реактивным (deep proxy).',
          en: 'Makes an object reactive (deep proxy).',
        },
        link: 'https://vuejs.org/api/reactivity-core.html#reactive',
      },
    ],
    create({ log, lang }) {
      const t =
        lang === 'ru'
          ? {
              setTheme: 'theme = dark',
              replace: 'Заменить config',
              logTheme: (theme) => `theme изменен: ${theme}`,
              logNoWatch: 'theme установлен на dark (watch не сработает)',
              logReplace: 'config заменен целиком',
            }
          : {
              setTheme: 'theme = dark',
              replace: 'Replace config',
              logTheme: (theme) => `theme changed: ${theme}`,
              logNoWatch: 'theme set to dark (watch will not fire)',
              logReplace: 'config replaced',
            }

      const rawConfig = markRaw({ theme: 'light' })
      const state = reactive({ config: rawConfig })

      watch(
        () => state.config.theme,
        () => log(t.logTheme(state.config.theme)),
      )

      return {
        view: makeView([
          { label: 'theme', get: () => state.config.theme },
          { label: 'isReactive(config)', get: () => isReactive(state.config) },
        ]),
        actions: [
          {
            label: t.setTheme,
            run: () => {
              state.config.theme = 'dark'
              log(t.logNoWatch)
            },
          },
          {
            label: t.replace,
            run: () => {
              state.config = { theme: 'neon' }
              log(t.logReplace)
            },
          },
        ],
      }
    },
  },
]
