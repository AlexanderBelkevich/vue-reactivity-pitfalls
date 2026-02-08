import { computed } from 'vue'

export const defaultLocale = 'ru'

export const messages = {
  ru: {
    'hero.title': 'Подводные камни реактивности',
    'hero.subtitle':
      'Небольшая песочница: кликай на действия и смотри, где Vue ведет себя неожиданно.',
    'hero.authorLabel': 'Автор',
    'hero.authorLink': 'Telegram-группа',
    'hero.authorName': 'Александр Белькевич',
    'case.casesTitle': 'Кейсы',
    'case.plainLabel': 'По-простому:',
    'case.codeTitle': 'Код',
    'case.stepsTitle': 'Как тестировать',
    'case.expectedLabel': 'Ожидаемо:',
    'case.actionsTitle': 'Действия',
    'case.stateTitle': 'Состояние',
    'case.notesTitle': 'Что важно помнить',
    'case.termsTitle': 'Термины и ссылки',
    'case.docsLabel': 'Документация',
    'log.title': 'Лог реактивности',
    'log.hint': 'Первые строки — самые свежие события.',
    'log.empty': 'Пока пусто. Запусти любое действие.',
    'common.arrayTotal': 'всего',
  },
  en: {
    'hero.title': 'Reactivity Pitfalls',
    'hero.subtitle':
      'A small playground: click actions and see where Vue behaves unexpectedly.',
    'hero.authorLabel': 'Author',
    'hero.authorLink': 'Telegram group',
    'hero.authorName': 'Alexander Belkevich',
    'case.casesTitle': 'Cases',
    'case.plainLabel': 'In simple words:',
    'case.codeTitle': 'Code',
    'case.stepsTitle': 'How to test',
    'case.expectedLabel': 'Expected:',
    'case.actionsTitle': 'Actions',
    'case.stateTitle': 'State',
    'case.notesTitle': 'Key takeaways',
    'case.termsTitle': 'Terms and links',
    'case.docsLabel': 'Docs',
    'log.title': 'Reactivity log',
    'log.hint': 'Newest events are on top.',
    'log.empty': 'Nothing yet. Run an action.',
    'common.arrayTotal': 'total',
  },
}

export function useI18n(localeRef) {
  const t = computed(
    () => (key) => messages[localeRef.value]?.[key] ?? key,
  )
  return { t, locale: localeRef }
}
