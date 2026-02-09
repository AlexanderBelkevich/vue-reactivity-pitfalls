import { ref, watch } from 'vue'

export const STORAGE_KEY = 'vue-reactivity-pitfalls-theme'
export const defaultTheme = 'light'

function getInitialTheme() {
  if (typeof localStorage === 'undefined') return defaultTheme
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return defaultTheme
}

/** Единый ref темы: инициализация из localStorage или prefers-color-scheme */
const themeRef = ref(getInitialTheme())

watch(themeRef, (value) => {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, value)
}, { flush: 'post' })

/**
 * Композабл для корня: возвращает реактивную тему (ref). Корень использует для переключателя.
 */
export function useThemeProvider() {
  return { theme: themeRef }
}

/**
 * Композабл для любого компонента: возвращает текущую тему (ref).
 */
export function useTheme() {
  return { theme: themeRef }
}

/** Имя темы Shiki по значению темы приложения */
export function shikiThemeName(appTheme) {
  return appTheme === 'dark' ? 'vitesse-dark' : 'vitesse-light'
}
