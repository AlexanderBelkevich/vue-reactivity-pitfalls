<template>
  <CaseCard wide>
    <h3>{{ t('case.stepsTitle') }}</h3>
    <ol class="steps">
      <li v-for="step in caseText.steps" :key="step">{{ step }}</li>
    </ol>
    <div class="expected">
      <span>{{ t('case.expectedLabel') }}</span>
      {{ caseText.expected }}
    </div>
  </CaseCard>
</template>

<script setup>
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import CaseCard from './case-card.vue'

const { t } = useI18n()
const { caseText } = useCases()
</script>

<style scoped>
.steps {
  padding-left: 18px;
  color: var(--muted);
  display: grid;
  gap: 8px;
  font-size: 0.9rem;
}

.expected {
  margin-top: 12px;
  padding: 10px;
  border-radius: 12px;
  background: #fff6e5;
  border: 1px solid var(--stroke);
  font-size: 0.9rem;
  color: var(--ink);
}

.expected span {
  font-weight: 600;
  margin-right: 6px;
  color: var(--accent-dark);
}
</style>
