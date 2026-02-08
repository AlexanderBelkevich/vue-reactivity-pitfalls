<script setup>
import { reactive, toRef } from 'vue'
import { makeView } from './utils.js'

const props = defineProps({
  log: { type: Function, required: true },
  lang: { type: String, required: true },
})

const t =
  props.lang === 'ru'
    ? {
        logA: 'aRef и state.a синхронизированы',
        logB: 'state.b изменился, но b (plain) нет',
      }
    : {
        logA: 'aRef and state.a stay in sync',
        logB: 'state.b changed, but b (plain) did not',
      }

const state = reactive({ a: 1, b: 2 })
const aRef = toRef(state, 'a')
const { b } = state

const view = makeView([
  { label: 'state.a', get: () => state.a },
  { label: 'aRef.value', get: () => aRef.value },
  { label: 'state.b', get: () => state.b },
  { label: 'b (plain)', get: () => b },
])

const actions = [
  {
    label: 'aRef.value++',
    run: () => {
      aRef.value += 1
      props.log(t.logA)
    },
  },
  {
    label: 'state.b++',
    run: () => {
      state.b += 1
      props.log(t.logB)
    },
  },
]

defineExpose({ view, actions })
</script>

<template>
  <div class="case-logic"></div>
</template>
