<script setup>
import { reactive } from 'vue'
import { makeView } from './utils.js'

const props = defineProps({
  log: { type: Function, required: true },
  lang: { type: String, required: true },
})

const t =
  props.lang === 'ru'
    ? {
        logState: 'state.count изменился',
        logLocal:
          'localCount изменился, но UI не знает об этом (state не тронут)',
      }
    : {
        logState: 'state.count changed',
        logLocal: 'localCount changed, but UI does not know (state untouched)',
      }

const state = reactive({ count: 0 })
let localCount = state.count

const view = makeView([
  { label: 'state.count', get: () => state.count },
  { label: 'localCount', get: () => localCount },
])

const actions = [
  {
    label: 'state.count++',
    run: () => {
      state.count += 1
      props.log(t.logState)
    },
  },
  {
    label: 'localCount++',
    run: () => {
      localCount += 1
      props.log(t.logLocal)
    },
  },
]

defineExpose({ view, actions })
</script>

<template>
  <div class="case-logic"></div>
</template>
