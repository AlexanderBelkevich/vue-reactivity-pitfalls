import {
  reactive,
  toRef,
} from 'vue'

const makeView = (items) => items.map((item) => ({ label: item.label, get: item.get }))

export default {
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
}