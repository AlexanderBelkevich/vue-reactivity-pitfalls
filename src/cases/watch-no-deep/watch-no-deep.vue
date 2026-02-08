<script setup>
import { computed, reactive, watch } from 'vue'
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import { makeView } from '../utils.js'

const { addLog, currentCase } = useCases()
const { locale } = useI18n()
const ui = computed(() => currentCase.value.ui?.[locale.value] ?? {})

const state = reactive({
  profile: { name: 'Ира', skills: ['Vue'] },
})

watch(
  () => state.profile,
  () => addLog(ui.value.logShallow),
)

watch(
  () => state.profile,
  () => addLog(ui.value.logDeep),
  { deep: true },
)

const view = makeView([
  { label: 'name', get: () => state.profile.name },
  { label: 'skills', get: () => state.profile.skills },
])

const actions = computed(() => [
  {
    label: ui.value.addSkill,
    run: () => {
      state.profile.skills.push('Pinia')
      addLog(ui.value.logPush)
    },
  },
  {
    label: ui.value.replaceProfile,
    run: () => {
      state.profile = { name: 'Ира', skills: ['Vue', 'Pinia'] }
      addLog(ui.value.logReplace)
    },
  },
])

</script>

<template>
  <slot :view="view" :actions="actions" />
</template>
