import { computed, ref, watch } from 'vue'
import { cases } from './cases'
import { useI18n } from './i18n.js'

const currentCaseRef = ref(cases[0])
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
  const { locale } = useI18n()

  const currentCase = currentCaseRef

  const caseText = computed(() => currentCase.value.text[locale.value])

  return {
    currentCase,
    caseText,
    logs: logsRef,
    addLog,
  }
}
