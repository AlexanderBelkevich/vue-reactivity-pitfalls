export default {
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
        'Нажми "Добавить skill" — сработает только deep.',
        'Нажми "Заменить profile" — сработают оба.',
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
        'Click "Add skill" — only deep watch fires.',
        'Click "Replace profile" — both fire.',
      ],
      expected:
        'Shallow watch catches reference changes; deep catches nested changes.',
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
}
