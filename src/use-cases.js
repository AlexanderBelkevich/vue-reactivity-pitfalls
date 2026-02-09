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

function getCaseIdFromHash() {
  if (typeof location === 'undefined') return ''
  return (location.hash || '').replace(/^#\/?/, '').trim()
}

function getCaseFromHash() {
  const id = getCaseIdFromHash()
  return cases.find((c) => c.id === id) ?? cases[0]
}

const currentCaseRef = ref(
  typeof location !== 'undefined' ? getCaseFromHash() : undefined,
)

function ensureCurrentCase() {
  if (currentCaseRef.value == null) {
    const fromHash = getCaseFromHash()
    currentCaseRef.value = fromHash
    if (typeof location !== 'undefined') {
      location.hash = '#/' + fromHash.id
    }
  } else if (typeof location !== 'undefined' && !getCaseIdFromHash()) {
    location.hash = '#/' + currentCaseRef.value.id
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    currentCaseRef.value = getCaseFromHash()
  })
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
    const next = caseItem ?? cases[0]
    currentCaseRef.value = next
    if (typeof location !== 'undefined') {
      location.hash = '#/' + next.id
    }
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
