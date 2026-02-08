<script setup>
import { computed, reactive, watchEffect } from 'vue'
import { useI18n } from '../i18n.js'
import { useCases } from '../useCases.js'
import { makeView } from './utils.js'

const { addLog } = useCases()

const { locale } = useI18n()
const t = computed(() =>
  locale.value === 'ru'
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
      },
)

const state = reactive({
  query: 'vue',
  items: ['vue', 'reactivity', 'watch'],
})

watchEffect(() => {
  addLog(t.value.logEffect(state.query, state.items.length))
})

const view = makeView([
  { label: 'query', get: () => state.query },
  { label: 'items', get: () => state.items },
])

const actions = computed(() => [
  {
    label: t.value.setQuery,
    run: () => {
      state.query = 'pinia'
      addLog(t.value.logQuery)
    },
  },
  {
    label: t.value.addItem,
    run: () => {
      state.items.push('pinia')
      addLog(t.value.logPush)
    },
  },
])

</script>

<template>
  <slot :view="view" :actions="actions" />
</template>
