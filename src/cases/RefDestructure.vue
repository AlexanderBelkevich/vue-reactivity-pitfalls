<script setup>
import { ref } from 'vue'
import { makeView } from './utils.js'

const props = defineProps({
  log: { type: Function, required: true },
  lang: { type: String, required: true },
})

const t =
  props.lang === 'ru'
    ? {
        logCounter: 'counter.value.value изменен',
        logPlain: 'plainValue изменен отдельно',
      }
    : {
        logCounter: 'counter.value.value changed',
        logPlain: 'plainValue changed separately',
      }

const counter = ref({ value: 0 })
let plainValue = counter.value.value

const view = makeView([
  { label: 'counter.value.value', get: () => counter.value.value },
  { label: 'plainValue', get: () => plainValue },
])

const actions = [
  {
    label: 'counter.value.value++',
    run: () => {
      counter.value.value += 1
      props.log(t.logCounter)
    },
  },
  {
    label: 'plainValue++',
    run: () => {
      plainValue += 1
      props.log(t.logPlain)
    },
  },
]

defineExpose({ view, actions })
</script>

<template>
  <div class="case-logic"></div>
</template>
