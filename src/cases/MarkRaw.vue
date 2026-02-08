<script setup>
import { computed, isReactive, markRaw, reactive, watch } from 'vue'
import { useI18n } from '../i18n.js'
import { makeView } from './utils.js'

const props = defineProps({
  log: { type: Function, required: true },
})

const { locale } = useI18n()
const t = computed(() =>
  locale.value === 'ru'
    ? {
        setTheme: 'theme = dark',
        replace: 'Заменить config',
        logTheme: (theme) => `theme изменен: ${theme}`,
        logNoWatch: 'theme установлен на dark (watch не сработает)',
        logReplace: 'config заменен целиком',
      }
    : {
        setTheme: 'theme = dark',
        replace: 'Replace config',
        logTheme: (theme) => `theme changed: ${theme}`,
        logNoWatch: 'theme set to dark (watch will not fire)',
        logReplace: 'config replaced',
      },
)

const rawConfig = markRaw({ theme: 'light' })
const state = reactive({ config: rawConfig })

watch(
  () => state.config.theme,
  () => props.log(t.value.logTheme(state.config.theme)),
)

const view = makeView([
  { label: 'theme', get: () => state.config.theme },
  { label: 'isReactive(config)', get: () => isReactive(state.config) },
])

const actions = computed(() => [
  {
    label: t.value.setTheme,
    run: () => {
      state.config.theme = 'dark'
      props.log(t.value.logNoWatch)
    },
  },
  {
    label: t.value.replace,
    run: () => {
      state.config = { theme: 'neon' }
      props.log(t.value.logReplace)
    },
  },
])

defineExpose({ view, actions })
</script>

<template>
  <div class="case-logic"></div>
</template>
