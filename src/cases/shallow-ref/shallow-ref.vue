<script setup>
import { computed, shallowRef, triggerRef, watch } from 'vue'
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import { makeView } from '../utils.js'
import CaseCode from '../../components/case-detail/case-code.vue'
import CaseSteps from '../../components/case-detail/case-steps.vue'
import CaseActions from '../../components/case-detail/case-actions.vue'
import CaseState from '../../components/case-detail/case-state.vue'
import CaseNotes from '../../components/case-detail/case-notes.vue'
import CaseTerms from '../../components/case-detail/case-terms.vue'

const { addLog, currentCase, caseText, highlightedCode } = useCases()
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
</script>

<template>
  <div class="case-grid">
    <CaseCode :title="t('case.codeTitle')" :highlighted-code="highlightedCode" />
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
