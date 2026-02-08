<script setup>
import { computed, reactive, watch } from 'vue'
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import { makeView } from '../utils.js'

const { addLog, currentCase } = useCases()
const { locale } = useI18n()
const ui = computed(() => currentCase.value.ui?.[locale.value] ?? {})

const state = reactive({ list: [3, 1, 2] })
const sorted = computed(() => state.list.sort((a, b) => a - b))
const safeSorted = computed(() => [...state.list].sort((a, b) => a - b))

watch(
  () => state.list,
  () => {
    const msg = (ui.value.logList ?? '').replace(
      '{{value}}',
      state.list.join(', '),
    )
    addLog(msg)
  },
  { deep: true },
)

const view = makeView([
  { label: 'list', get: () => state.list },
  { label: 'sorted (mutates)', get: () => sorted.value },
  { label: 'safeSorted', get: () => safeSorted.value },
])

const actions = computed(() => [
  {
    label: ui.value.addFour,
    run: () => {
      state.list.push(4)
      addLog(ui.value.logPush)
    },
  },
  {
    label: ui.value.shuffle,
    run: () => {
      state.list = [2, 4, 1, 3]
      addLog(ui.value.logReplace)
    },
  },
])

</script>

<template>
  <slot :view="view" :actions="actions" />
</template>
