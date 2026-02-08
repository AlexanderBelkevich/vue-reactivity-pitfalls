<script setup>
import { computed, reactive, watch } from 'vue'
import { useI18n } from '../i18n.js'
import { useCases } from '../useCases.js'
import { makeView } from './utils.js'

const { addLog } = useCases()

const { locale } = useI18n()
const t = computed(() =>
  locale.value === 'ru'
    ? {
        logShallow: 'watch (shallow): профиль изменен',
        logDeep: 'watch (deep): внутри что-то поменялось',
        addSkill: 'Добавить skill',
        replaceProfile: 'Заменить profile',
        logPush: 'skills.push выполнен',
        logReplace: 'profile заменен целиком',
      }
    : {
        logShallow: 'watch (shallow): profile replaced',
        logDeep: 'watch (deep): nested change detected',
        addSkill: 'Add skill',
        replaceProfile: 'Replace profile',
        logPush: 'skills.push executed',
        logReplace: 'profile replaced',
      },
)

const state = reactive({
  profile: { name: 'Ира', skills: ['Vue'] },
})

watch(
  () => state.profile,
  () => addLog(t.value.logShallow),
)

watch(
  () => state.profile,
  () => addLog(t.value.logDeep),
  { deep: true },
)

const view = makeView([
  { label: 'name', get: () => state.profile.name },
  { label: 'skills', get: () => state.profile.skills },
])

const actions = computed(() => [
  {
    label: t.value.addSkill,
    run: () => {
      state.profile.skills.push('Pinia')
      addLog(t.value.logPush)
    },
  },
  {
    label: t.value.replaceProfile,
    run: () => {
      state.profile = { name: 'Ира', skills: ['Vue', 'Pinia'] }
      addLog(t.value.logReplace)
    },
  },
])

</script>

<template>
  <slot :view="view" :actions="actions" />
</template>
