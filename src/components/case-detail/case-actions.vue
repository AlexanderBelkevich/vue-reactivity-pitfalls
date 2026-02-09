<template>
  <CaseCard>
    <h3>{{ title }}</h3>
    <div class="actions">
      <button
        v-for="action in resolvedActions"
        :key="action.label"
        type="button"
        class="btn"
        @click="action.run"
      >
        {{ action.label }}
      </button>
    </div>
  </CaseCard>
</template>

<script setup>
import { computed } from 'vue'
import CaseCard from './case-card.vue'

const props = defineProps({
  title: { type: String, required: true },
  actions: { type: Array, default: () => [] },
})

const resolvedActions = computed(() => {
  const a = props.actions
  return a && typeof a.value !== 'undefined' ? a.value : Array.isArray(a) ? a : []
})
</script>

<style scoped>
.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 600;
  background: var(--accent);
  color: var(--accent-on);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 10px 18px var(--accent-shadow);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 22px var(--accent-shadow-hover);
}
</style>
