<template>
  <CaseCard>
    <h3>{{ title }}</h3>
    <ul class="notes">
      <li v-for="note in notes" :key="note">{{ note }}</li>
    </ul>
  </CaseCard>
</template>

<script setup>
import CaseCard from './case-card.vue'

defineProps({
  title: { type: String, required: true },
  notes: { type: Array, default: () => [] },
})
</script>

<style scoped>
.notes {
  list-style: disc;
  padding-left: 18px;
  color: var(--muted);
  display: grid;
  gap: 8px;
}
</style>
