<script setup>
import { computed, ref } from 'vue'
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
