<template>
  <CaseCard wide>
    <h3>{{ t('case.codeTitle') }}</h3>
    <div v-html="highlightedCode" class="code"></div>
  </CaseCard>
</template>

<script setup>
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import CaseCard from './case-card.vue'

const { t } = useI18n()
const { highlightedCode } = useCases()
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
