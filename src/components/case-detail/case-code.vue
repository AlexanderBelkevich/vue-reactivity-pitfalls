<template>
  <CaseCard wide>
    <h3>{{ title }}</h3>
    <div v-html="highlightedHtml" class="code"></div>
  </CaseCard>
</template>

<script setup>
import { ref, watch } from 'vue'
import { codeToHtml } from 'shiki'
import CaseCard from './case-card.vue'
import { useTheme, shikiThemeName } from '../../theme.js'

const props = defineProps({
  title: { type: String, required: true },
  code: { type: String, default: '' },
})

const { theme } = useTheme()
const highlightedHtml = ref('')

watch(
  [() => props.code, theme],
  async ([code]) => {
    if (!code?.trim()) {
      highlightedHtml.value = ''
      return
    }
    highlightedHtml.value = await codeToHtml(code.trim(), {
      lang: 'javascript',
      theme: shikiThemeName(theme.value),
    })
  },
  { immediate: true },
)
</script>

<style scoped>
.code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  white-space: pre-wrap;
  padding: 12px;
  border-radius: 12px;
  min-height: 140px;
  border: 1px solid var(--stroke);
}
</style>
