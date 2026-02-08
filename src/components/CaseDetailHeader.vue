<template>
  <header class="case-header">
    <h2>{{ caseText.title }}</h2>
    <p>{{ caseText.summary }}</p>
    <div class="plain">
      {{ t('case.plainLabel') }} {{ caseText.plain }}
    </div>
  </header>
</template>

<script setup>
import { useI18n } from '../i18n.js'

defineProps({
  caseText: {
    type: Object,
    required: true,
  },
})

const { t } = useI18n()
</script>

<style scoped>
.case-header h2 {
  font-size: 1.6rem;
  margin-bottom: 8px;
}

.case-header p {
  color: var(--muted);
  margin-bottom: 18px;
}

.plain {
  background: #fff6e5;
  border: 1px solid var(--stroke);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 0.95rem;
  color: var(--ink);
  margin-bottom: 16px;
}
</style>
