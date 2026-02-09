import summaryRu from './summary.ru.md?raw'
import summaryEn from './summary.en.md?raw'

export default {
  id: 'watch-no-deep',
  short: {
    ru: 'не видит вложенность',
    en: 'misses nested changes',
  },
  text: {
    ru: {
      title: 'watch без deep',
      summary: summaryRu,
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
      summary: summaryEn,
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
  ui: {
    ru: {
      addSkill: 'Добавить skill',
      replaceProfile: 'Заменить profile',
      logShallow: 'watch (shallow): профиль изменен',
      logDeep: 'watch (deep): внутри что-то поменялось',
      logPush: 'skills.push выполнен',
      logReplace: 'profile заменен целиком',
    },
    en: {
      addSkill: 'Add skill',
      replaceProfile: 'Replace profile',
      logShallow: 'watch (shallow): profile replaced',
      logDeep: 'watch (deep): nested change detected',
      logPush: 'skills.push executed',
      logReplace: 'profile replaced',
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
