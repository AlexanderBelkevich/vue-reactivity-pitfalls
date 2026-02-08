<script setup>
import { computed, reactive, toRef } from 'vue'
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
