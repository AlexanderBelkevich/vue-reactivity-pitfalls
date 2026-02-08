import {
  ref,
} from 'vue'

const makeView = (items) => items.map((item) => ({ label: item.label, get: item.get }))

export default {
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
}