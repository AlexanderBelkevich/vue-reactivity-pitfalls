<template>
  <header class="case-header">
    <h2>{{ caseText.title }}</h2>
    <MarkdownOut :content="caseText.summary" />
    <MarkdownOut class="plain" :content="plain" />
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import MarkdownOut from '../markdown-out.vue';

const { t } = useI18n()
const { caseText } = useCases()

const plain = computed(() => {
  return `${t.value('case.plainLabel')} ${caseText.value?.plain ?? ''}`
})
</script>

<style scoped>
.case-header {
  grid-column: 1 / -1;
}

.case-header h2 {
  font-size: 1.6rem;
  margin-bottom: 8px;
}

.case-header p {
  color: var(--muted);
  margin-bottom: 18px;
}

.plain {
  background: var(--plain-bg);
  border: 1px solid var(--stroke);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 0.95rem;
  color: var(--ink);
  margin-bottom: 16px;
}
</style>
