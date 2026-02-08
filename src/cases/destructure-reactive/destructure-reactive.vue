<script setup>
import { computed, reactive } from 'vue'
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import { makeView } from '../utils.js'

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
  <slot :view="view" :actions="actions" />
</template>
