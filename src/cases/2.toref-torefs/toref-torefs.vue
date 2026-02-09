<script setup>
import { computed, reactive, toRef } from 'vue'
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import { makeView } from '../utils.js'
import CaseFromMarkdown from '../../components/case-detail/case-from-markdown.vue'
import blockRegistry from './blocks.js'

const { addLog, currentCase, caseText } = useCases()
const { t, locale } = useI18n()
const ui = computed(() => currentCase.value.ui?.[locale.value] ?? {})

const state = reactive({ a: 1, b: 2 })
const aRef = toRef(state, 'a')
const { b } = state

const view = makeView([
  { label: 'state.a', get: () => state.a },
  { label: 'aRef.value', get: () => aRef.value },
  { label: 'state.b', get: () => state.b },
  { label: 'b (plain)', get: () => b },
])

const actions = computed(() => [
  {
    label: 'aRef.value++',
    run: () => {
      aRef.value += 1
      addLog(ui.value.logA)
    },
  },
  {
    label: 'state.b++',
    run: () => {
      state.b += 1
      addLog(ui.value.logB)
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
