<template>
  <CaseCard>
    <h3>{{ t('case.actionsTitle') }}</h3>
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
import { useI18n } from '../../i18n.js'
import CaseCard from './case-card.vue'

const props = defineProps({
  actions: { type: Array, default: () => [] },
})

const { t } = useI18n()

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
  color: white;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 10px 18px rgba(255, 107, 53, 0.25);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 22px rgba(255, 107, 53, 0.32);
}
</style>
