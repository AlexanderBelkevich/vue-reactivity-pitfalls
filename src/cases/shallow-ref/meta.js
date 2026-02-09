import summaryRu from './summary.ru.md?raw'
import summaryEn from './summary.en.md?raw'

export default {
  id: 'shallow-ref',
  short: {
    ru: 'внутри не отслеживается',
    en: 'inner changes ignored',
  },
  text: {
    ru: {
      title: 'shallowRef',
      summary: summaryRu,
      plain: 'Поля можно менять, но Vue не узнает, пока не сделать triggerRef.',
      steps: [
        'Нажми "count++ (без triggerRef)" — watch молчит.',
        'Нажми "triggerRef(data)" — watch сработает.',
        'Нажми "Заменить объект" — watch сработает.',
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
      summary: summaryEn,
      plain: 'You can change fields, but Vue will not know until triggerRef.',
      steps: [
        'Click "count++ (no triggerRef)" — watch stays silent.',
        'Click "triggerRef(data)" — watch runs.',
        'Click "Replace object" — watch runs.',
      ],
      expected:
        'shallowRef sees only .value replacement or triggerRef — otherwise UI is silent.',
      checklist: [
        'Forgetting triggerRef after changing fields.',
        'Expecting deep reactivity from shallowRef.',
      ],
      notes: [
        'shallowRef is useful for big objects but needs manual triggerRef.',
      ],
    },
  },
  ui: {
    ru: {
      noTrigger: 'count++ (без triggerRef)',
      trigger: 'triggerRef(data)',
      replace: 'Заменить объект',
      logSilent: 'count изменен, но watch молчит',
      logTrigger: 'triggerRef вызван',
      logReplace: 'data.value заменен',
      logWatch: 'watch: count={{count}}',
    },
    en: {
      noTrigger: 'count++ (no triggerRef)',
      trigger: 'triggerRef(data)',
      replace: 'Replace object',
      logSilent: 'count changed, but watch is silent',
      logTrigger: 'triggerRef called',
      logReplace: 'data.value replaced',
      logWatch: 'watch: count={{count}}',
    },
  },
  code: `const data = shallowRef({ count: 0 })\n// data.value.count++ does not trigger\ntriggerRef(data)`,
  terms: [
    {
      name: 'shallowRef()',
      desc: {
        ru: 'Реактивен только .value; внутренние изменения не отслеживаются.',
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
}
