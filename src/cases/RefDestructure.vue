<script setup>
import { computed, ref } from 'vue'
import { useI18n } from '../i18n.js'
import { useCases } from '../useCases.js'
import { makeView } from './utils.js'

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
  <slot :view="view" :actions="actions" />
</template>
