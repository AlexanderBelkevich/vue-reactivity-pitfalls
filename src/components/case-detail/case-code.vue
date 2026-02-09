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

const props = defineProps({
  title: { type: String, required: true },
  code: { type: String, default: '' },
})

const highlightedHtml = ref('')

watch(
  () => props.code,
  async (code) => {
    if (!code?.trim()) {
      highlightedHtml.value = ''
      return
    }
    highlightedHtml.value = await codeToHtml(code.trim(), {
      lang: 'javascript',
      theme: 'vitesse-dark',
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
  background: #0d0f12;
  color: #f7f2e8;
  padding: 12px;
  border-radius: 12px;
  min-height: 140px;
}
</style>
