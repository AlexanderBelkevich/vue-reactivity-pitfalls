import { computed, ref, watch } from 'vue'
import { cases } from './cases'
import { codeToHtml } from 'shiki'
import { useI18n } from './i18n.js'

const selectedIdRef = ref(cases[0]?.id ?? '')
const caseRef = ref(null)
const viewItems = ref([])
const actions = ref([])
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

watch(
  caseRef,
  (r) => {
    if (r?.view) {
      viewItems.value = r.view
      actions.value = r.actions
    } else {
      viewItems.value = []
      actions.value = []
    }
  },
  { flush: 'post' },
)

/**
 * Провайдер кейсов: возвращает ref выбранного id для v-model в корне.
 */
export function useCasesProvider() {
  return { selectedId: selectedIdRef }
}

/**
 * Композабл кейсов: currentCase, caseText, caseCards, highlightedCode,
 * caseRef, viewItems, resolvedActions. Зависит от useI18n() для локали.
 * Ref'ы общие (модульный уровень), чтобы привязка caseRef в App обновляла viewItems/actions везде.
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

  const resolvedActions = computed(() => {
    const a = actions.value
    return a && typeof a.value !== 'undefined' ? a.value : Array.isArray(a) ? a : []
  })

  return {
    currentCase,
    caseText,
    caseCards,
    selectedId: selectedIdRef,
    highlightedCode: highlightedCodeRef,
    caseRef,
    viewItems,
    resolvedActions,
    logs: logsRef,
    addLog,
  }
}
