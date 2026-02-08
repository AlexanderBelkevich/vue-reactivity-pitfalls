<script setup>
import { computed, reactive } from 'vue'
import { useI18n } from '../i18n.js'
import { useCases } from '../useCases.js'
import { makeView } from './utils.js'

const { addLog } = useCases()

const { locale } = useI18n()
const t = computed(() =>
  locale.value === 'ru'
    ? {
        logState: 'state.count изменился',
        logLocal:
          'localCount изменился, но UI не знает об этом (state не тронут)',
      }
    : {
        logState: 'state.count changed',
        logLocal: 'localCount changed, but UI does not know (state untouched)',
      },
)

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
      addLog(t.value.logState)
    },
  },
  {
    label: 'localCount++',
    run: () => {
      localCount += 1
      addLog(t.value.logLocal)
    },
  },
])

defineExpose({ view, actions })
</script>

<template>
  <div class="case-logic"></div>
</template>
