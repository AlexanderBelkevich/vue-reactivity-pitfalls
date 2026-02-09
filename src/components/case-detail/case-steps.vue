<template>
  <CaseCard wide>
    <h3>{{ stepsTitle }}</h3>
    <ol class="steps">
      <li v-for="step in steps" :key="step">{{ step }}</li>
    </ol>
    <div class="expected">
      <span>{{ expectedLabel }}</span>
      {{ expected }}
    </div>
  </CaseCard>
</template>

<script setup>
import CaseCard from './case-card.vue'

defineProps({
  stepsTitle: { type: String, required: true },
  steps: { type: Array, default: () => [] },
  expectedLabel: { type: String, required: true },
  expected: { type: String, default: '' },
})
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
  background: var(--plain-bg);
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
