import summaryRu from './summary.ru.md?raw'
import summaryEn from './summary.en.md?raw'

export default {
  id: 'mark-raw',
  short: {
    ru: 'объект без реактивности',
    en: 'object is raw',
  },
  text: {
    ru: {
      title: 'markRaw',
      summary: summaryRu,
      plain: 'markRaw говорит Vue: "не трогай этот объект". И он не реагирует.',
      steps: [
        'Нажми "theme = dark" — watch не сработает и UI не обновится.',
        'Нажми "Заменить config" — watch сработает, UI обновится.',
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
      summary: summaryEn,
      plain: 'markRaw tells Vue: "do not touch this object". And it does not react.',
      steps: [
        'Click "theme = dark" — watch does not fire and UI stays the same.',
        'Click "Replace config" — watch fires and UI updates.',
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
  ui: {
    ru: {
      setTheme: 'theme = dark',
      replace: 'Заменить config',
      logTheme: 'theme изменен: {{theme}}',
      logNoWatch: 'theme установлен на dark (watch не сработает)',
      logReplace: 'config заменен целиком',
    },
    en: {
      setTheme: 'theme = dark',
      replace: 'Replace config',
      logTheme: 'theme changed: {{theme}}',
      logNoWatch: 'theme set to dark (watch will not fire)',
      logReplace: 'config replaced',
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
}
