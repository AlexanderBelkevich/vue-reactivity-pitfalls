import { computed, ref, watch } from 'vue'
import { cases } from './cases'
import { codeToHtml } from 'shiki'
import { useI18n } from './i18n.js'

const selectedIdRef = ref(cases[0]?.id ?? '')
const highlightedCodeRef = ref('')
const logsRef = ref([])

const addLog = (message) => {
  logsRef.value.unshift({
    id: `${Date.now()}-${Math.random()}`,
    time: new Date(),
    message,
  })
}

watch(selectedIdRef, () => {
  logsRef.value = []
})

/**
 * Провайдер кейсов: возвращает ref выбранного id для v-model в корне.
 */
export function useCasesProvider() {
  return { selectedId: selectedIdRef }
}

/**
 * Композабл кейсов: currentCase, caseText, caseCards, highlightedCode, logs, addLog.
 * Зависит от useI18n() для локали. view и actions приходят в CaseDetailGrid через слот кейса.
 */
export function useCases() {
  const { locale } = useI18n()

  const currentCase = computed(
    () => cases.find((item) => item.id === selectedIdRef.value) ?? cases[0],
  )

  const caseText = computed(() => currentCase.value.text[locale.value])

  const caseCards = computed(() =>
    cases.map((item) => ({
      id: item.id,
      title: item.text[locale.value].title,
      short: item.short[locale.value],
    })),
  )

  watch(
    currentCase,
    async (c) => {
      highlightedCodeRef.value = await codeToHtml(c.code.trim(), {
        lang: 'javascript',
        theme: 'vitesse-dark',
      })
    },
    { immediate: true, deep: true },
  )

  return {
    currentCase,
    caseText,
    caseCards,
    selectedId: selectedIdRef,
    highlightedCode: highlightedCodeRef,
    logs: logsRef,
    addLog,
  }
}
