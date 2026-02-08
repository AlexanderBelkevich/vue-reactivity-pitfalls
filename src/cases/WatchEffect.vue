<script setup>
import { reactive, watchEffect } from 'vue'
import { makeView } from './utils.js'

const props = defineProps({
  log: { type: Function, required: true },
  lang: { type: String, required: true },
})

const t =
  props.lang === 'ru'
    ? {
        logEffect: (query, length) =>
          `watchEffect: query=${query}, items=${length}`,
        logQuery: 'query изменен',
        logPush: 'items.push выполнен',
        setQuery: 'query = "pinia"',
        addItem: 'Добавить item',
      }
    : {
        logEffect: (query, length) =>
          `watchEffect: query=${query}, items=${length}`,
        logQuery: 'query changed',
        logPush: 'items.push executed',
        setQuery: 'query = "pinia"',
        addItem: 'Add item',
      }

const state = reactive({
  query: 'vue',
  items: ['vue', 'reactivity', 'watch'],
})

watchEffect(() => {
  props.log(t.logEffect(state.query, state.items.length))
})

const view = makeView([
  { label: 'query', get: () => state.query },
  { label: 'items', get: () => state.items },
])

const actions = [
  {
    label: t.setQuery,
    run: () => {
      state.query = 'pinia'
      props.log(t.logQuery)
    },
  },
  {
    label: t.addItem,
    run: () => {
      state.items.push('pinia')
      props.log(t.logPush)
    },
  },
]

defineExpose({ view, actions })
</script>

<template>
  <div class="case-logic"></div>
</template>
