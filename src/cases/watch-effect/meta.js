export default {
  id: 'watch-effect',
  short: {
    ru: 'лишние триггеры',
    en: 'extra triggers',
  },
  text: {
    ru: {
      title: 'watchEffect',
      summary: 'watchEffect цепляется за всё, что ты прочитал. Часто это лишнее.',
      plain:
        'watchEffect следит за всем, что прочитал внутри функции — иногда слишком много.',
      steps: [
        'Сразу после открытия кейса watchEffect уже сработал.',
        'Нажми "query = pinia" — effect сработает снова.',
        'Нажми "Добавить item" — снова сработает из-за items.length.',
      ],
      expected:
        'watchEffect запускается сразу и реагирует на все зависимости внутри функции.',
      checklist: [
        'Случайно добавил лишнюю зависимость.',
        'Если список большой — эффект может часто перезапускаться.',
        'Нужен контроль — используй watch с явным источником.',
      ],
      notes: [
        'watchEffect не отличает важные зависимости от случайных.',
        'При больших массивах это может стать узким местом.',
      ],
    },
    en: {
      title: 'watchEffect',
      summary: 'watchEffect tracks everything you read. Often that is too much.',
      plain:
        'watchEffect reacts to every value read inside the function, even accidental ones.',
      steps: [
        'Right after opening, watchEffect already ran once.',
        'Click "query = pinia" — it runs again.',
        'Click "Add item" — it runs again because of items.length.',
      ],
      expected:
        'watchEffect runs immediately and reacts to all dependencies inside the function.',
      checklist: [
        'Accidentally added extra dependencies.',
        'On big lists it can rerun too often.',
        'Need control? Use watch with an explicit source.',
      ],
      notes: [
        'watchEffect does not separate important vs accidental deps.',
        'Large arrays can make this a bottleneck.',
      ],
    },
  },
  ui: {
    ru: {
      logEffect: 'watchEffect: query={{query}}, items={{length}}',
      logQuery: 'query изменен',
      logPush: 'items.push выполнен',
      setQuery: 'query = "pinia"',
      addItem: 'Добавить item',
    },
    en: {
      logEffect: 'watchEffect: query={{query}}, items={{length}}',
      logQuery: 'query changed',
      logPush: 'items.push executed',
      setQuery: 'query = "pinia"',
      addItem: 'Add item',
    },
  },
  code: `watchEffect(() => {\n  log(state.query)\n  log(state.items.length)\n})`,
  terms: [
    {
      name: 'watchEffect()',
      desc: {
        ru: 'Автоматически собирает зависимости внутри функции.',
        en: 'Automatically tracks dependencies inside the function.',
      },
      link: 'https://vuejs.org/api/reactivity-core.html#watcheffect',
    },
    {
      name: 'watch()',
      desc: {
        ru: 'Следит за источником и вызывает коллбек при изменениях.',
        en: 'Watches a source and runs a callback on change.',
      },
      link: 'https://vuejs.org/api/reactivity-core.html#watch',
    },
  ],
}
