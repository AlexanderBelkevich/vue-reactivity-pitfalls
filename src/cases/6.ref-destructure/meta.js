import summaryRu from './summary.ru.md?raw'
import summaryEn from './summary.en.md?raw'

export default {
  id: 'ref-destructure',
  card: {
    ru: { title: 'Деструктуризация ref', description: 'value превращается в копию' },
    en: { title: 'Destructuring ref', description: 'value becomes a copy' },
  },
  text: {
    ru: {
      title: 'Деструктуризация ref',
      summary: summaryRu,
      plain: 'Вынул значение — получил снимок. Дальше связи нет.',
      steps: [
        'Нажми "counter.value.value++" — plainValue не изменится.',
        'Нажми "plainValue++" — counter.value.value останется прежним.',
        'Снова "counter.value.value++" — UI покажет новое plainValue.',
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
      summary: summaryEn,
      plain: 'You get a snapshot. After that, there is no link.',
      steps: [
        'Click "counter.value.value++" — plainValue does not change.',
        'Click "plainValue++" — counter.value.value stays the same.',
        'Click "counter.value.value++" again — UI shows new plainValue.',
      ],
      expected: 'plainValue changes, but the UI sees it only after a rerender.',
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
  ui: {
    ru: {
      logCounter: 'counter.value.value изменен',
      logPlain: 'plainValue изменен отдельно',
    },
    en: {
      logCounter: 'counter.value.value changed',
      logPlain: 'plainValue changed separately',
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
}
