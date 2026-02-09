import { computed, ref } from 'vue'

export const defaultLocale = 'ru'

export const supportedLocales = ['ru', 'en']

function getLocaleFromUrl() {
  if (typeof location === 'undefined') return null
  const lang = new URLSearchParams(location.search).get('lang')
  return supportedLocales.includes(lang) ? lang : null
}

function setLocaleInUrl(lang) {
  if (typeof location === 'undefined' || !supportedLocales.includes(lang)) return
  const url = new URL(location.href)
  url.searchParams.set('lang', lang)
  history.replaceState(null, '', url)
}

export const messages = {
  ru: {
    'hero.title': 'Подводные камни реактивности',
    'hero.subtitle':
      'Небольшая песочница: кликай на действия и смотри, где Vue ведет себя неожиданно.',
    'hero.authorLabel': 'Автор',
    'hero.authorLink': 'Telegram-группа',
    'hero.authorName': 'Александр Белькевич',
    'hero.themeLight': 'Светлая тема',
    'hero.themeDark': 'Тёмная тема',
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
    'hero.themeLight': 'Light theme',
    'hero.themeDark': 'Dark theme',
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

// Единый ref локали: при загрузке берётся из URL (?lang=), иначе defaultLocale
const localeRef = ref(
  typeof location !== 'undefined' ? (getLocaleFromUrl() ?? defaultLocale) : defaultLocale,
)

if (typeof location !== 'undefined' && !getLocaleFromUrl()) {
  setLocaleInUrl(localeRef.value)
}

/**
 * Композабл для корня приложения: возвращает реактивную локаль (ref) и setLocale.
 * setLocale обновляет локаль и записывает её в URL (?lang=), чтобы сохранялась между запросами.
 */
export function useLocaleProvider() {
  const setLocale = (lang) => {
    if (!supportedLocales.includes(lang)) return
    localeRef.value = lang
    setLocaleInUrl(lang)
  }
  return { locale: localeRef, setLocale }
}


/**
 * Композабл для любого компонента: возвращает t(key) и текущую локаль.
 * Локаль берётся из провайдера (useLocaleProvider). Без provide/inject.
 */
export function useI18n() {
  const t = computed(
    () => (key) => messages[localeRef.value]?.[key] ?? key,
  )
  return { t, locale: localeRef }
}
