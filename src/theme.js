import { ref } from 'vue'

export const defaultTheme = 'light'

/** Единый ref темы: создаётся в провайдере, доступен через useThemeProvider / useTheme */
const themeRef = ref(defaultTheme)

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
