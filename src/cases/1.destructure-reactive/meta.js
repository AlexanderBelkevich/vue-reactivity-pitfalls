import summaryRu from './summary.ru.md?raw'
import summaryEn from './summary.en.md?raw'

export default {
  id: 'destructure-reactive',
  card: {
    ru: { title: 'Деструктуризация reactive', description: 'теряем реактивность' },
    en: { title: 'Destructuring reactive', description: 'reactivity is lost' },
  },
  text: {
    ru: { summary: summaryRu },
    en: { summary: summaryEn },
  },
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
}
