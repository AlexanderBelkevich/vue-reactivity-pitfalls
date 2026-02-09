<script setup>
import { computed, ref } from 'vue'
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import { makeView } from '../utils.js'
import CaseFromMarkdown from '../../components/case-detail/case-from-markdown.vue'
import blockRegistry from './blocks.js'

const { addLog, currentCase, caseText } = useCases()
const { t, locale } = useI18n()
const ui = computed(() => currentCase.value.ui?.[locale.value] ?? {})

const counter = ref({ value: 0 })
let plainValue = counter.value.value

const view = makeView([
  { label: 'counter.value.value', get: () => counter.value.value },
  { label: 'plainValue', get: () => plainValue },
])

const actions = computed(() => [
  {
    label: 'counter.value.value++',
    run: () => {
      counter.value.value += 1
      addLog(ui.value.logCounter)
    },
  },
  {
    label: 'plainValue++',
    run: () => {
      plainValue += 1
      addLog(ui.value.logPlain)
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
