<script setup>
import { computed, reactive } from 'vue'
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import { makeView } from '../utils.js'
import CaseFromMarkdown from '../../components/case-detail/case-from-markdown.vue'
import blockRegistry from './blocks.js'

const { addLog, currentCase, caseText } = useCases()
const { t, locale } = useI18n()
const ui = computed(() => currentCase.value.ui?.[locale.value] ?? {})

const state = reactive({ count: 0 })
let localCount = state.count

const view = makeView([
  { label: 'state.count', get: () => state.count },
  { label: 'localCount', get: () => localCount },
])

const actions = computed(() => [
  {
    label: 'state.count++',
    run: () => {
      state.count += 1
      addLog(ui.value.logState)
    },
  },
  {
    label: 'localCount++',
    run: () => {
      localCount += 1
      addLog(ui.value.logLocal)
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
