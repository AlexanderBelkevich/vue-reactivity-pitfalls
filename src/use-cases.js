import { computed, ref, watch } from 'vue'
import { useI18n } from './i18n.js'

/**
 * Сборка списка кейсов через Vite glob. Папки — N.name (например cases/1.destructure-reactive); порядок по N.
 */
const caseModules = import.meta.glob('./cases/*/index.js', { eager: true })
const orderKey = (path) => parseInt(path.match(/\/(\d+)\./)?.[1] ?? '0', 10)
const cases = Object.entries(caseModules)
  .map(([path, m]) => ({ order: orderKey(path), case: m.default }))
  .filter((e) => e.case)
  .sort((a, b) => a.order - b.order)
  .map((e) => e.case)

const currentCaseRef = ref(undefined)

function ensureCurrentCase() {
  if (currentCaseRef.value == null) {
    currentCaseRef.value = cases[0]
  }
}
const logsRef = ref([])

const addLog = (message) => {
  logsRef.value.unshift({
    id: `${Date.now()}-${Math.random()}`,
    time: new Date(),
    message,
  })
}

watch(currentCaseRef, () => {
  logsRef.value = []
})

/**
 * Провайдер кейсов: возвращает функцию выбора кейса (принимает объект кейса).
 */
export function useCasesProvider() {
  ensureCurrentCase()
  const selectCase = (caseItem) => {
    currentCaseRef.value = caseItem ?? cases[0]
  }
  return { selectCase }
}

/**
 * Композабл кейсов: currentCase, caseText, logs, addLog.
 * Зависит от useI18n() для локали. Подсветка кода — в case-code.vue.
 */
export function useCases() {
  ensureCurrentCase()
  const { locale } = useI18n()

  const currentCase = currentCaseRef

  const caseText = computed(() => currentCase.value.text[locale.value])

  return {
    currentCase,
    caseText,
    cases,
    logs: logsRef,
    addLog,
  }
}
