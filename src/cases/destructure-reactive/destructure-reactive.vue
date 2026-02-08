<script setup>
import { computed, reactive } from 'vue'
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import { makeView } from '../utils.js'
import CaseCode from '../../components/case-detail/case-code.vue'
import CaseSteps from '../../components/case-detail/case-steps.vue'
import CaseActions from '../../components/case-detail/case-actions.vue'
import CaseState from '../../components/case-detail/case-state.vue'
import CaseNotes from '../../components/case-detail/case-notes.vue'
import CaseTerms from '../../components/case-detail/case-terms.vue'

const { addLog, currentCase } = useCases()
const { locale } = useI18n()
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
</script>

<template>
  <div class="case-grid">
    <CaseCode />
    <CaseSteps />
    <CaseActions :actions="actions" />
    <CaseState :view-items="view" />
    <CaseNotes />
    <CaseTerms />
  </div>
</template>

<style scoped>
.case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
</style>
