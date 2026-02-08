export default {
  id: 'destructure-reactive',
  short: {
    ru: 'теряем реактивность',
    en: 'reactivity is lost',
  },
  text: {
    ru: {
      title: 'Деструктуризация reactive',
      summary:
        'Сами по себе поля reactive не являются реактивными. Vue отследитвает обращение к полю в reactive, но не само значение которое там хранится. Когда мы используем деструктуризацию, то мы читаем значение, а дальше оно уже не связано с reactive. И если в случае с объектом, его поля останутся реактивными, то извлекая примитивные значения, мы теряем реактивность.',
      plain:
        'Если применить деструктуризацию к поляем в reactive, то можно потерять реактивность.',
      steps: [
        'Нажми "state.count++" и увидишь, что localCount не меняется.',
        'Нажми "localCount++" — state.count останется прежним.',
        'Снова "state.count++" — localCount обновится из-за ререндера.',
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
      plain: 'The value becomes a plain variable and is no longer tied to state.',
      steps: [
        'Click "state.count++" — localCount does not change.',
        'Click "localCount++" — state.count stays the same.',
        'Click "state.count++" again — localCount updates due to a rerender.',
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
  code: `
const state = reactive({ count: 0 })
const { count } = state

state.count++ // UI updates
// count does not change
`,
  ui: {
    ru: {
      logState: 'state.count изменился',
      logLocal:
        'localCount изменился, но UI не знает об этом (state не тронут)',
    },
    en: {
      logState: 'state.count changed',
      logLocal: 'localCount changed, but UI does not know (state untouched)',
    },
  },
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
}
