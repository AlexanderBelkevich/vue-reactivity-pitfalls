<script setup>
import { computed, reactive, watchEffect } from 'vue'
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import { makeView } from '../utils.js'

const { addLog, currentCase } = useCases()
const { locale } = useI18n()
const ui = computed(() => currentCase.value.ui?.[locale.value] ?? {})

const state = reactive({
  query: 'vue',
  items: ['vue', 'reactivity', 'watch'],
})

watchEffect(() => {
  const msg = (ui.value.logEffect ?? '')
    .replace('{{query}}', state.query)
    .replace('{{length}}', String(state.items.length))
  addLog(msg)
})

const view = makeView([
  { label: 'query', get: () => state.query },
  { label: 'items', get: () => state.items },
])

const actions = computed(() => [
  {
    label: ui.value.setQuery,
    run: () => {
      state.query = 'pinia'
      addLog(ui.value.logQuery)
    },
  },
  {
    label: ui.value.addItem,
    run: () => {
      state.items.push('pinia')
      addLog(ui.value.logPush)
    },
  },
])

</script>

<template>
  <slot :view="view" :actions="actions" />
</template>
