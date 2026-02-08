<script setup>
import { shallowRef, triggerRef, watch } from 'vue'
import { makeView } from './utils.js'

const props = defineProps({
  log: { type: Function, required: true },
  lang: { type: String, required: true },
})

const t =
  props.lang === 'ru'
    ? {
        noTrigger: 'count++ (без triggerRef)',
        trigger: 'triggerRef(data)',
        replace: 'Заменить объект',
        logSilent: 'count изменен, но watch молчит',
        logTrigger: 'triggerRef вызван',
        logReplace: 'data.value заменен',
        logWatch: (count) => `watch: count=${count}`,
      }
    : {
        noTrigger: 'count++ (no triggerRef)',
        trigger: 'triggerRef(data)',
        replace: 'Replace object',
        logSilent: 'count changed, but watch is silent',
        logTrigger: 'triggerRef called',
        logReplace: 'data.value replaced',
        logWatch: (count) => `watch: count=${count}`,
      }

const data = shallowRef({ count: 0 })

watch(
  data,
  () => props.log(t.logWatch(data.value.count)),
  { deep: true },
)

const view = makeView([
  { label: 'data.value.count', get: () => data.value.count },
])

const actions = [
  {
    label: t.noTrigger,
    run: () => {
      data.value.count += 1
      props.log(t.logSilent)
    },
  },
  {
    label: t.trigger,
    run: () => {
      triggerRef(data)
      props.log(t.logTrigger)
    },
  },
  {
    label: t.replace,
    run: () => {
      data.value = { count: data.value.count + 1 }
      props.log(t.logReplace)
    },
  },
]

defineExpose({ view, actions })
</script>

<template>
  <div class="case-logic"></div>
</template>
