<script setup>
import { computed, isReactive, markRaw, reactive, watch } from 'vue'
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import { makeView } from '../utils.js'
import CaseCode from '../../components/case-detail/case-code.vue'
import CaseSteps from '../../components/case-detail/case-steps.vue'
import CaseActions from '../../components/case-detail/case-actions.vue'
import CaseState from '../../components/case-detail/case-state.vue'
import CaseNotes from '../../components/case-detail/case-notes.vue'
import CaseTerms from '../../components/case-detail/case-terms.vue'

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
</script>

<template>
  <div class="case-grid">
    <CaseCode :title="t('case.codeTitle')" :code="currentCase.code" />
    <CaseSteps
      :steps-title="t('case.stepsTitle')"
      :steps="caseText.steps"
      :expected-label="t('case.expectedLabel')"
      :expected="caseText.expected"
    />
    <CaseActions :title="t('case.actionsTitle')" :actions="actions" />
    <CaseState
      :title="t('case.stateTitle')"
      :view-items="view"
      :array-total-label="t('common.arrayTotal')"
    />
    <CaseNotes :title="t('case.notesTitle')" :notes="caseText.notes" />
    <CaseTerms
      :title="t('case.termsTitle')"
      :terms="currentCase.terms"
      :docs-label="t('case.docsLabel')"
      :locale="locale"
    />
  </div>
</template>

<style scoped>
.case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
</style>
