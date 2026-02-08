<template>
  <CaseCard>
    <h3>{{ t('case.notesTitle') }}</h3>
    <ul class="notes">
      <li v-for="note in caseText.notes" :key="note">{{ note }}</li>
    </ul>
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
.notes {
  list-style: disc;
  padding-left: 18px;
  color: var(--muted);
  display: grid;
  gap: 8px;
}
</style>
