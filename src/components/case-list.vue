<template>
  <div class="case-list">
    <h3>{{ t('case.casesTitle') }}</h3>
    <button
      v-for="item in caseCards"
      :key="item.id"
      class="case-item"
      :class="{ 'case-item--active': item.id === currentCase.id }"
      type="button"
      @click="selectCase(item.case)"
    >
      <span class="case-title">{{ item.title }}</span>
      <span class="case-sub">{{ item.description }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cases } from '../cases'
import { useI18n } from '../i18n.js'
import { useCases, useCasesProvider } from '../use-cases.js'

const { t, locale } = useI18n()
const { selectCase } = useCasesProvider()
const { currentCase } = useCases()

const caseCards = computed(() =>
  cases.map((item) => {
    const card = item.card?.[locale.value] ?? {}
    return {
      id: item.id,
      title: card.title ?? item.text?.[locale.value]?.title ?? item.id,
      description: card.description ?? '',
      case: item,
    }
  }),
)
</script>

<style scoped>
.case-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.case-list h3 {
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.case-item {
  text-align: left;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: var(--list-item-bg);
  cursor: pointer;
  transition: border 0.15s ease, transform 0.15s ease;
}

.case-item--active {
  border-color: var(--accent);
  background: var(--card);
}

.case-item:hover {
  transform: translateY(-1px);
}

.case-title {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
}

.case-sub {
  color: var(--muted);
  font-size: 0.85rem;
}
</style>
