import {
  isReactive,
  markRaw,
  reactive,
  watch,
} from 'vue'

const makeView = (items) => items.map((item) => ({ label: item.label, get: item.get }))

export default {
  id: 'mark-raw',
  short: {
    ru: 'объект без реактивности',
    en: 'object is raw',
  },
  text: {
    ru: {
      title: 'markRaw',
      summary: 'markRaw исключает объект из реактивной системы. Полезно, но легко забыть.',
      plain: 'markRaw говорит Vue: “не трогай этот объект”. И он не реагирует.',
      steps: [
        'Нажми “theme = dark” — watch не сработает и UI не обновится.',
        'Нажми “Заменить config” — watch сработает, UI обновится.',
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
      summary: 'markRaw removes an object from the reactive system. Useful but easy to forget.',
      plain: 'markRaw tells Vue: “do not touch this object”. And it does not react.',
      steps: [
        'Click “theme = dark” — watch does not fire and UI stays the same.',
        'Click “Replace config” — watch fires and UI updates.',
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
  create({ log, lang }) {
    const t =
      lang === 'ru'
        ? {
            setTheme: 'theme = dark',
            replace: 'Заменить config',
            logTheme: (theme) => `theme изменен: ${theme}`,
            logNoWatch: 'theme установлен на dark (watch не сработает)',
            logReplace: 'config заменен целиком',
          }
        : {
            setTheme: 'theme = dark',
            replace: 'Replace config',
            logTheme: (theme) => `theme changed: ${theme}`,
            logNoWatch: 'theme set to dark (watch will not fire)',
            logReplace: 'config replaced',
          }

    const rawConfig = markRaw({ theme: 'light' })
    const state = reactive({ config: rawConfig })

    watch(
      () => state.config.theme,
      () => log(t.logTheme(state.config.theme)),
    )

    return {
      view: makeView([
        { label: 'theme', get: () => state.config.theme },
        { label: 'isReactive(config)', get: () => isReactive(state.config) },
      ]),
      actions: [
        {
          label: t.setTheme,
          run: () => {
            state.config.theme = 'dark'
            log(t.logNoWatch)
          },
        },
        {
          label: t.replace,
          run: () => {
            state.config = { theme: 'neon' }
            log(t.logReplace)
          },
        },
      ],
    }
  },
}