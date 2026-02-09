<script setup>
import { computed, isReactive, markRaw, reactive, watch } from 'vue'
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import { makeView } from '../utils.js'
import CaseFromMarkdown from '../../components/case-detail/case-from-markdown.vue'
import blockRegistry from './blocks.js'

const { addLog, currentCase, caseText } = useCases()
const { t, locale } = useI18n()
const ui = computed(() => currentCase.value.ui?.[locale.value] ?? {})

const rawConfig = markRaw({ theme: 'light' })
const state = reactive({ config: rawConfig })

watch(
  () => state.config.theme,
  () => {
    const msg = (ui.value.logTheme ?? '').replace(
      '{{theme}}',
      state.config.theme,
    )
    addLog(msg)
  },
)

const view = makeView([
  { label: 'theme', get: () => state.config.theme },
  { label: 'isReactive(config)', get: () => isReactive(state.config) },
])

const actions = computed(() => [
  {
    label: ui.value.setTheme,
    run: () => {
      state.config.theme = 'dark'
      addLog(ui.value.logNoWatch)
    },
  },
  {
    label: ui.value.replace,
    run: () => {
      state.config = { theme: 'neon' }
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
