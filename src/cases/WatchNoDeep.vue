<script setup>
import { reactive, watch } from 'vue'
import { makeView } from './utils.js'

const props = defineProps({
  log: { type: Function, required: true },
  lang: { type: String, required: true },
})

const t =
  props.lang === 'ru'
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
      }

const state = reactive({
  profile: { name: 'Ира', skills: ['Vue'] },
})

watch(
  () => state.profile,
  () => props.log(t.logShallow),
)

watch(
  () => state.profile,
  () => props.log(t.logDeep),
  { deep: true },
)

const view = makeView([
  { label: 'name', get: () => state.profile.name },
  { label: 'skills', get: () => state.profile.skills },
])

const actions = [
  {
    label: t.addSkill,
    run: () => {
      state.profile.skills.push('Pinia')
      props.log(t.logPush)
    },
  },
  {
    label: t.replaceProfile,
    run: () => {
      state.profile = { name: 'Ира', skills: ['Vue', 'Pinia'] }
      props.log(t.logReplace)
    },
  },
]

defineExpose({ view, actions })
</script>

<template>
  <div class="case-logic"></div>
</template>
