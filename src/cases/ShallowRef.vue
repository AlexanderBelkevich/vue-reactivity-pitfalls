<script setup>
import { computed, shallowRef, triggerRef, watch } from 'vue'
import { useI18n } from '../i18n.js'
import { makeView } from './utils.js'

const props = defineProps({
  log: { type: Function, required: true },
})

const { locale } = useI18n()
const t = computed(() =>
  locale.value === 'ru'
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
      },
)

const data = shallowRef({ count: 0 })

watch(
  data,
  () => props.log(t.value.logWatch(data.value.count)),
  { deep: true },
)

const view = makeView([
  { label: 'data.value.count', get: () => data.value.count },
])

const actions = computed(() => [
  {
    label: t.value.noTrigger,
    run: () => {
      data.value.count += 1
      props.log(t.value.logSilent)
    },
  },
  {
    label: t.value.trigger,
    run: () => {
      triggerRef(data)
      props.log(t.value.logTrigger)
    },
  },
  {
    label: t.value.replace,
    run: () => {
      data.value = { count: data.value.count + 1 }
      props.log(t.value.logReplace)
    },
  },
])

defineExpose({ view, actions })
</script>

<template>
  <div class="case-logic"></div>
</template>
