<script setup>
import { computed, shallowRef, triggerRef, watch } from 'vue'
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import { makeView } from '../utils.js'
import CaseFromMarkdown from '../../components/case-detail/case-from-markdown.vue'
import blockRegistry from './blocks.js'

const { addLog, currentCase, caseText } = useCases()
const { t, locale } = useI18n()
const ui = computed(() => currentCase.value.ui?.[locale.value] ?? {})

const data = shallowRef({ count: 0 })

watch(
  data,
  () => {
    const msg = (ui.value.logWatch ?? '').replace(
      '{{count}}',
      String(data.value.count),
    )
    addLog(msg)
  },
  { deep: true },
)

const view = makeView([
  { label: 'data.value.count', get: () => data.value.count },
])

const actions = computed(() => [
  {
    label: ui.value.noTrigger,
    run: () => {
      data.value.count += 1
      addLog(ui.value.logSilent)
    },
  },
  {
    label: ui.value.trigger,
    run: () => {
      triggerRef(data)
      addLog(ui.value.logTrigger)
    },
  },
  {
    label: ui.value.replace,
    run: () => {
      data.value = { count: data.value.count + 1 }
      addLog(ui.value.logReplace)
    },
  },
])

const content = computed(() => caseText.value?.summary ?? '')

const context = computed(() => ({
  currentCase,
  caseText,
  t,
  locale,
  actions,
  view,
}))
</script>

<template>
  <CaseFromMarkdown
    :content="content"
    :block-registry="blockRegistry"
    :context="context"
  />
</template>
