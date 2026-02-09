<template>
  <CaseCard>
    <h3>{{ title }}</h3>
    <ul class="state-list">
      <li v-for="item in viewItems" :key="item.label">
        <span class="state-label">{{ item.label }}</span>
        <span class="state-value">{{ formatValue(item.get()) }}</span>
      </li>
    </ul>
  </CaseCard>
</template>

<script setup>
import CaseCard from './case-card.vue'

const props = defineProps({
  title: { type: String, required: true },
  viewItems: { type: Array, default: () => [] },
  arrayTotalLabel: { type: String, default: '' },
})

const formatValue = (value) => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    const preview = value.slice(0, 6).join(', ')
    const totalLabel = props.arrayTotalLabel
    return value.length > 6
      ? `[${preview}, …] (${totalLabel} ${value.length})`
      : `[${preview}] (${totalLabel} ${value.length})`
  }
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}
</script>

<style scoped>
.state-list {
  list-style: none;
  display: grid;
  gap: 10px;
}

.state-list li {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.95rem;
}

.state-label {
  color: var(--muted);
}

.state-value {
  font-weight: 600;
}
</style>
