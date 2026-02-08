<template>
  <CaseCard>
    <h3>{{ t('case.termsTitle') }}</h3>
    <div class="terms">
      <article
        v-for="item in currentCase.terms"
        :key="item.name"
        class="terms__item"
      >
        <div class="terms__title">{{ item.name }}</div>
        <div class="terms__desc">{{ item.desc[locale] }}</div>
        <a
          class="terms__link"
          :href="item.link"
          target="_blank"
          rel="noreferrer"
        >
          {{ t('case.docsLabel') }}
        </a>
      </article>
    </div>
  </CaseCard>
</template>

<script setup>
import { useI18n } from '../../i18n.js'
import { useCases } from '../../use-cases.js'
import CaseCard from './case-card.vue'

const { t, locale } = useI18n()
const { currentCase } = useCases()
</script>

<style scoped>
.terms {
  display: grid;
  gap: 10px;
}

.terms__item {
  background: #fffdf8;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid var(--stroke);
  display: grid;
  gap: 6px;
}

.terms__title {
  font-weight: 700;
}

.terms__desc {
  color: var(--muted);
  font-size: 0.9rem;
}

.terms__link {
  color: var(--accent-dark);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.terms__link:hover {
  text-decoration: underline;
}
</style>
