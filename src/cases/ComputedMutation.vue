<script setup>
import { computed, reactive, watch } from 'vue'
import { makeView } from './utils.js'

const props = defineProps({
  log: { type: Function, required: true },
  lang: { type: String, required: true },
})

const t =
  props.lang === 'ru'
    ? {
        addFour: 'Добавить 4',
        shuffle: 'Перемешать',
        logPush: 'list.push(4)',
        logReplace: 'list заменен',
        logList: (list) => `list изменен: ${list.join(', ')}`,
      }
    : {
        addFour: 'Add 4',
        shuffle: 'Shuffle',
        logPush: 'list.push(4)',
        logReplace: 'list replaced',
        logList: (list) => `list changed: ${list.join(', ')}`,
      }

const state = reactive({ list: [3, 1, 2] })
const sorted = computed(() => state.list.sort((a, b) => a - b))
const safeSorted = computed(() => [...state.list].sort((a, b) => a - b))

watch(
  () => state.list,
  () => props.log(t.logList(state.list)),
  { deep: true },
)

const view = makeView([
  { label: 'list', get: () => state.list },
  { label: 'sorted (mutates)', get: () => sorted.value },
  { label: 'safeSorted', get: () => safeSorted.value },
])

const actions = [
  {
    label: t.addFour,
    run: () => {
      state.list.push(4)
      props.log(t.logPush)
    },
  },
  {
    label: t.shuffle,
    run: () => {
      state.list = [2, 4, 1, 3]
      props.log(t.logReplace)
    },
  },
]

defineExpose({ view, actions })
</script>

<template>
  <div class="case-logic"></div>
</template>
