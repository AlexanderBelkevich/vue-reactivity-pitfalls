<script setup>
import { computed, reactive, toRef } from 'vue'
import { useI18n } from '../i18n.js'
import { useCases } from '../useCases.js'
import { makeView } from './utils.js'

const { addLog } = useCases()

const { locale } = useI18n()
const t = computed(() =>
  locale.value === 'ru'
    ? {
        logA: 'aRef и state.a синхронизированы',
        logB: 'state.b изменился, но b (plain) нет',
      }
    : {
        logA: 'aRef and state.a stay in sync',
        logB: 'state.b changed, but b (plain) did not',
      },
)

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
      addLog(t.value.logA)
    },
  },
  {
    label: 'state.b++',
    run: () => {
      state.b += 1
      addLog(t.value.logB)
    },
  },
])

</script>

<template>
  <slot :view="view" :actions="actions" />
</template>
