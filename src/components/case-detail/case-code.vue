<template>
  <CaseCard wide>
    <h3>{{ title }}</h3>
    <div v-html="highlightedCode" class="code"></div>
  </CaseCard>
</template>

<script setup>
import CaseCard from './case-card.vue'

defineProps({
  title: { type: String, required: true },
  highlightedCode: { type: String, default: '' },
})
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
