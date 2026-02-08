export default {
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
      summary: 'shallowRef tracks .value replacement, not inner changes.',
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
